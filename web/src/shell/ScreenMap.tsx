import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { groups, screenById, screens, type ScreenInfo } from '../data/screens';
import { TopNav } from './PhoneLayout';

/** Miniatura ao vivo: a própria tela renderizada num iframe reduzido. */
function Thumb({ screen }: { screen: ScreenInfo }) {
  const isAdmin = screen.group === 'admin';
  const src = `${window.location.pathname}#${screen.path}`;
  return (
    <div className={`thumb-frame ${isAdmin ? 'thumb-frame-wide' : ''}`}>
      <iframe src={src} title={`Prévia: ${screen.title}`} loading="lazy" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}

function ScreenCard({ screen }: { screen: ScreenInfo }) {
  return (
    <div className={`map-card ${screen.group === 'admin' ? 'map-card-wide' : ''}`}>
      <Link to={screen.path} className="map-card-link" aria-label={`Abrir tela ${screen.num}: ${screen.title}`}>
        <Thumb screen={screen} />
      </Link>
      <div className="map-card-info">
        <div className="map-card-head">
          <span className="proto-num">{screen.num}</span>
          <Link to={screen.path} className="map-card-title">{screen.title}</Link>
        </div>
        {screen.note && <div className="map-card-note">{screen.note}</div>}
        <code className="map-card-route">{screen.path.replace('2026-0847', ':id')}</code>
        {screen.leadsTo.length > 0 && (
          <div className="map-card-leads">
            <Icon name="arrowRight" size={12} />
            {screen.leadsTo.map((id) => {
              const t = screenById(id);
              return (
                <Link key={id} to={t.path} title={t.title}>
                  {t.num}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScreenMap() {
  return (
    <div className="map-page">
      <TopNav />
      <div className="map-content">
        <section className="map-intro">
          <h1>Mapa de telas</h1>
          <p>
            As 16 telas do design, implementadas e navegáveis. Clique numa miniatura para abrir o protótipo naquela tela; os números em
            <span className="inline-arrow"><Icon name="arrowRight" size={12} /></span>
            indicam para quais telas cada uma leva.
          </p>
          <div className="map-legend">
            <span><strong>{screens.length - 1}</strong> telas do app do cidadão</span>
            <span><strong>1</strong> painel web da prefeitura</span>
            <span>Dados fictícios · sem backend · sem validações</span>
          </div>
        </section>

        {groups.map((g) => {
          const items = screens.filter((s) => s.group === g.id);
          const linear = g.id === 'nova';
          return (
            <section key={g.id} className="map-group">
              <div className="map-group-head">
                <h2>{g.title}</h2>
                <p>{g.description}</p>
              </div>
              <div className={`map-grid ${linear ? 'map-grid-flow' : ''}`}>
                {items.map((s, i) => (
                  <Fragment key={s.id}>
                    {linear && i > 0 && (
                      <div className="map-flow-arrow" aria-hidden="true">
                        <Icon name="arrowRight" size={20} />
                      </div>
                    )}
                    <ScreenCard screen={s} />
                  </Fragment>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
