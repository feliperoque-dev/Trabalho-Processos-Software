const FREQ = ['primeira', 'alguns_dias', 'todo_dia'];
const TIPOS = ['obra', 'vizinhanca'];

export async function validarEntrada(client, d) {
  const erros = [];
  const add = (campo, mensagem) => erros.push({ campo, mensagem });

  const u = Number.isInteger(d.id_usuario)
    ? (await client.query('SELECT 1 FROM usuario WHERE id_usuario=$1', [d.id_usuario])).rowCount : 0;
  if (!u) add('id_usuario', 'Usuário inexistente');

  const c = typeof d.categoria === 'string'
    ? (await client.query('SELECT 1 FROM categoria WHERE id_categoria=$1 AND ativa', [d.categoria])).rowCount : 0;
  if (!c) add('categoria', 'Categoria inexistente ou inativa');

  if (!TIPOS.includes(d.tipo)) add('tipo', 'Tipo deve ser obra ou vizinhanca');
  const desc = typeof d.descricao === 'string' ? d.descricao.trim() : '';
  if (desc.length < 10 || desc.length > 500) add('descricao', 'Descrição deve ter entre 10 e 500 caracteres');
  if (typeof d.endereco !== 'string' || !d.endereco.trim()) add('endereco', 'Endereço é obrigatório');
  if (d.frequencia !== undefined && !FREQ.includes(d.frequencia)) add('frequencia', 'Frequência inválida');
  if (d.midias !== undefined) {
    if (!Array.isArray(d.midias) || d.midias.length > 5) add('midias', 'No máximo 5 mídias');
    else if (d.midias.some((m) => !['foto', 'video'].includes(m?.tipo) || !m?.uri)) add('midias', 'Mídia inválida (tipo foto/video e nome)');
  }
  return erros;
}
