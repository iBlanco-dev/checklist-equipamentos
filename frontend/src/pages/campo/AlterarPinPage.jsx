import { useState } from 'react';
import { useFuncionario } from '../../context/FuncionarioContext';
import * as funcionariosApi from '../../api/funcionarios';
import { extractErrorMessage } from '../../api/client';

export default function AlterarPinPage() {
  const { funcionario } = useFuncionario();
  const [pinAtual, setPinAtual] = useState('');
  const [novoPin, setNovoPin] = useState('');
  const [confirmarPin, setConfirmarPin] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    if (novoPin !== confirmarPin) {
      setErro('Os PINs não coincidem');
      return;
    }

    setSalvando(true);
    try {
      await funcionariosApi.changeOwnPin(funcionario.id, pinAtual, novoPin);
      setPinAtual('');
      setNovoPin('');
      setConfirmarPin('');
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
        <h1>Alterar meu PIN</h1>
        <p style={{ marginTop: 4 }}>{funcionario?.nome}</p>
      </div>

      <form className="tag-card stack" onSubmit={submit} style={{ maxWidth: 360 }}>
        <div className="field">
          <label>PIN atual</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={pinAtual}
            onChange={(e) => setPinAtual(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <div className="field">
          <label>Novo PIN</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={novoPin}
            onChange={(e) => setNovoPin(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <div className="field">
          <label>Confirmar novo PIN</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={confirmarPin}
            onChange={(e) => setConfirmarPin(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>

        {erro && <div className="error-banner">{erro}</div>}
        {sucesso && <div className="tag-card">PIN alterado com sucesso.</div>}

        <button
          className="btn btn-primary"
          disabled={salvando || pinAtual.length !== 4 || novoPin.length !== 4 || confirmarPin.length !== 4}
        >
          {salvando ? 'Salvando...' : 'Salvar novo PIN'}
        </button>
      </form>
    </div>
  );
}
