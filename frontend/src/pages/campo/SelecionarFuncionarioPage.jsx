import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as funcionariosApi from '../../api/funcionarios';
import { useFuncionario } from '../../context/FuncionarioContext';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import PinPad from '../../components/PinPad';

export default function SelecionarFuncionarioPage() {
  const { setFuncionario } = useFuncionario();
  const [funcionarios, setFuncionarios] = useState(null);
  const [erro, setErro] = useState(null);

  // Perfil tocado: só entra depois do PIN, pra ninguém ver itens e comandas sem se identificar
  const [selecionado, setSelecionado] = useState(null);
  const [entrando, setEntrando] = useState(false);
  const [erroPin, setErroPin] = useState(null);

  useEffect(() => {
    funcionariosApi
      .listFuncionarios()
      .then(setFuncionarios)
      .catch((e) => setErro(extractErrorMessage(e)));
  }, []);

  const fecharPin = () => {
    setSelecionado(null);
    setErroPin(null);
  };

  const entrar = async (pin) => {
    setEntrando(true);
    setErroPin(null);
    try {
      const { token, funcionario } = await funcionariosApi.entrarComPin(selecionado.id, pin);
      setFuncionario({ ...funcionario, token });
    } catch (err) {
      setErroPin(extractErrorMessage(err));
      setEntrando(false);
    }
  };

  return (
    <div className="shell" style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <Link to="/" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← voltar
        </Link>
        <h2 style={{ marginTop: 16, marginBottom: 4 }}>Quem é você?</h2>
        <p style={{ marginBottom: 20 }}>Selecione seu nome na lista da equipe e digite seu PIN.</p>

        {erro && <div className="error-banner">{erro}</div>}
        {funcionarios === null && <Loader label="Carregando equipe" />}

        <div className="stack">
          {funcionarios &&
            funcionarios.map((f) => (
              <button
                key={f.id}
                className="tag-card"
                style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
                onClick={() => setSelecionado(f)}
              >
                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.nome}</p>
                <span className="eyebrow">{f.role}</span>
              </button>
            ))}
        </div>
      </div>

      {selecionado && (
        <Modal title="Digite seu PIN" onClose={fecharPin}>
          <PinPad
            key={selecionado.id}
            label="Entrar como"
            nomeFuncionario={selecionado.nome}
            onConfirm={entrar}
            onCancel={fecharPin}
            loading={entrando}
            error={erroPin}
          />
        </Modal>
      )}
    </div>
  );
}
