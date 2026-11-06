import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Package, Timer, Hourglass, Download, TriangleAlert, Clock, PackageOpen } from 'lucide-react';
import * as relatoriosApi from '../../api/relatorios';
import { pdfUrl } from '../../api/comandas';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatCard from '../../components/StatCard';
import './RelatoriosPage.css';

const PERIODOS = [
  { dias: 7, label: '7 dias' },
  { dias: 30, label: '30 dias' },
  { dias: 90, label: '90 dias' },
  { dias: 0, label: 'Tudo' },
];

const LIMITES = [1, 3, 7]; // dias fora para uma comanda aberta virar alerta

const TOP_ITENS = 10;

function formatarDuracao(minutos) {
  if (minutos === null || minutos === undefined) return '—';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  const dias = Math.floor(horas / 24);
  const resto = horas % 24;
  return resto ? `${dias} d ${resto} h` : `${dias} d`;
}

function formatarData(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function diasDesde(iso) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// CSV com ";" e BOM: abre direto no Excel em pt-BR com acentos certos
function exportarCsv(comandas, dias) {
  const cabecalho = ['Comanda', 'Status', 'Cliente', 'Responsável', 'Criada em', 'Concluída em', 'Tempo fora', 'Unidades', 'Itens'];
  const minutosFora = (c) =>
    c.status === 'concluida' && c.concluded_at
      ? Math.round((new Date(c.concluded_at) - new Date(c.created_at)) / 60000)
      : null;
  const linhas = comandas.map((c) => [
    c.id,
    c.status,
    c.cliente_nome,
    c.funcionario_nome,
    formatarData(c.created_at),
    formatarData(c.concluded_at),
    formatarDuracao(minutosFora(c)),
    c.unidades,
    c.itens || '',
  ]);
  const escapar = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cabecalho, ...linhas].map((l) => l.map(escapar).join(';')).join('\r\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comandas-${dias ? `${dias}-dias` : 'todas'}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- comandas abertas há muito tempo ---------- */

function nivelAtraso(minutos, limiteDias) {
  const dias = minutos / 1440;
  if (dias >= limiteDias * 2) return 'critico';
  if (dias >= limiteDias) return 'alerta';
  return 'ok';
}

function AbertasCard({ abertas }) {
  const [limite, setLimite] = useState(3);

  const atrasadas = abertas.filter((c) => nivelAtraso(c.minutos_fora, limite) !== 'ok');
  const emDia = abertas.length - atrasadas.length;
  // Escala do trilho: a mais antiga, mas nunca menor que 2x o limite, pra marca do limite caber
  const escalaMin = Math.max(limite * 2 * 1440, ...abertas.map((c) => c.minutos_fora));

  return (
    <div className="card stack rel-card">
      <div className="spread rel-card-head">
        <div>
          <h3>Comandas abertas há muito tempo</h3>
          <p className="rel-sub">
            {abertas.length === 0
              ? 'Nenhuma comanda aberta agora.'
              : `${abertas.length} aberta(s) agora · ${atrasadas.length} passou(aram) de ${limite} dia(s)`}
          </p>
        </div>
        <div className="rel-segmented" role="group" aria-label="Limite de dias">
          {LIMITES.map((d) => (
            <button key={d} type="button" className={limite === d ? 'active' : ''} onClick={() => setLimite(d)}>
              +{d} {d === 1 ? 'dia' : 'dias'}
            </button>
          ))}
        </div>
      </div>

      {abertas.length === 0 ? (
        <EmptyState title="Tudo devolvido" hint="Quando houver comandas em campo, elas aparecem aqui." />
      ) : (
        <>
          <div className="rel-aging">
            {abertas.map((c) => {
              const nivel = nivelAtraso(c.minutos_fora, limite);
              return (
                <div key={c.id} className={`rel-aging-row nivel-${nivel}`}>
                  <div className="rel-aging-info">
                    <div className="rel-aging-title">
                      <span className="mono">#{c.id}</span>
                      <strong>{c.cliente_nome}</strong>
                    </div>
                    <span className="rel-aging-meta">
                      {c.funcionario_nome} · desde {formatarData(c.created_at)}
                    </span>
                    <span className="rel-aging-itens" title={c.itens}>
                      {c.unidades} un. · {c.itens}
                    </span>
                  </div>

                  <div className="rel-aging-bar" aria-hidden="true">
                    <div className="rel-aging-track">
                      <div className="rel-aging-fill" style={{ width: `${Math.max(2, (c.minutos_fora / escalaMin) * 100)}%` }} />
                      <span className="rel-aging-limit" style={{ left: `${((limite * 1440) / escalaMin) * 100}%` }} />
                    </div>
                  </div>

                  <div className="rel-aging-side">
                    <span className={`rel-badge rel-badge-${nivel}`}>
                      {nivel === 'ok' ? <Clock size={13} /> : <TriangleAlert size={13} />}
                      {formatarDuracao(c.minutos_fora)}
                      <span className="sr-only">
                        {nivel === 'critico' ? ' (muito atrasada)' : nivel === 'alerta' ? ' (passou do limite)' : ' (dentro do limite)'}
                      </span>
                    </span>
                    <a className="btn btn-ghost btn-sm" href={pdfUrl(c.id)} target="_blank" rel="noreferrer">
                      PDF
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rel-legend">
            <span><i className="dot dot-ok" /> Dentro do limite ({emDia})</span>
            <span><i className="dot dot-alerta" /> Passou de {limite} dia(s)</span>
            <span><i className="dot dot-critico" /> Passou de {limite * 2} dias</span>
            <span><i className="tick" /> Marca do limite</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- itens mais usados ---------- */

function RankingItens({ usoItens, periodoLabel }) {
  const [hover, setHover] = useState(null);
  const usados = usoItens.filter((i) => i.vezes > 0).slice(0, TOP_ITENS);
  const max = Math.max(1, ...usados.map((i) => i.vezes));

  return (
    <div className="card stack rel-card">
      <div>
        <h3>Itens mais usados</h3>
        <p className="rel-sub">Vezes que saíram em comandas · {periodoLabel}</p>
      </div>

      {usados.length === 0 ? (
        <EmptyState title="Nenhum item saiu nesse período" />
      ) : (
        <div className="rel-rank" onMouseLeave={() => setHover(null)}>
          {usados.map((item, i) => (
            <div
              key={item.id}
              className={`rel-rank-row ${hover === item.id ? 'hover' : ''}`}
              onMouseEnter={() => setHover(item.id)}
              tabIndex={0}
              onFocus={() => setHover(item.id)}
              onBlur={() => setHover(null)}
            >
              <span className="rel-rank-pos mono">{i + 1}</span>
              <span className="rel-rank-nome">{item.nome}</span>
              <div className="rel-rank-track">
                <div className="rel-rank-fill" style={{ width: `${(item.vezes / max) * 100}%` }} />
                <span className="rel-rank-valor">{item.vezes}x</span>
              </div>

              {hover === item.id && (
                <div className="rel-tooltip" role="tooltip">
                  <strong>{item.nome}</strong>
                  <span>
                    Saiu <b>{item.vezes}</b> vez(es) · <b>{item.unidades}</b> unidade(s)
                  </span>
                  <span>
                    Tempo médio fora: <b>{formatarDuracao(item.minutos_medio)}</b>
                  </span>
                  <span>
                    Estoque: <b>{item.estoque}</b>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- itens parados ---------- */

function ItensParados({ usoItens, periodoLabel }) {
  // Nunca saiu primeiro; depois quem está parado há mais tempo
  const parados = usoItens
    .filter((i) => i.vezes === 0)
    .sort((a, b) => {
      if (!a.ultima_saida) return b.ultima_saida ? -1 : a.nome.localeCompare(b.nome);
      if (!b.ultima_saida) return 1;
      return new Date(a.ultima_saida) - new Date(b.ultima_saida);
    });

  const nunca = parados.filter((i) => !i.ultima_saida).length;

  return (
    <div className="card stack rel-card">
      <div>
        <h3>Itens parados</h3>
        <p className="rel-sub">
          Não saíram em nenhuma comanda · {periodoLabel} · {parados.length} de {usoItens.length} itens
          {nunca > 0 && ` · ${nunca} nunca saíram`}
        </p>
      </div>

      {parados.length === 0 ? (
        <EmptyState title="Todos os itens saíram pelo menos uma vez" />
      ) : (
        <div className="rel-parados">
          {parados.map((item) => (
            <div key={item.id} className="rel-parado">
              <span className="rel-parado-nome">
                {item.nome}
                {item.estoque > 1 && <span className="rel-parado-qtd"> ×{item.estoque}</span>}
              </span>
              <span className={`rel-parado-quando ${item.ultima_saida ? '' : 'nunca'}`}>
                {item.ultima_saida ? `última saída há ${diasDesde(item.ultima_saida)} dia(s)` : 'nunca saiu'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- página ---------- */

export default function RelatoriosPage() {
  const [dias, setDias] = useState(30);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    relatoriosApi
      .getRelatorios(dias)
      .then((d) => ativo && setDados(d))
      .catch((e) => ativo && setErro(extractErrorMessage(e)))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [dias]);

  const periodoLabel = useMemo(() => {
    const p = PERIODOS.find((x) => x.dias === dias);
    return dias ? `últimos ${p.label}` : 'todo o período';
  }, [dias]);

  const atrasadas3d = dados ? dados.abertas.filter((c) => c.minutos_fora >= 3 * 1440).length : 0;

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Relatórios</h1>
          <p>Uso dos equipamentos, devoluções pendentes e exportação.</p>
        </div>
        <div className="rel-head-actions">
          <div className="rel-segmented" role="group" aria-label="Período">
            {PERIODOS.map((p) => (
              <button key={p.dias} type="button" className={dias === p.dias ? 'active' : ''} onClick={() => setDias(p.dias)}>
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!dados || dados.comandas.length === 0}
            onClick={() => exportarCsv(dados.comandas, dias)}
          >
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </div>

      {erro && <div className="error-banner">{erro}</div>}
      {!dados && carregando && <Loader label="Carregando relatórios" />}

      {dados && (
        <div className={`stack ${carregando ? 'rel-recarregando' : ''}`}>
          <div className="stat-grid">
            <StatCard
              label="Abertas há +3 dias"
              value={atrasadas3d}
              hint={`${dados.abertas.length} aberta(s) agora`}
              icon={Hourglass}
              accent={atrasadas3d > 0}
            />
            <StatCard
              label="Comandas"
              value={dados.resumo.comandas}
              hint={dados.resumo.canceladas ? `${periodoLabel} · ${dados.resumo.canceladas} cancelada(s)` : periodoLabel}
              icon={ClipboardList}
            />
            <StatCard label="Unidades movimentadas" value={dados.resumo.unidades} hint={periodoLabel} icon={Package} />
            <StatCard
              label="Tempo médio fora"
              value={formatarDuracao(dados.resumo.minutos_medio_conclusao)}
              hint="Da retirada à conclusão"
              icon={Timer}
            />
          </div>

          <AbertasCard abertas={dados.abertas} />

          <div className="rel-grid">
            <RankingItens usoItens={dados.uso_itens} periodoLabel={periodoLabel} />
            <ItensParados usoItens={dados.uso_itens} periodoLabel={periodoLabel} />
          </div>

          <div className="card rel-export">
            <PackageOpen size={20} />
            <div style={{ flex: 1 }}>
              <strong>{dados.comandas.length} comanda(s) no período</strong>
              <p className="rel-sub">
                O CSV traz cliente, responsável, datas, tempo fora e a lista de itens de cada comanda. Abre direto no Excel.
                Para ver uma comanda específica, use o <Link to="/admin/historico">Histórico</Link>.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={dados.comandas.length === 0}
              onClick={() => exportarCsv(dados.comandas, dias)}
            >
              <Download size={16} /> Baixar CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
