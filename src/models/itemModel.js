const pool = require('../config/db');

// Unidades reservadas por comandas abertas agora (base pra RN01)
const EM_USO_SQL = `COALESCE((
  SELECT SUM(ci.quantidade) FROM comanda_itens ci
  JOIN comandas c ON c.id = ci.id_comanda
  WHERE ci.id_item = i.id AND c.status = 'aberta'
), 0)`;

function comDisponibilidade(row) {
  const emUso = Number(row.em_uso);
  return { ...row, em_uso: emUso, disponivel: Math.max(row.quantidade - emUso, 0) };
}

async function listAtivos({ apenasDisponiveis = false } = {}) {
  const [rows] = await pool.query(
    `SELECT i.id, i.nome, i.image, i.quantidade, i.status, i.created_at,
            ${EM_USO_SQL} AS em_uso
     FROM itens i
     WHERE i.status = 'ativo'
     ${apenasDisponiveis ? 'HAVING em_uso < quantidade' : ''}
     ORDER BY i.nome`
  );
  return rows.map(comDisponibilidade);
}

async function findById(id, connection = pool) {
  const [rows] = await connection.query(
    `SELECT i.id, i.nome, i.image, i.quantidade, i.status, i.created_at,
            ${EM_USO_SQL} AS em_uso
     FROM itens i WHERE i.id = ?`,
    [id]
  );
  return rows[0] && comDisponibilidade(rows[0]);
}

async function create({ nome, image, quantidade }) {
  const [result] = await pool.query('INSERT INTO itens (nome, image, quantidade) VALUES (?, ?, ?)', [
    nome,
    image || null,
    quantidade,
  ]);
  return findById(result.insertId);
}

async function update(id, { nome, image, quantidade }) {
  await pool.query('UPDATE itens SET nome = ?, image = ?, quantidade = ? WHERE id = ?', [
    nome,
    image,
    quantidade,
    id,
  ]);
  return findById(id);
}

async function softDelete(id) {
  await pool.query('UPDATE itens SET status = "inativo" WHERE id = ?', [id]);
}

// RN01: a soma reservada por comandas abertas não pode passar da quantidade do item.
// Trava as linhas dos itens (FOR UPDATE) pra duas comandas simultâneas não reservarem a mesma unidade.
async function verificarDisponibilidade(pedidos, connection) {
  const ids = pedidos.map((p) => p.id_item);
  const [rows] = await connection.query(
    `SELECT i.id, i.nome, i.quantidade, i.status FROM itens i WHERE i.id IN (?) FOR UPDATE`,
    [ids]
  );

  for (const pedido of pedidos) {
    const item = rows.find((r) => r.id === pedido.id_item);
    if (!item || item.status !== 'ativo') {
      const err = new Error(`Item ${pedido.id_item} não existe ou foi excluído`);
      err.status = 409;
      throw err;
    }

    const { em_uso: emUso } = await findById(item.id, connection);
    const disponivel = item.quantidade - emUso;
    if (pedido.quantidade > disponivel) {
      const err = new Error(
        disponivel > 0
          ? `${item.nome}: só ${disponivel} de ${item.quantidade} disponível(is) agora`
          : `${item.nome} já está todo em uso em outras comandas`
      );
      err.status = 409;
      throw err;
    }
  }
}

module.exports = { listAtivos, findById, create, update, softDelete, verificarDisponibilidade };
