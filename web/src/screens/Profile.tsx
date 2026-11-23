import { Link } from 'react-router-dom';
import { BottomTabBar, Button, Screen, StatTile, notify } from '../components/ui';
import { Icon, type IconName } from '../components/Icon';
import { user } from '../data/mock';

const menu: { label: string; icon: IconName; to?: string }[] = [
  { label: 'Dados pessoais', icon: 'user' },
  { label: 'Endereços salvos', icon: 'pin' },
  { label: 'Minhas reclamações', icon: 'clipboard', to: '/complaints' },
  { label: 'Configurações', icon: 'gear', to: '/settings' },
  { label: 'Ajuda e perguntas frequentes', icon: 'help' },
];

export default function Profile() {
  return (
    <Screen>
      <div className="screen-body pad-20 gap-16" style={{ paddingTop: 56 }}>
        <h1 className="h2-xl">Perfil</h1>
        <div className="card card-lg row gap-14">
          <div className="avatar avatar-lg">{user.initials}</div>
          <div className="grow min-0">
            <div className="h4-17">{user.name}</div>
            <div className="muted text-13">{user.email}</div>
            <div className="muted text-13">CPF {user.cpf}</div>
          </div>
          <button type="button" className="icon-btn icon-btn-primary" aria-label="Editar perfil" onClick={() => notify('Edição de perfil: próxima etapa.')}>
            <Icon name="edit" />
          </button>
        </div>
        <div className="grid-3">
          <StatTile value="9" label="Enviadas" center />
          <StatTile value="5" label="Resolvidas" center />
          <StatTile value="4,6" label="Avaliação" center />
        </div>
        <nav className="card card-lg list">
          {menu.map((m) => {
            const content = (
              <>
                <Icon name={m.icon} color="#0D5E6B" />
                <span className="grow list-label">{m.label}</span>
                <Icon name="chevron" size={18} color="#7A898D" />
              </>
            );
            return m.to ? (
              <Link key={m.label} to={m.to} className="list-item">{content}</Link>
            ) : (
              <button key={m.label} type="button" className="list-item" onClick={() => notify(`${m.label}: próxima etapa.`)}>
                {content}
              </button>
            );
          })}
        </nav>
        <Button to="/welcome" variant="danger" className="btn-52">
          <Icon name="logout" size={18} />
          Sair da conta
        </Button>
      </div>
      <BottomTabBar />
    </Screen>
  );
}
