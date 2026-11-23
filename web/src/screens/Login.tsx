import { Link } from 'react-router-dom';
import { Button, PasswordField, Screen, TextField, TopBar, notify } from '../components/ui';
import { Icon } from '../components/Icon';

export default function Login() {
  return (
    <Screen bg="white">
      <TopBar title="Acesse sua conta" back="/welcome" />
      <div className="screen-body pad-24 gap-18" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="center stack-6" style={{ marginBottom: 8 }}>
          <h1 className="h1 h1-lg primary">Bem-vindo de volta!</h1>
          <p className="muted text-14">Entre para registrar e acompanhar seus relatos.</p>
        </div>
        <TextField label="E-mail ou CPF" placeholder="Digite seu e-mail ou CPF" className="input-tall" />
        <div className="stack-8">
          <PasswordField label="Senha" placeholder="Digite sua senha" />
          <button type="button" className="link-strong align-end" onClick={() => notify('Recuperação de senha: próxima etapa.')}>
            Esqueceu sua senha?
          </button>
        </div>
        <Button to="/home" className="mt-8">Entrar</Button>
        <div className="divider-or">ou</div>
        <Button to="/home" variant="outline" className="btn-neutral">
          <Icon name="shield" color="#1F4E8C" />
          Entrar com gov.br
        </Button>
        <div className="spacer" />
        <p className="center muted text-14">
          Não tem uma conta? <Link to="/signup" className="link-strong">Criar conta</Link>
        </p>
      </div>
    </Screen>
  );
}
