import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Package, Building2, Users, Clock } from 'lucide-react';
import * as comandasApi from '../../api/comandas';
import { imageUrl, extractErrorMessage } from '../../api/client';
import { useFuncionario } from '../../context/FuncionarioContext';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatCard from '../../components/StatCard';
import ItemIcon from '../../components/ItemIcon';
import './ComandasAbertasPage.css';

function tempoFora(iso) {
  const minutos = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  const dias = Math.floor(horas / 24);
  const resto = horas % 24;
  return resto ? `${dias} d ${resto} h` : `${dias} d`;
}

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Cada item fora, somando as unidades e listando com quem e em qual cliente está
function agruparPorItem(comandas) {
  const porItem = new Map();
  for (const c of comandas) {
    for (const item of c.itens) {
      const atual = porItem.get(item.id) || { ...item, quantidade: 0, saidas: [] };
      atual.quantidade += item.quantidade;
      atual.saidas.push({
        id_comanda: c.id,
        quantidade: item.quantidade,
        funcionario_nome: c.funcionario_nome,
        cliente_nome: c.cliente_nome,
        created_at: c.created_at,
      });
      porItem.set(item.id, atual);
    }
  }
  return [...porItem.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function Thumb({ item }) {
  return (
    <span className="abertas-thumb">
      {item.image ? <img src={imageUrl(item.image)} alt="" /> : <ItemIcon nome={item.nome} />}
    </span>
  );
}

function PorComanda({ comandas, idFuncionario }) {
  return (
    <div className="stack">
      {comandas.map((c) => {
        const minha = c.id_funcionario === idFuncionario;
        const unidades = c.itens.reduce((total, i) => total + i.quantidade, 0);
        const conteudo = (
          <>
            <div className="spread">
              <div>
                <span className="eyebrow mono">
                  Comanda #{c.id}
                  {minha && <span className="abertas-minha">sua</span>}
                </span>
                <p className="abertas-cliente">{c.cliente_nome}</p>
                <span className="abertas-meta">
                  com <strong>{c.funcionario_nome}</strong> · desde {formatarData(c.created_at)}
                </span>
              </div>
              <span className="abertas-tempo" title="Tempo fora">
                <Clock size={13} /> {tempoFora(c.created_at)}
              </span>
            </div>

            <hr className="tear" />

            <span className="eyebrow">{unidades} unidade(s) fora</span>
            <div className="abertas-chips">
              {c.itens.map((item) => (
                <span key={item.id} className="abertas-chip">
                  <Thumb item={item} />
                  {item.quantidade > 1 && <strong className="mono">{item.quantidade}x</strong>}
                  {item.nome}
                </span>
              ))}
            </div>
          </>
        );

        // Detalhe (PDF, concluir) continua só para o dono da comanda
        return minha ? (
          <Link key={c.id} to={`/campo/comandas/${c.id}`} className="tag-card stack abertas-card" style={{ textDecoration: 'none' }}>
            {conteudo}
          </Link>
        ) : (
          <div key={c.id} className="tag-card stack abertas-card">
            {conteudo}
          </div>
        );
      })}
    </div>
  );
}

function PorItem({ itens }) {
  return (
    <div className="tag-card abertas-itens">
      {itens.map((item) => (
        <div key={item.id} className="abertas-item-row">
          <Thumb item={item} />
          <div className="abertas-item-info">
            <div className="spread" style={{ flexWrap: 'nowrap' }}>
              <strong>{item.nome}</strong>
              <span className="abertas-item-total mono">{item.quantidade} fora</span>
            </div>
            <ul className="abertas-saidas">
              {item.saidas.map((s) => (
                <li key={s.id_comanda}>
                  <span className="mono">{s.quantidade}x</span> com <strong>{s.funcionario_nome}</strong> em{' '}
                  <strong>{s.cliente_nome}</strong>
                  <span className="abertas-saida-tempo"> · há {tempoFora(s.created_at)} · #{s.id_comanda}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ComandasAbertasPage() {
  const { funcionario } = useFuncionario();
  const [comandas, setComandas] = useState(null);
  const [erro, setErro] = useState(null);
  const [visao, setVisao] = useState('comandas');

  useEffect(() => {
    comandasApi
      .listComandasAbertas()
      .then(setComandas)
      .catch((e) => setErro(extractErrorMessage(e)));
  }, []);

  const itensFora = useMemo(() => (comandas ? agruparPorItem(comandas) : []), [comandas]);

  const resumo = useMemo(() => {
    if (!comandas) return null;
    return {
      comandas: comandas.length,
      unidades: itensFora.reduce((total, i) => total + i.quantidade, 0),
      clientes: new Set(comandas.map((c) => c.id_cliente)).size,
      pessoas: new Set(comandas.map((c) => c.id_funcionario)).size,
    };
  }, [comandas, itensFora]);

  return (
    <div className="stack">
      <div>
        <h2>Comandas abertas</h2>
        <p style={{ marginTop: 4 }}>O que está fora agora, com quem e onde.</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}
      {comandas === null && !erro && <Loader label="Carregando comandas abertas" />}

      {resumo && (
        <div className="stat-grid">
          <StatCard label="Comandas" value={resumo.comandas} icon={ClipboardList} accent />
          <StatCard label="Unidades fora" value={resumo.unidades} icon={Package} />
          <StatCard label="Clientes" value={resumo.clientes} icon={Building2} />
          <StatCard label="Em campo" value={resumo.pessoas} icon={Users} />
        </div>
      )}

      {comandas && comandas.length === 0 && (
        <EmptyState title="Nenhuma comanda aberta" hint="Todos os equipamentos estão de volta." />
      )}

      {comandas && comandas.length > 0 && (
        <>
          <div className="abertas-segmented" role="group" aria-label="Visualização">
            <button type="button" className={visao === 'comandas' ? 'active' : ''} onClick={() => setVisao('comandas')}>
              Por comanda
            </button>
            <button type="button" className={visao === 'itens' ? 'active' : ''} onClick={() => setVisao('itens')}>
              Por item ({itensFora.length})
            </button>
          </div>

          {visao === 'comandas' ? (
            <PorComanda comandas={comandas} idFuncionario={funcionario.id} />
          ) : (
            <PorItem itens={itensFora} />
          )}
        </>
      )}
    </div>
  );
}
