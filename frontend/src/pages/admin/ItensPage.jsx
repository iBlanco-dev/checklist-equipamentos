import { useEffect, useRef, useState } from 'react';
import * as itensApi from '../../api/itens';
import { imageUrl, extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

export default function ItensPage() {
  const [itens, setItens] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [imageFile, setImageFile] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const fileInputRef = useRef(null);
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      <div>
        <h1>Itens</h1>
        <p style={{ marginTop: 4 }}>Catálogo de equipamentos disponíveis para as comandas.</p>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo item</span>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field" style={{ width: 110 }}>
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
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Foto</label>
            <div className="field-file">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
              />
            </div>
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
        <div className="item-picker" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {itens.map((item) => (
            <div key={item.id} className="tag-card" style={{ padding: 14, textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  margin: '0 auto 8px',
                  overflow: 'hidden',
                  background: 'var(--surface-sunken)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.image ? (
                  <img src={imageUrl(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="mono">{item.nome.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>{item.nome}</p>
              <span className={`stamp ${item.disponivel === 0 ? 'stamp-aberta' : 'stamp-concluida'}`} style={{ fontSize: '0.68rem' }}>
                {item.disponivel === 0 ? 'Em uso' : 'Disponível'}
              </span>
              <p className="mono" style={{ fontSize: '0.72rem', marginTop: 6 }}>
                {item.quantidade > 1 || item.em_uso > 0
                  ? `${item.disponivel} de ${item.quantidade} livres`
                  : '1 unidade'}
              </p>
              <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => abrirEdicao(item)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => remover(item.id)}>
                  Excluir
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
              <div className="field-file">
                <input type="file" accept="image/*" onChange={(e) => setEditandoImagem(e.target.files[0] || null)} />
              </div>
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
