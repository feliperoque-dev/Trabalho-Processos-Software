import type { ReactNode } from 'react';

// Ícones de traço extraídos dos arquivos de design (viewBox 24x24).
const icons = {
  crane: <><rect x="3" y="6" width="18" height="6" rx="1" /><path d="M7 6l-3 6M12 6l-3 6M17 6l-3 6M21 7l-3 5M6 12v8M18 12v8" /></>,
  house: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></>,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M5 12l5 5 9-10" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.6 6.1A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  shieldPlain: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  plusCircle: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  ruido: <path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />,
  poeira: <path d="M7 16a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.5 9 3.5 3.5 0 0 1 17 16zM8 19h.01M12 20h.01M16 19h.01" />,
  entulho: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  vibracao: <path d="M8 4h8v16H8zM4 8v8M20 8v8" />,
  risco: <path d="M12 3 2 20h20zM12 10v4M12 17h.01" />,
  caminhoes: <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7zM5 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />,
  calcada: <path d="M4 20h16M6 20V9l6-5 6 5v11M10 14h4" />,
  outros: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  target: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  pin: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  pinPlain: <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  send: <path d="M4 12 20 4l-6 16-3-7z" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
  share: <path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" />,
  chat: <path d="M4 5h16v11H8l-4 4z" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16z" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01" /></>,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />,
  site: <><rect x="3" y="6" width="18" height="6" rx="1" /><path d="M6 12v8M18 12v8" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  team: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5M16 4a3.5 3.5 0 0 1 0 7M22 20c-.6-2.4-2-3.9-4-4.6" /></>,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></>,
  monitor: <><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

type Props = { name: IconName; size?: number; stroke?: number; color?: string; className?: string };

export function Icon({ name, size = 20, stroke = 2, color = 'currentColor', className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ flex: 'none' }}
    >
      {icons[name]}
    </svg>
  );
}

export function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4v16l13-8z" />
    </svg>
  );
}
