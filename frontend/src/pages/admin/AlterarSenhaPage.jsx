import { useState } from 'react';
import * as authApi from '../../api/auth';
import { extractErrorMessage } from '../../api/client';

export default function AlterarSenhaPage() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setSalvando(true);
    try {
      await authApi.changePassword(senhaAtual, novaSenha);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setSucesso(true);
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="stack">
      <div>
        <h1>Alterar senha</h1>
        <p style={{ marginTop: 4 }}>Atualize a senha da sua conta de administrador.</p>
      </div>

      <form className="tag-card stack" onSubmit={submit} style={{ maxWidth: 420 }}>
        <div className="field">
          <label htmlFor="senhaAtual">Senha atual</label>
          <input
            id="senhaAtual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="novaSenha">Nova senha</label>
          <input
            id="novaSenha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
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
        {sucesso && <div className="tag-card">Senha alterada com sucesso.</div>}

        <button className="btn btn-primary" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  );
}
