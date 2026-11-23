// Sessão simples: sem autenticação real. Só identifica o morador (id, nome, e-mail).
export type Sessao = { id: number; nome: string; email: string };

const KEY = 'ouvidoria.sessao';

export function getSessao(): Sessao | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null');
  } catch {
    return null;
  }
}
export function setSessao(s: Sessao | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* sem storage: segue sem sessão */
  }
}
export const primeiroNome = (s: Sessao | null) => s?.nome.split(' ')[0] ?? 'visitante';
export const iniciais = (s: Sessao | null) =>
  (s?.nome ?? '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
