import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Screen, TextField, TopBar, notify } from '../components/ui';

const strengthLabel = ['muito fraca', 'fraca', 'média', 'boa', 'forte'];

export default function Signup() {
  // Medidor apenas visual; a regra real de senha fica para a etapa de validações.
  const [password, setPassword] = useState('');
  const strength = password ? Math.min(4, Math.ceil(password.length / 3)) : 2;

  return (
    <Screen bg="white">
      <TopBar title="Criar conta" back="/welcome" />
      <div className="screen-body pad-24 gap-14" style={{ paddingTop: 12, paddingBottom: 32 }}>
        <p className="muted text-14 lh" style={{ marginBottom: 4 }}>
          Seus dados ficam protegidos e só são usados para dar retorno sobre suas reclamações.
        </p>
        <TextField label="Nome completo" placeholder="Como no seu documento" />
        <TextField label="CPF" placeholder="000.000.000-00" inputMode="numeric" />
        <TextField label="E-mail" type="email" placeholder="voce@email.com" />
        <TextField label="Celular" type="tel" placeholder="(00) 00000-0000" />
        <TextField label="Senha" type="password" placeholder="Mínimo de 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)}>
          <div className="strength" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={i < strength ? 'on' : ''} />
            ))}
          </div>
          <div className="caption">Força da senha: {strengthLabel[strength]}</div>
        </TextField>
        <label className="check-row">
          <input type="checkbox" defaultChecked />
          <span>
            Li e aceito os{' '}
            <button type="button" className="link-strong inline" onClick={() => notify('Termos de Uso: documento a definir.')}>Termos de Uso</button> e a{' '}
            <button type="button" className="link-strong inline" onClick={() => notify('Política de Privacidade: documento a definir.')}>Política de Privacidade</button>.
          </span>
        </label>
        <div className="spacer" />
        <Button to="/home">Criar minha conta</Button>
        <p className="center muted text-14">
          Já tem conta? <Link to="/login" className="link-strong">Entrar</Link>
        </p>
      </div>
    </Screen>
  );
}
