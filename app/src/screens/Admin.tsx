import { useState } from 'react';
import { Chip, SearchField, StatusBadge, notify } from '../components/ui';
import { Icon, type IconName } from '../components/Icon';
import type { Status } from '../data/mock';
import { ATENDENTE_ID, alterarStatus, filaAdmin, indicadores, verificarIntegridade } from '../data/api';
import { useAsync } from '../data/useAsync';

const menu: { label: string; icon: IconName }[] = [
  { label: 'Reclamações', icon: 'clipboard' },
  { label: 'Mapa de ocorrências', icon: 'pin' },
  { label: 'Obras e alvarás', icon: 'site' },
  { label: 'Relatórios', icon: 'chart' },
  { label: 'Equipe de fiscais', icon: 'team' },
  { label: 'Configurações', icon: 'gear' },
];

const filters: { id: 'todas' | Status; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendente', label: 'Pendentes' },
  { id: 'em_analise', label: 'Em análise' },
  { id: 'em_andamento', label: 'Em andamento' },
  { id: 'resolvida', label: 'Resolvidas' },
];

export default function Admin() {
  const [filter, setFilter] = useState<'todas' | Status>('todas');
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [versao, setVersao] = useState(0); // incrementa para recarregar após salvar
  const [novoStatus, setNovoStatus] = useState<Status | null>(null);
  const [resposta, setResposta] = useState('');
  const [salvando, setSalvando] = useState(false);

  const { data: fila, erro, loading } = useAsync(() => filaAdmin(filter, query.trim()), [filter, query, versao]);
  const { data: ind } = useAsync(indicadores, [versao]);
  const rows = fila ?? [];
  const sel = rows.find((c) => c.id === selectedId) ?? rows[0];

  const kpis = [
    { label: 'Novas (24h)', value: ind ? String(ind.novas_24h) : '—' },
    { label: 'Em análise', value: ind ? String(ind.em_analise) : '—' },
    { label: 'Atrasadas (> 5 dias)', value: ind ? String(ind.atrasadas) : '—', danger: true },
    { label: 'Tempo médio até resolver', value: ind?.tempo_medio_horas != null ? `${ind.tempo_medio_horas} h` : '—' },
  ];

  const selecionar = (id: string) => {
    const c = rows.find((r) => r.id === id);
    setSelectedId(id);
    if (c) setNovoStatus(null);
    setResposta('');
  };

  const salvar = async () => {
    if (!sel) return;
    setSalvando(true);
    try {
      await alterarStatus(sel.id, novoStatus ?? sel.status, resposta, ATENDENTE_ID);
      notify('Status atualizado e registrado no histórico.');
      setResposta('');
      setVersao((v) => v + 1);
    } catch {
      notify('Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  };

  const integridade = async () => {
    if (!sel) return;
    try {
      const r = await verificarIntegridade(sel.id);
      notify(r.ok ? 'Histórico íntegro: cadeia de hash válida.' : `Histórico ADULTERADO (evento ${r.primeiroEventoInvalido}).`);
    } catch {
      notify('Não foi possível verificar.');
    }
  };

  return (
    <div className="admin">
      <aside className="admin-aside">
        <div className="admin-brand">
          <div className="admin-logo">
            <Icon name="crane" size={22} stroke={1.8} />
          </div>
          <div>
            <div className="text-16 strong-800">Ouvidoria</div>
            <div className="text-12 op-80">Painel da prefeitura</div>
          </div>
        </div>
        <nav aria-label="Menu do painel" className="admin-nav">
          {menu.map((m, i) => (
            <button
              key={m.label}
              type="button"
              aria-current={i === 0 ? 'page' : undefined}
              className={i === 0 ? 'active' : ''}
              onClick={() => i !== 0 && notify(`${m.label}: próxima etapa.`)}
            >
              <Icon name={m.icon} size={18} />
              {m.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-head">
          <div className="grow" style={{ flexBasis: 260 }}>
            <h1 className="h1 h1-lg">Reclamações</h1>
            <div className="muted text-14" style={{ marginTop: 2 }}>Secretaria de Obras · dados em tempo real</div>
          </div>
          <SearchField className="admin-search" placeholder="Protocolo, endereço ou construtora" value={query} onChange={setQuery} />
          <button type="button" className="btn btn-primary btn-44" onClick={() => notify('Exportar relatório: próxima etapa.')}>
            <Icon name="download" size={18} />
            Exportar
          </button>
        </div>

        <div className="admin-kpis">
          {kpis.map((k) => (
            <div key={k.label} className="card kpi">
              <div className="kpi-label">{k.label}</div>
              <div className={`kpi-value ${k.danger ? 'danger' : ''}`}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="admin-panels">
          <section className="card card-lg admin-queue">
            <div className="chips wrap align-center">
              <h2 className="h4-17" style={{ marginRight: 12 }}>Fila de atendimento</h2>
              {filters.map((f) => (
                <Chip key={f.id} size="sm" selected={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </Chip>
              ))}
            </div>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Protocolo</th>
                    <th>Assunto</th>
                    <th>Endereço</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className={r.id === sel?.id ? 'selected' : ''} onClick={() => selecionar(r.id)}>
                      <td>
                        <button type="button" className="table-link" onClick={() => selecionar(r.id)}>
                          {r.protocol}
                        </button>
                      </td>
                      <td>{r.title}</td>
                      <td className="muted">{r.place}</td>
                      <td>
                        <span className={`prio prio-${r.priority === 'Média' ? 'media' : r.priority.toLowerCase()}`}>{r.priority}</span>
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty">{loading ? 'Carregando…' : erro ? 'Falha ao carregar (API no ar?).' : 'Nenhuma reclamação encontrada.'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {sel && (
          <section className="card card-lg admin-detail" key={sel.id}>
            <div className="row-between">
              <span className="caption-strong text-13">{sel.protocol}</span>
              <StatusBadge status={sel.status} />
            </div>
            <h2 className="h3">{sel.title}</h2>
            <div className="muted text-13">
              {sel.place} · {sel.date}
            </div>
            <div className="body-14">{sel.description}</div>
            <div className="field field-sm">
              <label htmlFor="ad-status">Alterar status</label>
              <select id="ad-status" className="select" value={novoStatus ?? sel.status} onChange={(e) => setNovoStatus(e.target.value as Status)}>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em análise</option>
                <option value="em_andamento">Em andamento</option>
                <option value="resolvida">Resolvida</option>
                <option value="improcedente">Improcedente</option>
              </select>
            </div>
            <div className="field field-sm">
              <label htmlFor="ad-fiscal">Fiscal responsável</label>
              <select id="ad-fiscal" className="select">
                <option>Carlos Lima</option>
                <option>Ana Ribeiro</option>
                <option>João Pereira</option>
              </select>
            </div>
            <div className="field field-sm">
              <label htmlFor="ad-resp">Resposta ao cidadão</label>
              <textarea id="ad-resp" rows={3} className="input textarea textarea-admin" placeholder="Esta mensagem aparece na tela Detalhes do app" value={resposta} onChange={(e) => setResposta(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary btn-46" disabled={salvando} onClick={salvar}>
              Salvar e notificar
            </button>
            <button type="button" className="btn btn-outline btn-46" onClick={integridade}>
              Verificar integridade
            </button>
          </section>
          )}
        </div>
      </main>
    </div>
  );
}
