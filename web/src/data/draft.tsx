import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CategoryId, ComplaintType, Frequency } from './mock';

// Rascunho da "Nova reclamação" compartilhado entre os 5 passos,
// para a tela de Revisão refletir o que foi escolhido. Sem persistência.
export type Draft = {
  type: ComplaintType;
  category: CategoryId;
  description: string;
  date: string;
  time: string;
  frequency: Frequency;
  contractor: string;
  anonymous: boolean;
  media: number;
  reference: string;
};

const initial: Draft = {
  type: 'obra',
  category: 'ruido',
  description: 'Obra vizinha usando britadeira às 22:30. Barulho intenso há mais de 3 dias seguidos.',
  date: '05/10/2026',
  time: '22:30',
  frequency: 'alguns_dias',
  contractor: '',
  anonymous: false,
  media: 3,
  reference: 'Em frente à padaria, tapume azul',
};

type Ctx = { draft: Draft; update: (patch: Partial<Draft>) => void };

const DraftContext = createContext<Ctx | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(initial);
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  return <DraftContext.Provider value={{ draft, update }}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft fora do DraftProvider');
  return ctx;
}
