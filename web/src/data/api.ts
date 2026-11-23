import type { Complaint, ComplaintType, CategoryId, Frequency, Priority, Status, TimelineStep } from './mock';
import { getSessao, type Sessao } from './session';

export type Erro = { campo: string; mensagem: string };
export class ApiError extends Error {
  constructor(public status: number, public erros: Erro[] = [], message = 'Erro na requisição') {
    super(message);
  }
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json' },
  });
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, corpo.erros ?? [], corpo.erro ?? 'Erro na requisição');
  return corpo as T;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

type Linha = {
  protocolo: string; tipo: ComplaintType; id_categoria: CategoryId; categoria_nome: string; descricao: string;
  endereco: string; prioridade: Priority; criada_em: string; id_status: Status;
  timeline?: { descricao_evento: string; resposta_cidadao: string | null; ocorrido_em: string; autor: string }[];
};

function mapear(l: Linha): Complaint {
  const ev = l.timeline ?? [];
  const final = l.id_status === 'resolvida' || l.id_status === 'improcedente';
  const timeline: TimelineStep[] = ev.map((e, i) => ({
    label: e.descricao_evento,
    at: fmt(e.ocorrido_em),
    by: i > 0 ? e.autor : undefined,
    state: i === ev.length - 1 && !final ? 'current' : 'done',
  }));
  const resp = [...ev].reverse().find((e) => e.resposta_cidadao)?.resposta_cidadao ?? undefined;
  return {
    id: l.protocolo, protocol: `#${l.protocolo}`, type: l.tipo, category: l.id_categoria, title: l.categoria_nome,
    description: l.descricao, place: l.endereco, date: fmt(l.criada_em), status: l.id_status,
    priority: l.prioridade, timeline, cityResponse: resp,
  };
}

export const entrar = (nome: string, email: string) =>
  req<Sessao>('/api/usuarios', { method: 'POST', body: JSON.stringify({ nome, email }) });

export type NovaReclamacao = {
  categoria: CategoryId; tipo: ComplaintType; descricao: string; endereco: string; ocorrido_em?: string | null;
  frequencia: Frequency; anonima: boolean; construtora?: string; referencia?: string;
  latitude?: number | null; longitude?: number | null; midias: { tipo: 'foto' | 'video'; uri: string }[];
};
export const criarReclamacao = (d: NovaReclamacao) =>
  req<{ protocolo: string; id: number }>('/api/reclamacoes', {
    method: 'POST', body: JSON.stringify({ ...d, id_usuario: getSessao()?.id }),
  });

export const minhasReclamacoes = async () =>
  (await req<Linha[]>(`/api/reclamacoes?usuario=${getSessao()?.id ?? 0}`)).map(mapear);

export const buscarReclamacao = async (protocolo: string) =>
  mapear(await req<Linha>(`/api/reclamacoes/${encodeURIComponent(protocolo)}`));

export const filaAdmin = async (status?: string, q?: string) => {
  const p = new URLSearchParams();
  if (status && status !== 'todas') p.set('status', status);
  if (q) p.set('q', q);
  return (await req<Linha[]>(`/api/admin/reclamacoes?${p}`)).map(mapear);
};

export const alterarStatus = (protocolo: string, status: Status, resposta: string, id_atendente: number) =>
  req(`/api/admin/reclamacoes/${protocolo}`, { method: 'PATCH', body: JSON.stringify({ status, resposta, id_atendente }) });

export type Indicadores = { novas_24h: number; em_analise: number; atrasadas: number; tempo_medio_horas: number | null };
export const indicadores = () => req<Indicadores>('/api/admin/indicadores');

export const verificarIntegridade = (protocolo: string) =>
  req<{ ok: boolean; primeiroEventoInvalido?: number }>(`/api/admin/reclamacoes/${protocolo}/integridade`);

/** Atendente do seed (sem login: o painel é aberto, limitação declarada). */
export const ATENDENTE_ID = 1;
