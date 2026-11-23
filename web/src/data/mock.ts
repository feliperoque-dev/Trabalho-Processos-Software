import type { IconName } from '../components/Icon';

// Modelo de dados sugerido no DESIGN_HANDOFF.md (simplificado para o protótipo).
export type Status = 'pendente' | 'em_analise' | 'em_andamento' | 'resolvida' | 'improcedente';
export type ComplaintType = 'obra' | 'vizinhanca';
export type CategoryId = 'ruido' | 'poeira' | 'entulho' | 'vibracao' | 'risco' | 'caminhoes' | 'calcada' | 'outros';
export type Frequency = 'primeira' | 'alguns_dias' | 'todo_dia';
export type Priority = 'Alta' | 'Média' | 'Baixa';

export type TimelineStep = { label: string; at: string; by?: string; state: 'done' | 'current' | 'todo' };

export type Complaint = {
  id: string;
  protocol: string;
  type: ComplaintType;
  category: CategoryId;
  title: string;
  description: string;
  place: string;
  date: string;
  status: Status;
  priority: Priority;
  timeline: TimelineStep[];
  cityResponse?: string;
};

export const statusLabel: Record<Status, string> = {
  pendente: 'Pendente',
  em_analise: 'Em análise',
  em_andamento: 'Em andamento',
  resolvida: 'Resolvida',
  improcedente: 'Improcedente',
};

export const typeLabel: Record<ComplaintType, string> = { obra: 'Obra', vizinhanca: 'Vizinhança' };

export const frequencyLabel: Record<Frequency, string> = {
  primeira: 'Primeira vez',
  alguns_dias: 'Alguns dias',
  todo_dia: 'Todo dia',
};

export const categories: { id: CategoryId; label: string; hint: string; icon: IconName }[] = [
  { id: 'ruido', label: 'Ruído fora do horário', hint: 'Máquinas antes das 7h ou após 22h', icon: 'ruido' },
  { id: 'poeira', label: 'Poeira e sujeira', hint: 'Sem tela de proteção ou umidificação', icon: 'poeira' },
  { id: 'entulho', label: 'Entulho na via', hint: 'Caçamba irregular ou material na rua', icon: 'entulho' },
  { id: 'vibracao', label: 'Vibração e rachaduras', hint: 'Danos em imóveis vizinhos', icon: 'vibracao' },
  { id: 'risco', label: 'Risco estrutural', hint: 'Muro, andaime ou tapume instável', icon: 'risco' },
  { id: 'caminhoes', label: 'Caminhões e máquinas', hint: 'Bloqueio de garagem ou rua', icon: 'caminhoes' },
  { id: 'calcada', label: 'Calçada obstruída', hint: 'Pedestres forçados a ir pela rua', icon: 'calcada' },
  { id: 'outros', label: 'Outros', hint: 'Descreva no próximo passo', icon: 'outros' },
];

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

export const user = {
  name: 'Mariana Souza',
  firstName: 'Mariana',
  initials: 'MS',
  email: 'mariana.souza@email.com',
  cpf: '***.456.789-**',
};

function timelineFor(status: Status, createdAt: string): TimelineStep[] {
  const registered: TimelineStep = { label: 'Reclamação registrada', at: createdAt, state: 'done' };
  switch (status) {
    case 'pendente':
      return [
        registered,
        { label: 'Triagem', at: 'Em até 2 dias úteis', state: 'current' },
        { label: 'Vistoria', at: 'Aguardando triagem', state: 'todo' },
        { label: 'Resolução', at: 'Aguardando vistoria', state: 'todo' },
      ];
    case 'em_analise':
      return [
        registered,
        { label: 'Em análise pela fiscalização', at: 'Triagem em andamento', by: 'Secretaria de Obras', state: 'current' },
        { label: 'Vistoria', at: 'Aguardando triagem', state: 'todo' },
        { label: 'Resolução', at: 'Aguardando vistoria', state: 'todo' },
      ];
    case 'em_andamento':
      return [
        registered,
        { label: 'Triagem concluída', at: 'Hoje, 13:05', by: 'Secretaria de Obras', state: 'done' },
        { label: 'Vistoria agendada', at: 'Previsão: 08/10, manhã', state: 'current' },
        { label: 'Resolução', at: 'Aguardando vistoria', state: 'todo' },
      ];
    default:
      return [
        registered,
        { label: 'Triagem concluída', at: 'Em 1 dia útil', by: 'Secretaria de Obras', state: 'done' },
        { label: 'Vistoria realizada', at: 'Construtora notificada', state: 'done' },
        { label: 'Resolvida', at: 'Problema corrigido', state: 'done' },
      ];
  }
}

