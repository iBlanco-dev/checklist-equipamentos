import { useEffect, useState } from 'react';
import { Pencil, KeyRound, Trash2 } from 'lucide-react';
import * as funcionariosApi from '../../api/funcionarios';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [role, setRole] = useState('');
  const [pin, setPin] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [resetandoPin, setResetandoPin] = useState(null);
  const [novoPin, setNovoPin] = useState('');

  const carregar = () =>
    funcionariosApi.listFuncionarios().then(setFuncionarios).catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await funcionariosApi.createFuncionario({ nome, role, pin });
      setNome('');
      setRole('');
      setPin('');
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  const salvarEdicao = async () => {
    setErro(null);
    try {
      await funcionariosApi.updateFuncionario(editando.id, { nome: editando.nome, role: editando.role });
      setEditando(null);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const confirmarResetPin = async () => {
    setErro(null);
    try {
      await funcionariosApi.resetPinFuncionario(resetandoPin.id, novoPin);
      setResetandoPin(null);
      setNovoPin('');
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const remover = async (id) => {
    if (!confirm('Excluir este funcionário?')) return;
    setErro(null);
    try {
      await funcionariosApi.deleteFuncionario(id);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Funcionários</h1>
          <p>Equipe que retira e devolve equipamentos em campo.</p>
        </div>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo funcionário</span>
        <div className="form-row">
          <div className="field">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field">
            <label>Cargo</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
          </div>
          <div className="field field-narrow">
            <label>PIN (4 dígitos)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <button className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {erro && <div className="error-banner">{erro}</div>}

      {funcionarios === null && <Loader label="Carregando funcionários" />}
      {funcionarios && funcionarios.length === 0 && (
        <EmptyState title="Nenhum funcionário cadastrado" />
      )}

      {funcionarios && funcionarios.length > 0 && (
        <div className="tag-card table-card table-cards">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((f) => (
                <tr key={f.id}>
                  <td className="td-strong td-head">{f.nome}</td>
                  <td data-label="Cargo">{f.role}</td>
                  <td className="td-actions">
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditando({ ...f })}>
                        <Pencil size={15} /> Editar
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setResetandoPin(f)}>
                        <KeyRound size={15} /> PIN
                      </button>
                      <button className="btn btn-danger btn-sm btn-square" aria-label="Excluir" onClick={() => remover(f.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <Modal title="Editar funcionário" onClose={() => setEditando(null)}>
          <div className="stack">
            <div className="field">
              <label>Nome</label>
              <input type="text" value={editando.nome} onChange={(e) => setEditando({ ...editando, nome: e.target.value })} />
            </div>
            <div className="field">
              <label>Cargo</label>
              <input type="text" value={editando.role} onChange={(e) => setEditando({ ...editando, role: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-block" onClick={salvarEdicao}>
              Salvar alterações
            </button>
          </div>
        </Modal>
      )}

      {resetandoPin && (
        <Modal title={`Novo PIN — ${resetandoPin.nome}`} onClose={() => setResetandoPin(null)}>
          <div className="stack">
            <div className="field">
              <label>PIN (4 dígitos)</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={novoPin}
                onChange={(e) => setNovoPin(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={confirmarResetPin} disabled={novoPin.length !== 4}>
              Salvar novo PIN
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
