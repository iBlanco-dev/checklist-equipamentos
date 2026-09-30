import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authApi from '../api/auth';
import { extractErrorMessage } from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setEnviado(true);
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <Link to="/entrar" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← voltar para o login
        </Link>
        <div className="tag-card rise" style={{ marginTop: 16 }}>
          <span className="eyebrow">Acesso restrito</span>
          <h2 style={{ marginTop: 6, marginBottom: 20 }}>Esqueci minha senha</h2>

          {enviado ? (
            <p>
              Se o email informado existir, enviaremos um link de redefinição de senha em
              instantes. Verifique sua caixa de entrada.
            </p>
          ) : (
            <form className="stack" onSubmit={submit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {erro && <div className="error-banner">{erro}</div>}

              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
