import { Button, Screen } from '../components/ui';
import { Icon } from '../components/Icon';

function NeighborhoodIllustration() {
  return (
    <svg width="320" height="130" viewBox="0 0 320 130" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Ilustração de bairro com prédios e guindaste">
      <path d="M10 118h300" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M150 20v98M150 20h80M150 20l-24 0M228 20v18" stroke="#F2A65A" strokeWidth="2" />
      <path d="M150 20l10 10M150 30l10 10M150 40l10 10M160 20v98" stroke="#F2A65A" strokeWidth="1.4" />
      <rect x="222" y="38" width="12" height="10" stroke="#F2A65A" strokeWidth="1.6" />
      <rect x="30" y="70" width="34" height="48" stroke="#FFFFFF" strokeWidth="1.6" />
      <path d="M26 72l21-14 21 14" stroke="#FFFFFF" strokeWidth="1.6" />
      <rect x="40" y="96" width="12" height="22" stroke="#FFFFFF" strokeWidth="1.4" />
      <rect x="72" y="56" width="30" height="62" fill="#E07A3F" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M78 66h6M90 66h6M78 78h6M90 78h6M78 90h6M90 90h6M78 102h6M90 102h6" stroke="#FFFFFF" strokeWidth="1.4" />
      <rect x="108" y="40" width="34" height="78" stroke="#FFFFFF" strokeWidth="1.6" />
      <path d="M114 50h8M128 50h8M114 62h8M128 62h8M114 74h8M128 74h8M114 86h8M128 86h8M114 98h8M128 98h8" stroke="#FFFFFF" strokeWidth="1.4" />
      <rect x="170" y="62" width="40" height="56" stroke="#FFFFFF" strokeWidth="1.6" strokeDasharray="4 3" />
      <path d="M170 76h40M170 90h40M170 104h40M184 62v56M196 62v56" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1" />
      <rect x="218" y="52" width="32" height="66" fill="#E07A3F" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M224 62h6M236 62h6M224 74h6M236 74h6M224 86h6M236 86h6M224 98h6M236 98h6" stroke="#FFFFFF" strokeWidth="1.4" />
      <rect x="258" y="78" width="40" height="40" stroke="#FFFFFF" strokeWidth="1.6" />
      <path d="M254 80l24-16 24 16" stroke="#FFFFFF" strokeWidth="1.6" />
      <circle cx="18" cy="108" r="7" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M18 115v3" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="306" cy="108" r="7" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M306 115v3" stroke="#FFFFFF" strokeWidth="1.4" />
    </svg>
  );
}

export default function Welcome() {
  return (
    <Screen>
      <div className="welcome-hero">
        <div className="welcome-logo">
          <Icon name="crane" size={36} stroke={1.8} />
        </div>
        <div className="center">
          <div className="welcome-title">Ouvidoria</div>
          <div className="welcome-subtitle">de Obras &amp; Vizinhança</div>
        </div>
        <div className="welcome-illustration">
          <NeighborhoodIllustration />
        </div>
      </div>
      <div className="screen-body pad-24 gap-12" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <h1 className="h1 center">Sua voz transforma o bairro.</h1>
        <p className="lead center">Reporte problemas de obras e vizinhança de forma rápida e segura, e acompanhe cada resposta da prefeitura.</p>
        <div className="welcome-checks">
          <span><Icon name="check" size={16} stroke={2.2} color="#0D5E6B" />Protocolo oficial</span>
          <span><Icon name="check" size={16} stroke={2.2} color="#0D5E6B" />Opção anônima</span>
        </div>
        <div className="spacer" />
        <Button to="/login">Fazer login</Button>
        <Button to="/signup" variant="outline">Criar conta</Button>
        <p className="fine-print center">Ao continuar você concorda com os Termos de Uso e a Política de Privacidade (LGPD).</p>
      </div>
    </Screen>
  );
}
