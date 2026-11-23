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
