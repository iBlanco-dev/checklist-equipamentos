import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as authApi from '../api/auth';
import { extractErrorMessage } from '../api/client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, senha);
      navigate('/entrar');
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="shell" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="tag-card rise">
            <span className="eyebrow">Link inválido</span>
            <p style={{ marginTop: 12 }}>
              Este link de redefinição de senha é inválido. Solicite um novo em{' '}
              <Link to="/esqueci-senha">esqueci minha senha</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <Link to="/entrar" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← voltar para o login
        </Link>
        <div className="tag-card rise" style={{ marginTop: 16 }}>
          <span className="eyebrow">Acesso restrito</span>
          <h2 style={{ marginTop: 6, marginBottom: 20 }}>Definir nova senha</h2>

          <form className="stack" onSubmit={submit}>
            <div className="field">
              <label htmlFor="senha">Nova senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmarSenha">Confirmar nova senha</label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {erro && <div className="error-banner">{erro}</div>}

            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
