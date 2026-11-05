const pool = require('../config/db');

// dias = 0 significa "todo o período"
function filtroPeriodo(alias, dias) {
  return dias > 0 ? `AND ${alias}.created_at >= NOW() - INTERVAL ${Number(dias)} DAY` : '';
}

// Comandas abertas agora, da mais antiga pra mais nova, com o tempo fora calculado no próprio banco
async function abertas() {
  const [rows] = await pool.query(
    `SELECT c.id, c.created_at, cl.nome AS cliente_nome, f.nome AS funcionario_nome,
            TIMESTAMPDIFF(MINUTE, c.created_at, NOW()) AS minutos_fora,
            GROUP_CONCAT(CONCAT(IF(ci.quantidade > 1, CONCAT(ci.quantidade, 'x '), ''), i.nome)
                         ORDER BY i.nome SEPARATOR ', ') AS itens,
            SUM(ci.quantidade) AS unidades
     FROM comandas c
     JOIN clientes cl ON cl.id = c.id_cliente
     JOIN funcionarios f ON f.id = c.id_funcionario
     JOIN comanda_itens ci ON ci.id_comanda = c.id
     JOIN itens i ON i.id = ci.id_item
     WHERE c.status = 'aberta'
     GROUP BY c.id
     ORDER BY c.created_at`
  );
  return rows.map((r) => ({ ...r, unidades: Number(r.unidades) }));
}

// Uso de cada item ativo no período (canceladas não contam como uso)
async function usoItens(dias) {
  const [rows] = await pool.query(
    `SELECT i.id, i.nome, i.quantidade AS estoque,
            COUNT(DISTINCT c.id) AS vezes,
            COALESCE(SUM(CASE WHEN c.id IS NOT NULL THEN ci.quantidade END), 0) AS unidades,
            AVG(CASE WHEN c.id IS NOT NULL
                     THEN TIMESTAMPDIFF(MINUTE, c.created_at, COALESCE(c.concluded_at, NOW())) END) AS minutos_medio,
            (SELECT MAX(c2.created_at) FROM comanda_itens ci2
             JOIN comandas c2 ON c2.id = ci2.id_comanda
             WHERE ci2.id_item = i.id AND c2.status <> 'cancelada') AS ultima_saida
     FROM itens i
     LEFT JOIN comanda_itens ci ON ci.id_item = i.id
     LEFT JOIN comandas c ON c.id = ci.id_comanda AND c.status <> 'cancelada' ${filtroPeriodo('c', dias)}
     WHERE i.status = 'ativo'
     GROUP BY i.id
     ORDER BY vezes DESC, unidades DESC, i.nome`
  );
  return rows.map((r) => ({
    ...r,
    vezes: Number(r.vezes),
    unidades: Number(r.unidades),
    minutos_medio: r.minutos_medio === null ? null : Math.round(Number(r.minutos_medio)),
  }));
}

async function resumo(dias) {
  const [[row]] = await pool.query(
    `SELECT SUM(c.status <> 'cancelada') AS comandas,
            SUM(c.status = 'cancelada') AS canceladas,
            AVG(CASE WHEN c.status = 'concluida'
                     THEN TIMESTAMPDIFF(MINUTE, c.created_at, c.concluded_at) END) AS minutos_medio_conclusao,
            (SELECT COALESCE(SUM(ci.quantidade), 0) FROM comanda_itens ci
             JOIN comandas c3 ON c3.id = ci.id_comanda
             WHERE c3.status <> 'cancelada' ${filtroPeriodo('c3', dias)}) AS unidades
     FROM comandas c
     WHERE 1 = 1 ${filtroPeriodo('c', dias)}`
  );
  return {
    comandas: Number(row.comandas || 0),
    canceladas: Number(row.canceladas || 0),
    unidades: Number(row.unidades || 0),
    minutos_medio_conclusao:
      row.minutos_medio_conclusao === null ? null : Math.round(Number(row.minutos_medio_conclusao)),
  };
}

// Base da exportação CSV: todas as comandas do período, qualquer status
async function comandasPeriodo(dias) {
  const [rows] = await pool.query(
    `SELECT c.id, c.status, c.created_at, c.concluded_at,
            cl.nome AS cliente_nome, f.nome AS funcionario_nome,
            GROUP_CONCAT(CONCAT(ci.quantidade, 'x ', i.nome) ORDER BY i.nome SEPARATOR '; ') AS itens,
            SUM(ci.quantidade) AS unidades
     FROM comandas c
     JOIN clientes cl ON cl.id = c.id_cliente
     JOIN funcionarios f ON f.id = c.id_funcionario
     LEFT JOIN comanda_itens ci ON ci.id_comanda = c.id
     LEFT JOIN itens i ON i.id = ci.id_item
     WHERE 1 = 1 ${filtroPeriodo('c', dias)}
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  );
  return rows.map((r) => ({ ...r, unidades: Number(r.unidades || 0) }));
}

module.exports = { abertas, usoItens, resumo, comandasPeriodo };
