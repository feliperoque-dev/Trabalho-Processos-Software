import { createHash } from 'node:crypto';

export const HASH_INICIAL = '0'.repeat(64);

export function calcularHash(e, hashAnterior) {
  const base = [
    hashAnterior, e.id_reclamacao, e.id_status, e.id_usuario,
    e.descricao_evento, e.resposta_cidadao ?? '', new Date(e.ocorrido_em).toISOString(),
  ].join('|');
  return createHash('sha256').update(base).digest('hex');
}

// Sempre INSERT: eventos nunca são alterados. Cada um encadeia o hash do anterior.
export async function registrarEvento(client, { id_reclamacao, id_status, id_usuario, descricao_evento, resposta_cidadao = null }) {
  const { rows: ult } = await client.query(
    'SELECT hash_evento FROM log_historico WHERE id_reclamacao=$1 ORDER BY id_evento DESC LIMIT 1',
    [id_reclamacao]
  );
  const hash_anterior = ult[0]?.hash_evento ?? HASH_INICIAL;
  const ocorrido_em = new Date();
  const ev = { id_reclamacao, id_status, id_usuario, descricao_evento, resposta_cidadao, ocorrido_em };
  const hash_evento = calcularHash(ev, hash_anterior);
  await client.query(
    `INSERT INTO log_historico (id_reclamacao,id_status,id_usuario,descricao_evento,resposta_cidadao,ocorrido_em,hash_anterior,hash_evento)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id_reclamacao, id_status, id_usuario, descricao_evento, resposta_cidadao, ocorrido_em, hash_anterior, hash_evento]
  );
}

export async function verificarCadeia(client, id_reclamacao) {
  const { rows } = await client.query(
    'SELECT * FROM log_historico WHERE id_reclamacao=$1 ORDER BY id_evento', [id_reclamacao]
  );
  let anterior = HASH_INICIAL;
  for (const ev of rows) {
    if (ev.hash_anterior !== anterior || calcularHash(ev, anterior) !== ev.hash_evento) {
      return { ok: false, primeiroEventoInvalido: ev.id_evento };
    }
    anterior = ev.hash_evento;
  }
  return { ok: true };
}
