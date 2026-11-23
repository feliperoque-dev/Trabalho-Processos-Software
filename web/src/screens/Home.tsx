import { Link } from 'react-router-dom';
import { BottomTabBar, ComplaintCard, Screen, StatTile } from '../components/ui';
import { Icon } from '../components/Icon';
import { myComplaints, user } from '../data/mock';

export default function Home() {
  const recent = myComplaints.slice(0, 3);
  const open = myComplaints.filter((c) => c.status !== 'resolvida').length;
  const analysis = myComplaints.filter((c) => c.status === 'em_analise').length;
  const resolved = myComplaints.filter((c) => c.status === 'resolvida').length;

  return (
    <Screen>
      <div className="screen-body pad-20 gap-20" style={{ paddingTop: 56 }}>
        <div className="row gap-12">
          <div className="grow">
            <div className="muted text-14">Bem-vinda de volta</div>
            <div className="h2-xl">Olá, {user.firstName}</div>
          </div>
          <Link to="/complaint/2026-0847" className="round-btn" aria-label="Notificações, 1 nova">
            <Icon name="bell" />
            <span className="notif-dot" />
          </Link>
          <Link to="/profile" className="avatar" aria-label="Perfil">
            {user.initials}
          </Link>
        </div>

        <Link to="/complaint/new" className="hero-cta">
          <div className="grow stack-4">
            <div className="hero-cta-title">Nova reclamação</div>
            <div className="hero-cta-text">Informe um problema de obra ou de vizinhança agora mesmo</div>
          </div>
          <div className="hero-cta-icon">
            <Icon name="plus" size={24} stroke={2.2} />
          </div>
        </Link>

        <div className="grid-3">
          <StatTile value={open} label="Abertas" />
          <StatTile value={analysis} label="Em análise" />
          <StatTile value={resolved} label="Resolvidas" />
        </div>

        <div className="row-between baseline">
          <h2 className="h2">Reclamações recentes</h2>
          <Link to="/complaints" className="link-strong">Ver todas</Link>
        </div>
        <div className="stack-10">
          {recent.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      </div>
      <BottomTabBar />
    </Screen>
  );
}
