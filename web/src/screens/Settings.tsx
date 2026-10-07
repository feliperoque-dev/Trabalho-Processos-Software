import { useState } from 'react';
import { Screen, SwitchRow, TopBar, notify } from '../components/ui';
import { Icon } from '../components/Icon';

const textSizes = [
  { id: 'sm', size: 13, label: 'Texto pequeno' },
  { id: 'md', size: 15, label: 'Texto médio' },
  { id: 'lg', size: 18, label: 'Texto grande' },
];

export default function Settings() {
  const [textSize, setTextSize] = useState('md');

  return (
    <Screen>
      <TopBar tone="bar" title="Configurações" back="/profile" />
      <div className="screen-body pad-20 gap-10" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <h2 className="group-title">Notificações</h2>
        <div className="card card-lg list">
          <SwitchRow title="Mudança de status" description="Aviso quando sua reclamação avançar" defaultChecked />
          <SwitchRow title="Obras perto de mim" description="Novos alvarás num raio de 500 m" />
          <SwitchRow title="E-mail" description="Resumo semanal das suas reclamações" defaultChecked />
        </div>

        <h2 className="group-title mt-10">Privacidade</h2>
        <div className="card card-lg list">
          <SwitchRow title="Anônimo por padrão" description="Novas reclamações sem seu nome" />
          <SwitchRow title="Usar localização" description="Preenche o endereço automaticamente" defaultChecked />
          <button type="button" className="list-item" onClick={() => notify('Exportação de dados (LGPD): próxima etapa.')}>
            <span className="grow list-label">Meus dados (LGPD)</span>
            <Icon name="chevron" size={18} color="#7A898D" />
          </button>
        </div>

        <h2 className="group-title mt-10">Acessibilidade</h2>
        <div className="card card-lg list">
          <div className="switch-row">
            <span className="grow switch-row-title">Tamanho do texto</span>
            <div role="group" aria-label="Tamanho do texto" className="segmented">
              {textSizes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={textSize === t.id}
                  aria-label={t.label}
                  className={textSize === t.id ? 'selected' : ''}
                  style={{ fontSize: t.size }}
                  onClick={() => setTextSize(t.id)}
                >
                  A
                </button>
              ))}
            </div>
          </div>
          <SwitchRow title="Alto contraste" />
        </div>
        <div className="spacer" />
        <div className="fine-print center">Versão 1.0.0 · Termos de Uso · Privacidade</div>
      </div>
    </Screen>
  );
}
