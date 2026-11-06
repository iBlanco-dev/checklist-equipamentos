import { useEffect, useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import * as clientesApi from '../../api/clientes';
import { imageUrl, extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import FileField from '../../components/FileField';

export default function ClientesPage() {
  const [clientes, setClientes] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const trocaImagemRefs = useRef({});

  const carregar = () => clientesApi.listClientes().then(setClientes).catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await clientesApi.createCliente({ nome, imageFile });
      setNome('');
      setImageFile(null);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  const trocarImagem = async (id, file) => {
    if (!file) return;
    setErro(null);
    try {
      await clientesApi.updateClienteImagem(id, file);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const remover = async (id) => {
    if (!confirm('Excluir este cliente?')) return;
    setErro(null);
    try {
      await clientesApi.deleteCliente(id);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Clientes</h1>
          <p>Cadastre e gerencie os clientes que recebem equipamentos.</p>
        </div>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo cliente</span>
        <div className="form-row">
          <div className="field">
            <label htmlFor="nome-cliente">Nome</label>
            <input id="nome-cliente" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field">
            <label>Foto</label>
            <FileField file={imageFile} onChange={setImageFile} />
          </div>
          <button className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {erro && <div className="error-banner">{erro}</div>}

      {clientes === null && <Loader label="Carregando clientes" />}

      {clientes && clientes.length === 0 && (
        <EmptyState title="Nenhum cliente cadastrado" hint="Adicione o primeiro cliente acima." />
      )}

      {clientes && clientes.length > 0 && (
        <div className="entity-grid">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="entity-card">
              <div className="entity-thumb">
                {cliente.image ? (
                  <img src={imageUrl(cliente.image)} alt="" />
                ) : (
                  <span className="mono">{cliente.nome.trim().slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="entity-body">
                <span className="entity-title">{cliente.nome}</span>
              </div>
              <input
                ref={(el) => (trocaImagemRefs.current[cliente.id] = el)}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => trocarImagem(cliente.id, e.target.files[0])}
              />
              <div className="entity-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  aria-label="Trocar foto"
                  onClick={() => trocaImagemRefs.current[cliente.id]?.click()}
                >
                  <Camera size={16} />
                  <span className="btn-label">Foto</span>
                </button>
                <button className="btn btn-danger btn-sm" aria-label="Excluir" onClick={() => remover(cliente.id)}>
                  <Trash2 size={16} />
                  <span className="btn-label">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
