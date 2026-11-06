import { useMemo, useState } from 'react';
import { Search, X, Minus, Plus } from 'lucide-react';
import { imageUrl } from '../api/client';
import ItemIcon from './ItemIcon';
import './ItemPicker.css';

// "Câmera  Sony" -> "camera sony": busca ignora acento, caixa e espaços extras
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, ' ')
    .trim();
}

// selecionados: { [id]: quantidade }. onChange(id, quantidade) — quantidade 0 remove o item.
export default function ItemPicker({ itens, selecionados, onChange }) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termos = normalizar(busca).split(' ').filter(Boolean);
    if (termos.length === 0) return itens;
    return itens.filter((item) => {
      const nome = normalizar(item.nome);
      return termos.every((t) => nome.includes(t));
    });
  }, [itens, busca]);

  const escolhidos = itens.filter((item) => selecionados[item.id]);

  if (itens.length === 0) {
    return <p className="eyebrow">Nenhum item disponível no momento.</p>;
  }

  // Enter na busca adiciona o primeiro resultado e limpa o campo, pra emendar a próxima busca
  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const primeiro = filtrados[0];
    if (!primeiro) return;
    const atual = selecionados[primeiro.id] || 0;
    if (atual < primeiro.disponivel) onChange(primeiro.id, atual + 1);
    setBusca('');
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      {escolhidos.length > 0 && (
        <div className="item-chips">
          {escolhidos.map((item) => (
            <span key={item.id} className="item-chip">
              {selecionados[item.id] > 1 && <strong>{selecionados[item.id]}x</strong>}
              {item.nome}
              <button type="button" aria-label={`Remover ${item.nome}`} onClick={() => onChange(item.id, 0)}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="item-search">
        <Search size={18} className="item-search-icon" />
        <input
          type="text"
          inputMode="search"
          enterKeyHint="done"
          placeholder="Buscar item (ex.: bateria, lapela, tripé)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {busca && (
          <button type="button" className="item-search-clear" aria-label="Limpar busca" onClick={() => setBusca('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <p className="eyebrow">Nenhum item encontrado para “{busca}”.</p>
      ) : (
        <div className="item-picker">
          {filtrados.map((item) => {
            const qtd = selecionados[item.id] || 0;
            const ativo = qtd > 0;
            const alternar = () => onChange(item.id, ativo ? 0 : 1);
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-pressed={ativo}
                className={`item-tile ${ativo ? 'active' : ''}`}
                onClick={alternar}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alternar();
                  }
                }}
              >
                <span className="item-tile-check">{ativo ? '✓' : ''}</span>
                <div className="item-tile-thumb">
                  {item.image ? (
                    <img src={imageUrl(item.image)} alt="" />
                  ) : (
                    <ItemIcon nome={item.nome} />
                  )}
                </div>
                <span className="item-tile-nome">{item.nome}</span>
                {item.quantidade > 1 && (
                  <span className="item-tile-disp">
                    {item.disponivel} de {item.quantidade} disponíveis
                  </span>
                )}

                {ativo && item.disponivel > 1 && (
                  <div className="item-stepper" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      aria-label="Diminuir"
                      onClick={() => onChange(item.id, qtd - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mono">{qtd}</span>
                    <button
                      type="button"
                      aria-label="Aumentar"
                      disabled={qtd >= item.disponivel}
                      onClick={() => onChange(item.id, qtd + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
