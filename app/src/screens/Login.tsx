import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, PasswordField, Screen, TextField, TopBar, notify } from '../components/ui';
import { Icon } from '../components/Icon';
import { entrar } from '../data/api';
import { setSessao } from '../data/session';

export default function Login() {
  // Sem autenticação real: nome + e-mail apenas identificam o morador. A senha é ignorada.
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const nav = useNavigate();
  const enviar = async () => {
    try {
      setSessao(await entrar(nome, email));
      nav('/home');
    } catch {
      setErro('Informe nome e e-mail válidos (e confira se a API está no ar).');
    }
  };

  return (
    <Screen bg="white">
      <TopBar title="Acesse sua conta" back="/welcome" />
      <div className="screen-body pad-24 gap-18" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="center stack-6" style={{ marginBottom: 8 }}>
          <h1 className="h1 h1-lg primary">Bem-vindo de volta!</h1>
          <p className="muted text-14">Entre para registrar e acompanhar seus relatos.</p>
        </div>
        <TextField label="Nome" placeholder="Digite seu nome" className="input-tall" value={nome} onChange={(e) => setNome(e.target.value)} />
        <TextField label="E-mail" type="email" placeholder="Digite seu e-mail" className="input-tall" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="stack-8">
          <PasswordField label="Senha" placeholder="Digite sua senha" />
          <button type="button" className="link-strong align-end" onClick={() => notify('Recuperação de senha: fora do escopo desta entrega.')}>
            Esqueceu sua senha?
          </button>
        </div>
        {erro && <div className="alert-danger">{erro}</div>}
        <Button onClick={enviar} className="mt-8">Entrar</Button>
        <div className="divider-or">ou</div>
        <Button variant="outline" className="btn-neutral" onClick={() => notify('gov.br: fora do escopo desta entrega.')}>
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
