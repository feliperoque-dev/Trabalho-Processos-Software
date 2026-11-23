import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toast } from '../components/ui';

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
const CHROME_HEIGHT = 48;

/** Reduz o celular para caber na altura da janela (só em telas largas). */
function useFitScale() {
  const compute = () => Math.min(1, Math.max(0.6, (window.innerHeight - CHROME_HEIGHT) / PHONE_HEIGHT));
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const onResize = () => setScale(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return window.innerWidth > 520 ? scale : 1;
}

/** App do morador: moldura de celular centralizada (no celular de verdade ocupa a tela). */
export default function AppShell() {
  const { pathname } = useLocation();
  const scale = useFitScale();
  return (
    <div className="proto">
      <main className="proto-stage">
        <div className="phone" style={scale < 1 ? { zoom: scale } : undefined}>
          <div className="phone-screen">
            <StatusBar light={pathname === '/welcome'} />
            <Outlet />
            <Toast />
          </div>
        </div>
      </main>
    </div>
  );
}
