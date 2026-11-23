// Protocolo no formato AAAA-NNNN, gerado no servidor a partir de uma sequence.
export async function gerarProtocolo(client) {
  const { rows } = await client.query(
    `SELECT to_char(now(),'YYYY') || '-' || lpad(nextval('protocolo_seq')::text, 4, '0') AS p`
  );
  return rows[0].p;
}
