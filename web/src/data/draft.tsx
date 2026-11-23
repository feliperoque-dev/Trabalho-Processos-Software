import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CategoryId, ComplaintType, Frequency } from './mock';

// Rascunho da "Nova reclamação" compartilhado entre os 5 passos.
export type Draft = {
  type: ComplaintType;
  category: CategoryId;
  description: string;
  date: string; // yyyy-mm-dd
  time: string; // hh:mm
  frequency: Frequency;
  contractor: string;
  anonymous: boolean;
  media: { tipo: 'foto' | 'video'; uri: string }[];
  address: string;
  reference: string;
  latitude: number | null;
  longitude: number | null;
};

export const initial: Draft = {
  type: 'obra',
  category: 'ruido',
  description: '',
  date: '',
  time: '',
  frequency: 'primeira',
  contractor: '',
  anonymous: false,
  media: [],
  address: '',
  reference: '',
  latitude: null,
  longitude: null,
};

type Ctx = { draft: Draft; update: (patch: Partial<Draft>) => void; reset: () => void };

const DraftContext = createContext<Ctx | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(initial);
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const reset = () => setDraft(initial);
  return <DraftContext.Provider value={{ draft, update, reset }}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft fora do DraftProvider');
  return ctx;
}
