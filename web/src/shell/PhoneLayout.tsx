import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toast } from '../components/ui';
import { Icon } from '../components/Icon';
import { groups, screenById, screens, type ScreenInfo } from '../data/screens';

export function currentScreen(pathname: string): ScreenInfo | undefined {
  const exact = screens.find((s) => s.path === pathname);
  if (exact) return exact;
  if (pathname.startsWith('/complaint/')) return screenById('details');
  return undefined;
}

function StatusBar({ light }: { light: boolean }) {
  return (
    <div className={`statusbar ${light ? 'light' : ''}`} aria-hidden="true">
      <span>9:41</span>
      <span className="statusbar-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 4a9.5 9.5 0 0 1 13 0M3.3 6.4a6 6 0 0 1 8.4 0M5.6 8.7a2.6 2.6 0 0 1 3.8 0" /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.5" /><rect x="2" y="2" width="16" height="8" rx="1.6" fill="currentColor" /><path d="M23 4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" /></svg>
      </span>
    </div>
  );
}

const PHONE_HEIGHT = 868; // 844 de tela + moldura
const CHROME_HEIGHT = 112; // barra superior + respiros

/** Reduz o celular para caber na altura da janela (projetor, notebook). */
function useFitScale(enabled: boolean) {
  const compute = () => Math.min(1, Math.max(0.6, (window.innerHeight - CHROME_HEIGHT) / PHONE_HEIGHT));
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    if (!enabled) return;
    const onResize = () => setScale(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [enabled]);
  return enabled && window.innerWidth > 520 ? scale : 1;
}

/** Moldura de celular 390x844. `bare` = sem bordas (usado nas miniaturas). */
export function PhoneFrame({ bare = false }: { bare?: boolean }) {
  const { pathname } = useLocation();
  const scale = useFitScale(!bare);
  return (
    <div className={bare ? 'phone phone-bare' : 'phone'} style={scale < 1 ? { zoom: scale } : undefined}>
      <div className="phone-screen">
        <StatusBar light={pathname === '/welcome'} />
        <Outlet />
        <Toast />
      </div>
    </div>
  );
}

export function TopNav() {
  const { pathname } = useLocation();
  const section = pathname === '/' ? 'map' : pathname === '/admin' ? 'admin' : 'app';
  return (
    <header className="topnav">
      <Link to="/" className="topnav-brand">
        <span className="topnav-logo">
          <Icon name="crane" size={18} stroke={1.8} />
        </span>
        <span>
          Ouvidoria de Obras &amp; Vizinhança
          <small>Protótipo navegável · Processos de Software</small>
        </span>
      </Link>
      <nav className="topnav-links">
        <Link to="/" className={section === 'map' ? 'active' : ''}>
          <Icon name="map" size={16} />
          Mapa de telas
        </Link>
        <Link to="/welcome" className={section === 'app' ? 'active' : ''}>
          <Icon name="phone" size={16} />
          App do cidadão
        </Link>
        <Link to="/admin" className={section === 'admin' ? 'active' : ''}>
          <Icon name="monitor" size={16} />
          Painel da prefeitura
        </Link>
      </nav>
    </header>
  );
}

export default function PhoneLayout() {
  const { pathname } = useLocation();
  const current = currentScreen(pathname);

  return (
    <div className="proto">
      <TopNav />
      <div className="proto-body">
        <aside className="proto-sidebar" aria-label="Telas do app">
          {groups
            .filter((g) => g.id !== 'admin')
            .map((g) => (
              <div key={g.id} className="proto-group">
                <div className="proto-group-title">{g.title}</div>
                {screens
                  .filter((s) => s.group === g.id)
                  .map((s) => (
                    <Link key={s.id} to={s.path} className={`proto-link ${current?.id === s.id ? 'active' : ''}`}>
                      <span className="proto-num">{s.num}</span>
                      {s.title}
                    </Link>
                  ))}
              </div>
            ))}
        </aside>

        <main className="proto-stage">
          <PhoneFrame />
        </main>

        <aside className="proto-info" aria-label="Sobre esta tela">
          {current && (
            <>
              <div className="proto-info-num">Tela {current.num}</div>
              <h2 className="proto-info-title">{current.title}</h2>
              {current.note && <div className="proto-info-note">{current.note}</div>}
              <dl className="proto-info-dl">
                <dt>Rota</dt>
                <dd><code>{current.path.replace('2026-0847', ':id')}</code></dd>
                <dt>Arquivo de design</dt>
                <dd><code>{current.file}</code></dd>
              </dl>
              {current.leadsTo.length > 0 && (
                <>
                  <div className="proto-info-label">Leva para</div>
                  <div className="proto-info-links">
                    {current.leadsTo.map((id) => {
                      const t = screenById(id);
                      return (
                        <Link key={id} to={t.path}>
                          <span className="proto-num">{t.num}</span>
                          {t.title}
                          <Icon name="arrowRight" size={14} />
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
              <p className="proto-info-hint">
                Protótipo visual: dados fictícios, sem backend e sem validações. Ações que dependem do servidor mostram um aviso.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
