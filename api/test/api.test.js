// Testes de integração T01–T03 (Issue #11). Exigem API em :3001 e banco no ar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/db.js';

const BASE = process.env.API_URL || 'http://localhost:3001';
const MORADOR = 2;      // seed: Maria Moradora
const ATENDENTE = 1;    // seed: Atendente Ouvidoria

const post = (url, body, method = 'POST') =>
  fetch(BASE + url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const valida = (extra = {}) => ({
  id_usuario: MORADOR, categoria: 'ruido', tipo: 'obra',
  descricao: 'Britadeira ligada desde as 22h30', endereco: 'Rua das Flores, 123', ...extra,
});
const contar = async () => {
  const q = async (t) => (await pool.query(`SELECT count(*)::int n FROM ${t}`)).rows[0].n;
  return { reclamacao: await q('reclamacao'), midia: await q('midia'), log_historico: await q('log_historico') };
};

test('T01 — dois registros válidos geram protocolos distintos AAAA-NNNN', async () => {
  const r1 = await post('/api/reclamacoes', valida());
  const r2 = await post('/api/reclamacoes', valida());
  assert.equal(r1.status, 201);
  assert.equal(r2.status, 201);
  const [a, b] = [await r1.json(), await r2.json()];
  console.log('T01 protocolos:', a.protocolo, b.protocolo);
  assert.match(a.protocolo, /^\d{4}-\d{4}$/);
  assert.notEqual(a.protocolo, b.protocolo);
  for (const p of [a.protocolo, b.protocolo]) {
    const d = await (await fetch(`${BASE}/api/reclamacoes/${p}`)).json();
    assert.equal(d.timeline.length, 1);
    assert.equal(d.timeline[0].id_status, 'pendente');
  }
});

test('T02 — entrada inválida retorna 400 e não grava nada', async () => {
  const antes = await contar();
  const r1 = await post('/api/reclamacoes', valida({ categoria: 'inexistente' }));
  const r2 = await post('/api/reclamacoes', valida({ descricao: '' }));
  assert.equal(r1.status, 400);
  assert.equal(r2.status, 400);
  assert.ok((await r1.json()).erros.some((e) => e.campo === 'categoria'));
  assert.ok((await r2.json()).erros.some((e) => e.campo === 'descricao'));
  const depois = await contar();
  console.log('T02 antes:', JSON.stringify(antes), 'depois:', JSON.stringify(depois));
  assert.deepEqual(depois, antes);
});

test('T03 — cadeia de hash detecta alteração direta no banco', async () => {
  const { protocolo, id } = await (await post('/api/reclamacoes', valida())).json();
  for (const status of ['em_analise', 'resolvida']) {
    const r = await post(`/api/admin/reclamacoes/${protocolo}`, { status, resposta: 'ok', id_atendente: ATENDENTE }, 'PATCH');
    assert.equal(r.status, 200);
  }
  const url = `${BASE}/api/admin/reclamacoes/${protocolo}/integridade`;
  const v1 = await (await fetch(url)).json();
  assert.equal(v1.ok, true);

  const { rows } = await pool.query('SELECT id_evento FROM log_historico WHERE id_reclamacao=$1 ORDER BY id_evento OFFSET 1 LIMIT 1', [id]);
  await pool.query("UPDATE log_historico SET descricao_evento='ADULTERADO' WHERE id_evento=$1", [rows[0].id_evento]);
  const v2 = await (await fetch(url)).json();
  console.log('T03 antes:', JSON.stringify(v1), 'depois:', JSON.stringify(v2), 'evento alterado:', rows[0].id_evento);
  assert.equal(v2.ok, false);
  assert.equal(v2.primeiroEventoInvalido, rows[0].id_evento);
});

test.after(() => pool.end());
