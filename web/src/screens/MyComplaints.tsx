import { useState } from 'react';
import { BottomTabBar, Chip, ComplaintCard, Screen, SearchField } from '../components/ui';
import type { Complaint } from '../data/mock';
import { minhasReclamacoes } from '../data/api';
import { useAsync } from '../data/useAsync';

const filters = [
  { id: 'todas', label: 'Todas', match: () => true },
  { id: 'abertas', label: 'Abertas', match: (c: Complaint) => c.status !== 'resolvida' },
  { id: 'analise', label: 'Em análise', match: (c: Complaint) => c.status === 'em_analise' },
  { id: 'resolvidas', label: 'Resolvidas', match: (c: Complaint) => c.status === 'resolvida' },
];

export default function MyComplaints() {
  const [filter, setFilter] = useState('todas');
  const [query, setQuery] = useState('');
  const { data, loading, erro } = useAsync(minhasReclamacoes, []);
  const myComplaints = data ?? [];

  const q = query.trim().toLowerCase();
  const active = filters.find((f) => f.id === filter)!;
  const items = myComplaints.filter(
    (c) => active.match(c) && (!q || c.protocol.includes(q) || c.title.toLowerCase().includes(q)),
  );

  return (
    <Screen>
      <header className="page-header">
        <h1 className="h2-xl">Minhas reclamações</h1>
        <SearchField placeholder="Buscar por protocolo ou assunto" value={query} onChange={setQuery} />
        <div className="chips">
          {filters.map((f) => (
            <Chip key={f.id} size="sm" selected={f.id === filter} onClick={() => setFilter(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </header>
      <div className="screen-body pad-20 gap-10" style={{ paddingTop: 16, paddingBottom: 16 }}>
        {items.map((c) => (
          <ComplaintCard key={c.id} complaint={c} variant="full" />
        ))}
        {loading && <div className="empty">Carregando…</div>}
        {erro && <div className="empty">Não foi possível carregar. Confira se a API está no ar.</div>}
        {!loading && !erro && items.length === 0 && <div className="empty">Nenhuma reclamação encontrada.</div>}
      </div>
      <BottomTabBar />
    </Screen>
  );
}