const base: Omit<Complaint, 'timeline'>[] = [
  {
    id: '2026-0852', protocol: '#2026-0852', type: 'obra', category: 'ruido', priority: 'Média',
    title: 'Ruído fora do horário', place: 'Rua das Flores, 123', date: 'Hoje, 22:41', status: 'em_analise',
    description: 'Obra vizinha usando britadeira às 22:30. Barulho intenso há mais de 3 dias seguidos.',
  },
  {
    id: '2026-0851', protocol: '#2026-0851', type: 'obra', category: 'risco', priority: 'Alta',
    title: 'Risco estrutural em tapume', place: 'Av. Central, 1020', date: 'Hoje, 18:02', status: 'pendente',
    description: 'Tapume inclinado sobre a calçada após a chuva. Pedestres passando ao lado.',
  },
  {
    id: '2026-0847', protocol: '#2026-0847', type: 'obra', category: 'caminhoes', priority: 'Média',
    title: 'Caminhão bloqueando garagem', place: 'Av. Central, 480', date: 'Hoje, 10:30', status: 'em_andamento',
    description: 'Caminhões da obra estacionam em frente à minha garagem todas as manhãs, das 7h às 9h.',
    cityResponse: 'A construtora foi notificada e um fiscal fará vistoria no local. Você será avisada sobre o resultado.',
  },
  {
    id: '2026-0839', protocol: '#2026-0839', type: 'vizinhanca', category: 'entulho', priority: 'Baixa',
    title: 'Entulho na via', place: 'Rua do Sol, 210', date: 'Ontem, 08:12', status: 'em_analise',
    description: 'Caçamba sem sinalização ocupando faixa de rolamento.',
  },
  {
    id: '2026-0831', protocol: '#2026-0831', type: 'obra', category: 'poeira', priority: 'Média',
    title: 'Poeira excessiva de demolição', place: 'Rua do Sol, 77', date: 'Ontem, 16:15', status: 'resolvida',
    description: 'Demolição sem umidificação. Construtora instalou tela e aspersores após notificação.',
    cityResponse: 'Vistoria confirmou a irregularidade. A construtora instalou tela de proteção e aspersores.',
  },
  {
    id: '2026-0812', protocol: '#2026-0812', type: 'obra', category: 'vibracao', priority: 'Alta',
    title: 'Risco estrutural em muro', place: 'Rua das Flores, 140', date: '24 set, 09:00', status: 'pendente',
    description: 'Fissuras novas na parede lateral após início da fundação vizinha.',
  },
  {
    id: '2026-0790', protocol: '#2026-0790', type: 'vizinhanca', category: 'calcada', priority: 'Baixa',
    title: 'Entulho na calçada', place: 'Tv. das Palmeiras, 12', date: '18 set, 14:20', status: 'resolvida',
    description: 'Sacos de entulho deixados na calçada, obrigando pedestres a andar pela rua.',
    cityResponse: 'Material recolhido pela construtora após notificação.',
  },
];

export const complaints: Complaint[] = base.map((c) => ({ ...c, timeline: timelineFor(c.status, c.date) }));

/** Reclamações da cidadã logada (o painel admin vê todas). */
export const myComplaints = complaints.filter((c) => c.id !== '2026-0851' && c.id !== '2026-0839');

export const findComplaint = (id?: string) => complaints.find((c) => c.id === id) ?? complaints[2];
