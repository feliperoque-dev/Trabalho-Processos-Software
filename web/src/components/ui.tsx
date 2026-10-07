import { useEffect, useId, useState, type ReactNode, type InputHTMLAttributes } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { categoryById, statusLabel, typeLabel, type Complaint, type Status } from '../data/mock';
import { useDraft } from '../data/draft';

/* ---------- Button ---------- */

type ButtonProps = {
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  children: ReactNode;
  className?: string;
};

export function Button({ to, onClick, variant = 'primary', children, className = '' }: ButtonProps) {
  const cls = `btn btn-${variant} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* ---------- TextField ---------- */

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; optional?: boolean; children?: ReactNode };

export function TextField({ label, optional, children, className = '', ...input }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="field-optional"> (opcional)</span>}
      </label>
      <input id={id} className={`input ${className}`} {...input} />
      {children}
    </div>
  );
}

export function PasswordField({ label, placeholder }: { label: string; placeholder: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} type={visible ? 'text' : 'password'} placeholder={placeholder} className="input input-tall input-icon-right" />
        <button
          type="button"
          className="input-action"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} />
        </button>
      </div>
    </div>
  );
}

export function SearchField({ placeholder, value, onChange, className = '' }: { placeholder: string; value?: string; onChange?: (v: string) => void; className?: string }) {
  const id = useId();
  return (
    <div className={`search ${className}`}>
      <Icon name="search" size={18} color="#5B6B70" />
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input id={id} type="text" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
}

/* ---------- StatusBadge ---------- */

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}>{statusLabel[status]}</span>;
}

/* ---------- ComplaintCard ---------- */

export function ComplaintCard({ complaint, variant = 'compact' }: { complaint: Complaint; variant?: 'compact' | 'full' }) {
  const to = `/complaint/${complaint.id}`;
  if (variant === 'compact') {
    return (
      <Link to={to} className="card complaint-card">
        <div className="icon-tile">
          <Icon name={categoryById(complaint.category).icon} />
        </div>
        <div className="complaint-card-body">
          <div className="complaint-card-title">{complaint.title}</div>
          <div className="complaint-card-meta">
            <span>
              {complaint.protocol} · {complaint.date}
            </span>
            <StatusBadge status={complaint.status} />
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link to={to} className="card complaint-card-full">
      <div className="row-between">
        <span className="caption-strong">{complaint.protocol}</span>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="complaint-card-title">{complaint.title}</div>
      <div className="complaint-card-info">
        <span>
          <Icon name="pinPlain" size={14} />
          {complaint.place}
        </span>
        <span>
          <Icon name="clock" size={14} />
          {complaint.date}
        </span>
      </div>
    </Link>
  );
}

/* ---------- Cabeçalhos ---------- */

export function TopBar({ title, back, close, action, tone = 'plain' }: { title: string; back?: string; close?: string; action?: ReactNode; tone?: 'plain' | 'bar' }) {
  const target = back ?? close;
  return (
    <header className={`topbar ${tone === 'bar' ? 'topbar-bar' : ''}`}>
      {target ? (
        <Link to={target} className={`icon-btn ${back && tone === 'bar' ? 'icon-btn-primary' : ''}`} aria-label={close ? 'Fechar' : 'Voltar'}>
          <Icon name={close ? 'close' : 'back'} size={22} />
        </Link>
      ) : (
        <span className="icon-btn-spacer" />
      )}
      <div className="topbar-title">{title}</div>
      {action ?? <span className="icon-btn-spacer" />}
    </header>
  );
}

const stepNames = ['Categoria', 'Detalhes', 'Fotos e vídeos', 'Localização', 'Revisão'];

export function StepHeader({ step, back }: { step: number; back: string }) {
  const { draft } = useDraft();
  return (
    <header className="step-header">
      <div className="step-header-row">
        <Link to={back} className="icon-btn icon-btn-primary" aria-label="Voltar">
          <Icon name="back" size={22} />
        </Link>
        <div className="topbar-title">Nova reclamação · {typeLabel[draft.type]}</div>
        <span className="icon-btn-spacer" />
      </div>
      <div className="step-label">
        Passo {step} de 5: {stepNames[step - 1]}
      </div>
      <div className="step-bars" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step}>
        {stepNames.map((n, i) => (
          <div key={n} className={i < step ? 'on' : ''} />
        ))}
      </div>
    </header>
  );
}

/* ---------- Seleção ---------- */

export function CategoryCard({ icon, label, hint, selected, onSelect }: { icon: IconName; label: string; hint: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`category-card ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onSelect}>
      <span className="category-card-icon">
        <Icon name={icon} size={22} />
      </span>
      <span className="category-card-label">{label}</span>
      <span className="category-card-hint">{hint}</span>
    </button>
  );
}

export function Chip({ selected, onClick, children, size = 'md' }: { selected: boolean; onClick: () => void; children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <button type="button" className={`chip chip-${size} ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

export function SwitchRow({ title, description, defaultChecked = false, checked, onChange }: { title: string; description?: string; defaultChecked?: boolean; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="switch-row">
      <span className="switch-row-text">
        <span className="switch-row-title">{title}</span>
        {description && <span className="switch-row-desc">{description}</span>}
      </span>
      <input
        type="checkbox"
        className="switch"
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}

export function SectionCard({ label, editTo, children }: { label: string; editTo: string; children: ReactNode }) {
  return (
    <section className="card section-card">
      <div className="row-between">
        <span className="overline">{label}</span>
        <Link to={editTo} className="link-strong">
          Editar
        </Link>
      </div>
      {children}
    </section>
  );
}

export function StatTile({ value, label, center }: { value: ReactNode; label: string; center?: boolean }) {
  return (
    <div className={`card stat-tile ${center ? 'center' : ''}`}>
      <div className="stat-tile-value">{value}</div>
      <div className="stat-tile-label">{label}</div>
    </div>
  );
}

/* ---------- Navegação inferior ---------- */

const tabs: { to: string; label: string; icon: IconName }[] = [
  { to: '/home', label: 'Início', icon: 'home' },
  { to: '/complaint/new', label: 'Nova', icon: 'plusCircle' },
  { to: '/complaints', label: 'Acompanhar', icon: 'clipboard' },
  { to: '/profile', label: 'Perfil', icon: 'user' },
];

export function BottomTabBar() {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon name={t.icon} size={22} />
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}

/* ---------- Layout de tela ---------- */

export function Screen({ children, bg = 'muted', className = '' }: { children: ReactNode; bg?: 'muted' | 'white'; className?: string }) {
  return <div className={`screen screen-${bg} ${className}`}>{children}</div>;
}

export function Footer({ children, row }: { children: ReactNode; row?: boolean }) {
  return <footer className={`screen-footer ${row ? 'row' : ''}`}>{children}</footer>;
}

/* ---------- Aviso de protótipo ---------- */

const TOAST_EVENT = 'prototype-toast';

/** Para ações que dependem do backend (próxima etapa): mostra um aviso em vez de agir. */
export function notify(message = 'Disponível na próxima etapa (backend).') {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    let timer: number | undefined;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 2200);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
