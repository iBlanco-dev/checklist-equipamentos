import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import * as itensApi from '../../api/itens';
import { imageUrl, extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import ItemIcon from '../../components/ItemIcon';
import FileField from '../../components/FileField';

export default function ItensPage() {
  const [itens, setItens] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [imageFile, setImageFile] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editandoNome, setEditandoNome] = useState('');
  const [editandoQuantidade, setEditandoQuantidade] = useState('1');
  const [editandoImagem, setEditandoImagem] = useState(null);

  const carregar = () => itensApi.listItens().then(setItens).catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await itensApi.createItem({ nome, quantidade, imageFile });
      setNome('');
      setQuantidade('1');
      setImageFile(null);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  const abrirEdicao = (item) => {
    setEditando(item);
    setEditandoNome(item.nome);
    setEditandoQuantidade(String(item.quantidade));
    setEditandoImagem(null);
  };

  const salvarEdicao = async () => {
    setErro(null);
    try {
      await itensApi.updateItem(editando.id, {
        nome: editandoNome,
        quantidade: editandoQuantidade,
        imageFile: editandoImagem,
      });
      setEditando(null);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const remover = async (id) => {
    if (!confirm('Excluir este item?')) return;
    setErro(null);
    try {
      await itensApi.deleteItem(id);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Itens</h1>
          <p>Catálogo de equipamentos disponíveis para as comandas.</p>
        </div>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo item</span>
        <div className="form-row">
          <div className="field">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field field-narrow">
            <label>Quantidade</label>
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
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

      {itens === null && <Loader label="Carregando itens" />}
      {itens && itens.length === 0 && <EmptyState title="Nenhum item cadastrado" />}

      {itens && itens.length > 0 && (
        <div className="entity-grid">
          {itens.map((item) => (
            <div key={item.id} className="entity-card">
              <div className="entity-thumb">
                {item.image ? <img src={imageUrl(item.image)} alt="" /> : <ItemIcon nome={item.nome} />}
              </div>
              <div className="entity-body">
                <span className="entity-title">{item.nome}</span>
                <span className={`stamp ${item.disponivel === 0 ? 'stamp-aberta' : 'stamp-concluida'}`} style={{ fontSize: '0.68rem' }}>
                  {item.disponivel === 0 ? 'Em uso' : 'Disponível'}
                </span>
                <span className="entity-meta mono">
                  {item.quantidade > 1 || item.em_uso > 0 ? `${item.disponivel} de ${item.quantidade} livres` : '1 unidade'}
                </span>
              </div>
              <div className="entity-actions">
                <button className="btn btn-ghost btn-sm" aria-label="Editar" onClick={() => abrirEdicao(item)}>
                  <Pencil size={16} />
                  <span className="btn-label">Editar</span>
                </button>
                <button className="btn btn-danger btn-sm" aria-label="Excluir" onClick={() => remover(item.id)}>
                  <Trash2 size={16} />
                  <span className="btn-label">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <Modal title={`Editar item`} onClose={() => setEditando(null)}>
          <div className="stack">
            <div className="field">
              <label>Nome</label>
              <input type="text" value={editandoNome} onChange={(e) => setEditandoNome(e.target.value)} />
            </div>
            <div className="field">
              <label>Quantidade</label>
              <input
                type="number"
                min={Math.max(editando.em_uso, 1)}
                step="1"
                inputMode="numeric"
                value={editandoQuantidade}
                onChange={(e) => setEditandoQuantidade(e.target.value)}
              />
              {editando.em_uso > 0 && (
                <span className="eyebrow">{editando.em_uso} unidade(s) em comandas abertas agora</span>
              )}
            </div>
            <div className="field">
              <label>Nova foto (opcional)</label>
              <FileField file={editandoImagem} onChange={setEditandoImagem} />
            </div>
            <button className="btn btn-primary btn-block" onClick={salvarEdicao}>
              Salvar alterações
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
