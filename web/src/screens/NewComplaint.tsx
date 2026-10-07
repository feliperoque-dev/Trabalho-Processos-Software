import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, CategoryCard, Chip, Footer, Screen, SectionCard, StepHeader, SwitchRow, TextField, TopBar, notify } from '../components/ui';
import { Icon, PlayIcon } from '../components/Icon';
import { categories, categoryById, frequencyLabel, typeLabel, type ComplaintType, type Frequency } from '../data/mock';
import { useDraft } from '../data/draft';

/* ---------- 05 · Tipo de ocorrência ---------- */

const types: { id: ComplaintType; text: string; icon: 'crane' | 'house' }[] = [
  { id: 'obra', text: 'Ruído, poeira, entulho, horário irregular, risco estrutural', icon: 'crane' },
  { id: 'vizinhanca', text: 'Calçada obstruída, danos a imóveis vizinhos, trânsito de caminhões', icon: 'house' },
];

export function NewComplaint() {
  const { draft, update } = useDraft();
  return (
    <Screen>
      <TopBar tone="bar" title="Nova reclamação" close="/home" />
      <div className="screen-body pad-20 gap-16" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div>
          <h1 className="h2-xl" style={{ marginBottom: 6 }}>O que você quer relatar?</h1>
          <p className="muted text-14 lh">Escolha o tipo de ocorrência. Isso direciona sua reclamação ao setor certo da prefeitura.</p>
        </div>
        {types.map((t) => {
          const on = draft.type === t.id;
          return (
            <button key={t.id} type="button" className={`type-card ${on ? 'selected' : ''} type-${t.id}`} aria-pressed={on} onClick={() => update({ type: t.id })}>
              <div className="type-card-icon">
                <Icon name={t.icon} size={26} />
              </div>
              <div className="grow">
                <div className="type-card-title">{typeLabel[t.id]}</div>
                <div className="type-card-text">{t.text}</div>
              </div>
              <div className="radio-dot">{on && <Icon name="check" size={14} stroke={3} />}</div>
            </button>
          );
        })}
        <div className="card card-lg stack-12">
          <div className="text-14 strong-800">Como funciona</div>
          {['Escolha a categoria e descreva o problema', 'Anexe fotos e confirme a localização', 'Receba um protocolo e acompanhe pelo app'].map((s, i) => (
            <div key={s} className="how-step">
              <span>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <div className="alert-danger">
          <Icon name="risco" size={18} />
          <span>Risco imediato à vida? Ligue para a Defesa Civil (199) antes de registrar.</span>
        </div>
      </div>
      <Footer>
        <Button to="/complaint/new/category">Continuar</Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 06 · Passo 1: Categoria ---------- */

export function CategoryStep() {
  const { draft, update } = useDraft();
  return (
    <Screen>
      <StepHeader step={1} back="/complaint/new" />
      <div className="screen-body pad-20 gap-14" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div>
          <h1 className="h2-lg" style={{ marginBottom: 4 }}>Qual é o problema?</h1>
          <p className="muted text-14">Selecione a categoria que melhor descreve a situação.</p>
        </div>
        <div className="grid-2">
          {categories.map((c) => (
            <CategoryCard key={c.id} icon={c.icon} label={c.label} hint={c.hint} selected={draft.category === c.id} onSelect={() => update({ category: c.id })} />
          ))}
        </div>
      </div>
      <Footer>
        <Button to="/complaint/new/details">Próximo</Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 07 · Passo 2: Detalhes ---------- */

export function DetailsStep() {
  const { draft, update } = useDraft();
  const category = categoryById(draft.category);
  return (
    <Screen>
      <StepHeader step={2} back="/complaint/new/category" />
      <div className="screen-body pad-20 gap-16" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <div className="pill-primary">
          <Icon name={category.icon} size={16} />
          {category.label}
        </div>
        <div className="field">
          <label htmlFor="fm-desc">Descreva o problema</label>
          <textarea id="fm-desc" rows={4} className="input textarea" maxLength={500} value={draft.description} onChange={(e) => update({ description: e.target.value })} />
          <div className="caption right">{draft.description.length}/500</div>
        </div>
        <div className="grid-2">
          <TextField label="Data" value={draft.date} onChange={(e) => update({ date: e.target.value })} className="input-sm" />
          <TextField label="Horário" value={draft.time} onChange={(e) => update({ time: e.target.value })} className="input-sm" />
        </div>
        <fieldset className="fieldset">
          <legend>Com que frequência acontece?</legend>
          <div className="chips wrap">
            {(Object.keys(frequencyLabel) as Frequency[]).map((f) => (
              <Chip key={f} size="lg" selected={draft.frequency === f} onClick={() => update({ frequency: f })}>
                {frequencyLabel[f]}
              </Chip>
            ))}
          </div>
        </fieldset>
        <TextField
          label="Responsável pela obra"
          optional
          placeholder="Nome da construtora ou nº do alvará"
          className="input-sm"
          value={draft.contractor}
          onChange={(e) => update({ contractor: e.target.value })}
        />
        <div className="card">
          <SwitchRow
            title="Enviar de forma anônima"
            description="Seu nome não será mostrado ao responsável pela obra"
            checked={draft.anonymous}
            onChange={(v) => update({ anonymous: v })}
          />
        </div>
      </div>
      <Footer>
        <Button to="/complaint/new/media">Próximo</Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 08 · Passo 3: Fotos e vídeos ---------- */

const allMedia = [
  { id: 'foto', label: '22:31 · foto', kind: 'photo' },
  { id: 'video', label: '0:14 · vídeo', kind: 'video' },
  { id: 'db', label: 'medidor', kind: 'meter' },
] as const;

export function MediaStep() {
  const { update } = useDraft();
  const [media, setMedia] = useState<string[]>(allMedia.map((m) => m.id));
  const remove = (id: string) => {
    const next = media.filter((m) => m !== id);
    setMedia(next);
    update({ media: next.length });
  };
  const add = () => {
    const missing = allMedia.find((m) => !media.includes(m.id));
    if (!missing) return notify('Seleção de arquivos: próxima etapa.');
    const next = [...media, missing.id];
    setMedia(next);
    update({ media: next.length });
  };

  return (
    <Screen>
      <StepHeader step={3} back="/complaint/new/details" />
      <div className="screen-body pad-20 gap-16" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div>
          <h1 className="h2-lg" style={{ marginBottom: 4 }}>Adicione evidências</h1>
          <p className="muted text-14 lh">Fotos e vídeos aceleram a fiscalização. Até 5 arquivos, 30 s por vídeo.</p>
        </div>
        <div className="grid-3">
          {(['camera', 'video', 'gallery'] as const).map((k) => (
            <button key={k} type="button" className="media-source" onClick={add}>
              <Icon name={k} size={22} />
              {{ camera: 'Câmera', video: 'Vídeo', gallery: 'Galeria' }[k]}
            </button>
          ))}
        </div>
        <div className="row-between baseline">
          <h2 className="h4">Anexados</h2>
          <span className="muted text-13">{media.length} de 5</span>
        </div>
        <div className="grid-3">
          {allMedia
            .filter((m) => media.includes(m.id))
            .map((m) => (
              <div key={m.id} className={`media-thumb media-${m.kind}`}>
                {m.kind === 'photo' && (
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="fill-abs">
                    <path d="M0 70h100v30H0z" fill="#3A4E53" />
                    <path d="M20 70V40h18v30M55 70V30h22v40" fill="none" stroke="#F2A65A" strokeWidth="2" />
                    <circle cx="80" cy="18" r="6" fill="#F7E7B0" />
                  </svg>
                )}
                {m.kind === 'video' && (
                  <div className="fill-abs flex-center">
                    <div className="play-btn"><PlayIcon /></div>
                  </div>
                )}
                {m.kind === 'meter' ? (
                  <div className="meter">
                    <div className="meter-value">92 dB</div>
                    <div className="meter-label">medidor</div>
                  </div>
                ) : (
                  <span className="media-tag">{m.label}</span>
                )}
                <button type="button" className="media-remove" aria-label={`Remover ${m.label}`} onClick={() => remove(m.id)}>
                  <Icon name="close" size={14} stroke={2.6} />
                </button>
              </div>
            ))}
        </div>
        <div className="card stack-10">
          <div className="text-13 strong-800">Dicas para uma boa evidência</div>
          {['Mostre a obra e o problema no mesmo quadro', 'Data, hora e GPS são registrados automaticamente', 'Evite rostos de pessoas e placas de veículos'].map((t) => (
            <div key={t} className="tip">
              <Icon name="check" size={16} stroke={2.4} color="#0D5E6B" />
              {t}
            </div>
          ))}
        </div>
      </div>
      <Footer row>
        <Button to="/complaint/new/location" variant="ghost">Pular</Button>
        <Button to="/complaint/new/location" className="grow">Próximo</Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 09 · Passo 4: Localização ---------- */

function NeighborhoodMap() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 390 330" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa do bairro com o local marcado" className="fill-abs">
      <rect width="390" height="330" fill="#E5ECE6" />
      <path d="M-10 250C60 230 90 280 160 260S270 200 400 220" fill="none" stroke="#A9D3DE" strokeWidth="22" />
      <g fill="#D3DDD5">
        <rect x="14" y="16" width="70" height="56" rx="4" /><rect x="104" y="16" width="86" height="56" rx="4" /><rect x="210" y="16" width="70" height="56" rx="4" /><rect x="300" y="16" width="80" height="56" rx="4" />
        <rect x="14" y="94" width="70" height="66" rx="4" /><rect x="104" y="94" width="86" height="66" rx="4" /><rect x="300" y="94" width="80" height="66" rx="4" />
        <rect x="14" y="182" width="70" height="40" rx="4" /><rect x="210" y="182" width="70" height="20" rx="4" /><rect x="300" y="182" width="80" height="20" rx="4" />
        <rect x="14" y="290" width="120" height="40" rx="4" /><rect x="230" y="270" width="150" height="60" rx="4" />
      </g>
      <rect x="210" y="94" width="70" height="66" rx="4" fill="#F7D6BD" />
      <rect x="104" y="182" width="86" height="40" rx="4" fill="#CFE4C8" />
      <g stroke="#FFFFFF" strokeWidth="10" fill="none">
        <path d="M0 83h390M0 171h390M94 0v240M200 0v240M290 0v240" />
      </g>
      <text x="12" y="167" fontFamily="Manrope, sans-serif" fontSize="10" fontWeight="700" fill="#5B6B70">RUA DAS FLORES</text>
      <text x="300" y="79" fontFamily="Manrope, sans-serif" fontSize="10" fontWeight="700" fill="#5B6B70">AV. CENTRAL</text>
      <circle cx="245" cy="127" r="38" fill="#0D5E6B" fillOpacity="0.12" stroke="#0D5E6B" strokeOpacity="0.4" />
      <g transform="translate(225 76) scale(1.667)">
        <path d="M12 30s-10-9.5-10-17.5a10 10 0 0 1 20 0C22 20.5 12 30 12 30z" fill="#C2410C" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function LocationStep() {
  const { draft, update } = useDraft();
  return (
    <Screen>
      <StepHeader step={4} back="/complaint/new/media" />
      <div className="map">
        <NeighborhoodMap />
        <div className="map-search">
          <Icon name="search" size={18} color="#5B6B70" />
          <label htmlFor="lc-busca" className="sr-only">Buscar endereço</label>
          <input id="lc-busca" type="text" placeholder="Buscar endereço ou ponto de referência" />
        </div>
        <button type="button" className="map-locate" aria-label="Usar minha localização atual" onClick={() => notify('GPS: próxima etapa.')}>
          <Icon name="target" size={22} />
        </button>
      </div>
      <div className="screen-body pad-20 gap-14" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <div className="card row gap-12 align-start">
          <div className="icon-tile icon-tile-accent">
            <Icon name="pin" />
          </div>
          <div className="grow">
            <div className="text-15 strong">Rua das Flores, 123</div>
            <div className="muted text-13" style={{ marginTop: 2 }}>Centro · CEP 00000-000</div>
          </div>
          <button type="button" className="link-strong" onClick={() => notify('Alterar endereço: próxima etapa.')}>Alterar</button>
        </div>
        <TextField label="Ponto de referência" optional className="input-sm" value={draft.reference} onChange={(e) => update({ reference: e.target.value })} />
        <p className="caption lh">Arraste o mapa para ajustar o pino exatamente sobre a obra.</p>
      </div>
      <Footer>
        <Button to="/complaint/new/review">Confirmar local</Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 10 · Passo 5: Revisão ---------- */

export function ReviewStep() {
  const { draft } = useDraft();
  return (
    <Screen>
      <StepHeader step={5} back="/complaint/new/location" />
      <div className="screen-body pad-20 gap-12" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <h1 className="h2-lg">Confira antes de enviar</h1>
        <SectionCard label="Categoria" editTo="/complaint/new/category">
          <div className="text-15 strong">
            {typeLabel[draft.type]} · {categoryById(draft.category).label}
          </div>
        </SectionCard>
        <SectionCard label="Detalhes" editTo="/complaint/new/details">
          <div className="text-14 lh">{draft.description || <span className="muted">Sem descrição</span>}</div>
          <div className="chips wrap" style={{ marginTop: 2 }}>
            <span className="tag">{draft.date} · {draft.time}</span>
            <span className="tag">{frequencyLabel[draft.frequency]}</span>
            <span className="tag">{draft.anonymous ? 'Anônimo' : 'Identificado'}</span>
          </div>
        </SectionCard>
        <SectionCard label={`Evidências (${draft.media})`} editTo="/complaint/new/media">
          <div className="row gap-8">
            <div className="thumb thumb-64 thumb-dark" />
            <div className="thumb thumb-64 thumb-mid flex-center white"><PlayIcon /></div>
            <div className="thumb thumb-64 thumb-light flex-center meter-mini">92 dB</div>
          </div>
        </SectionCard>
        <SectionCard label="Localização" editTo="/complaint/new/location">
          <div className="text-15 strong">Rua das Flores, 123 — Centro</div>
          {draft.reference && <div className="muted text-13">{draft.reference}</div>}
        </SectionCard>
        <label className="check-row">
          <input type="checkbox" defaultChecked />
          <span>Declaro que as informações são verdadeiras. Denúncia falsa pode gerar responsabilização.</span>
        </label>
      </div>
      <Footer>
        <Button to="/complaint/success">
          Enviar reclamação
          <Icon name="send" size={18} stroke={2.2} />
        </Button>
      </Footer>
    </Screen>
  );
}

/* ---------- 11 · Confirmação ---------- */

export function Success() {
  const [copied, setCopied] = useState(false);
  const protocol = '#2026-0852';
  const copy = () => {
    navigator.clipboard?.writeText(protocol).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Screen bg="white">
      <div className="screen-body pad-24 gap-20" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="success-badge">
          <div>
            <Icon name="check" size={40} stroke={2.6} />
          </div>
        </div>
        <div className="center stack-8">
          <h1 className="h1 h1-lg">Reclamação enviada!</h1>
          <p className="lead">Recebemos seu relato e ele já está na fila da fiscalização de obras.</p>
        </div>
        <div className="protocol-box">
          <div className="overline">Número do protocolo</div>
          <div className="protocol-number">{protocol}</div>
          <button type="button" className="copy-btn" onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? 'Copiado!' : 'Copiar protocolo'}
          </button>
        </div>
        <div className="next-steps">
          <div className="text-14 strong-800">Próximos passos</div>
          <div><Icon name="clock" size={18} color="#0D5E6B" /><span>Triagem em até <strong>2 dias úteis</strong></span></div>
          <div><Icon name="bell" size={18} color="#0D5E6B" /><span>Você recebe uma notificação a cada mudança de status</span></div>
          <div><Icon name="shieldPlain" size={18} color="#0D5E6B" /><span>Seus dados não são compartilhados com a construtora</span></div>
        </div>
        <div className="spacer" />
        <Button to="/complaint/2026-0852">Acompanhar reclamação</Button>
        <Link to="/home" className="btn btn-ghost btn-48" style={{ marginTop: -8 }}>Voltar ao início</Link>
      </div>
    </Screen>
  );
}
