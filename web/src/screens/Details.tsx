import { useParams } from 'react-router-dom';
import { Button, Footer, Screen, StatusBadge, TopBar, notify } from '../components/ui';
import { Icon } from '../components/Icon';
import { categoryById, findComplaint, typeLabel } from '../data/mock';

export default function Details() {
  const { id } = useParams();
  const c = findComplaint(id);

  return (
    <Screen>
      <TopBar
        tone="bar"
        title={`Protocolo ${c.protocol}`}
        back="/complaints"
        action={
          <button type="button" className="icon-btn" aria-label="Compartilhar" onClick={() => notify('Compartilhar: próxima etapa.')}>
            <Icon name="share" />
          </button>
        }
      />
      <div className="screen-body pad-20 gap-12" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <section className="card card-lg stack-10">
          <div className="row-between">
            <span className="caption-strong">
              {typeLabel[c.type]} · {categoryById(c.category).label}
            </span>
            <StatusBadge status={c.status} />
          </div>
          <div className="h3">{c.title}</div>
          <div className="body-14">{c.description}</div>
          <div className="row gap-8">
            <div className="thumb thumb-56 thumb-dark" />
            <div className="thumb thumb-56 thumb-mid" />
            <div className="details-place">
              <span className="strong">{c.place}</span>
              <span>Enviada {c.date.toLowerCase()}</span>
            </div>
          </div>
        </section>

        <section className="card card-lg">
          <div className="h4" style={{ marginBottom: 14 }}>Andamento</div>
          <ol className="timeline">
            {c.timeline.map((s) => (
              <li key={s.label} className={s.state}>
                <div className="timeline-rail">
                  <div className="timeline-dot">{s.state === 'done' && <Icon name="check" size={12} stroke={3.4} />}</div>
                  <div className="timeline-line" />
                </div>
                <div className="timeline-content">
                  <div className="timeline-label">{s.label}</div>
                  <div className="timeline-at">
                    {s.at}
                    {s.by && ` · ${s.by}`}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {c.cityResponse && (
          <section className="city-response">
            <div className="city-response-title">
              <Icon name="chat" size={16} />
              Resposta da prefeitura
            </div>
            <div className="text-13 lh">{c.cityResponse}</div>
          </section>
        )}
      </div>
      <Footer row>
        <Button variant="outline" className="grow btn-52" onClick={() => notify('Adicionar informações: próxima etapa.')}>
          Adicionar info
        </Button>
        <Button className="grow btn-52" onClick={() => notify('Chat com o fiscal: próxima etapa.')}>
          Falar com fiscal
        </Button>
      </Footer>
    </Screen>
  );
}
