import express from 'express';
import cors from 'cors';
import { pool, transacao } from './db.js';
import { validarEntrada } from './validacao.js';
import { gerarProtocolo } from './protocolo.js';
import { registrarEvento, verificarCadeia } from './historico.js';

export const app = express();
app.use(cors());
app.use(express.json());

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function timeline(id_reclamacao) {
  const { rows } = await pool.query(
    `SELECT l.id_evento, l.id_status, s.nome AS status_nome, l.descricao_evento, l.resposta_cidadao,
            l.ocorrido_em, u.nome AS autor
     FROM log_historico l JOIN status s USING (id_status) JOIN usuario u USING (id_usuario)
     WHERE l.id_reclamacao=$1 ORDER BY l.id_evento`, [id_reclamacao]);
  return rows;
}

app.get('/api/health', wrap(async (_req, res) => {
  await pool.query('select 1');
  res.json({ ok: true });
}));

app.get('/api/categorias', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT id_categoria AS id, nome FROM categoria WHERE ativa ORDER BY nome');
  res.json(rows);
}));

app.post('/api/usuarios', wrap(async (req, res) => {
  const { nome, email } = req.body ?? {};
  if (!nome?.trim() || !email?.includes('@')) {
    return res.status(400).json({ erros: [{ campo: 'nome/email', mensagem: 'Informe nome e e-mail válidos' }] });
  }
  const { rows } = await pool.query(
    `INSERT INTO usuario (nome, email) VALUES ($1, lower($2))
     ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
     RETURNING id_usuario AS id, nome, email, perfil`, [nome.trim(), email.trim()]);
  res.json(rows[0]);
}));

// Sequência da U2: validar -> gerar protocolo -> salvar -> registrar evento -> devolver protocolo.
app.post('/api/reclamacoes', wrap(async (req, res) => {
  const d = req.body ?? {};
  const resultado = await transacao(async (client) => {
    const erros = await validarEntrada(client, d);
    if (erros.length) return { erros };

    let id_obra = null;
    if (d.construtora?.trim()) {
      const nome = d.construtora.trim();
      const o = await client.query('SELECT id_obra FROM obra WHERE construtora=$1 LIMIT 1', [nome]);
      id_obra = o.rows[0]?.id_obra
        ?? (await client.query('INSERT INTO obra (nome, construtora, endereco) VALUES ($1,$1,$2) RETURNING id_obra', [nome, d.endereco])).rows[0].id_obra;
    }
    const protocolo = await gerarProtocolo(client);
    const { rows } = await client.query(
      `INSERT INTO reclamacao (protocolo,id_usuario,id_categoria,id_obra,tipo,descricao,ocorrido_em,frequencia,anonima,endereco,latitude,longitude,referencia,prioridade)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id_reclamacao`,
      [protocolo, d.id_usuario, d.categoria, id_obra, d.tipo, d.descricao.trim(), d.ocorrido_em || null,
       d.frequencia || 'primeira', !!d.anonima, d.endereco.trim(), d.latitude ?? null, d.longitude ?? null,
       d.referencia || null, d.prioridade || 'Média']);
    const id = rows[0].id_reclamacao;
    for (const m of d.midias ?? []) {
      await client.query('INSERT INTO midia (id_reclamacao,tipo,uri) VALUES ($1,$2,$3)', [id, m.tipo, m.uri]);
    }
    await registrarEvento(client, { id_reclamacao: id, id_status: 'pendente', id_usuario: d.id_usuario, descricao_evento: 'Reclamação registrada' });
    return { protocolo, id };
  });
  if (resultado.erros) return res.status(400).json(resultado);
  res.status(201).json(resultado);
}));

app.get('/api/reclamacoes', wrap(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM vw_reclamacao_atual WHERE id_usuario=$1 ORDER BY id_reclamacao DESC', [Number(req.query.usuario) || 0]);
  res.json(rows);
}));

app.get('/api/reclamacoes/:protocolo', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM vw_reclamacao_atual WHERE protocolo=$1', [req.params.protocolo]);
  if (!rows[0]) return res.status(404).json({ erro: 'Protocolo não encontrado' });
  const midias = (await pool.query('SELECT tipo, uri FROM midia WHERE id_reclamacao=$1', [rows[0].id_reclamacao])).rows;
  res.json({ ...rows[0], midias, timeline: await timeline(rows[0].id_reclamacao) });
}));

app.get('/api/admin/reclamacoes', wrap(async (req, res) => {
  const { status, q } = req.query;
  const { rows } = await pool.query(
    `SELECT * FROM vw_reclamacao_atual
     WHERE ($1::text IS NULL OR id_status=$1)
       AND ($2::text IS NULL OR protocolo ILIKE $2 OR endereco ILIKE $2 OR descricao ILIKE $2)
     ORDER BY id_reclamacao DESC`,
    [status || null, q ? `%${q}%` : null]);
  res.json(rows);
}));

// Nunca faz UPDATE de evento: cada mudança de status é um novo evento no log.
app.patch('/api/admin/reclamacoes/:protocolo', wrap(async (req, res) => {
  const { status, resposta, id_atendente } = req.body ?? {};
  const r = await transacao(async (client) => {
    const rec = (await client.query('SELECT id_reclamacao FROM reclamacao WHERE protocolo=$1', [req.params.protocolo])).rows[0];
    if (!rec) return { codigo: 404, corpo: { erro: 'Protocolo não encontrado' } };
    const st = (await client.query('SELECT nome FROM status WHERE id_status=$1', [status])).rows[0];
    const at = (await client.query("SELECT 1 FROM usuario WHERE id_usuario=$1 AND perfil='atendente'", [id_atendente])).rowCount;
    if (!st || !at) return { codigo: 400, corpo: { erros: [{ campo: !st ? 'status' : 'id_atendente', mensagem: 'Valor inválido' }] } };
    await registrarEvento(client, {
      id_reclamacao: rec.id_reclamacao, id_status: status, id_usuario: id_atendente,
      descricao_evento: `Status alterado para ${st.nome}`, resposta_cidadao: resposta?.trim() || null });
    return { codigo: 200, corpo: { ok: true } };
  });
  res.status(r.codigo).json(r.corpo);
}));

app.get('/api/admin/indicadores', wrap(async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT
      count(*) FILTER (WHERE criada_em > now() - interval '24 hours')::int AS novas_24h,
      count(*) FILTER (WHERE id_status='em_analise')::int AS em_analise,
      count(*) FILTER (WHERE id_status NOT IN ('resolvida','improcedente') AND criada_em < now() - interval '5 days')::int AS atrasadas,
      round(avg(extract(epoch FROM (atualizada_em - criada_em))/3600) FILTER (WHERE id_status='resolvida')::numeric, 1)::float AS tempo_medio_horas
    FROM vw_reclamacao_atual`);
  res.json(rows[0]);
}));

app.get('/api/admin/reclamacoes/:protocolo/integridade', wrap(async (req, res) => {
  const rec = (await pool.query('SELECT id_reclamacao FROM reclamacao WHERE protocolo=$1', [req.params.protocolo])).rows[0];
  if (!rec) return res.status(404).json({ erro: 'Protocolo não encontrado' });
  res.json(await verificarCadeia(pool, rec.id_reclamacao));
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
});

if (process.argv[1]?.endsWith('server.js')) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`API ouvidoria em http://localhost:${port}`));
}
