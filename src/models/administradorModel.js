const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM administradores WHERE email = ?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, created_at FROM administradores WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function findCredentialsById(id) {
  const [rows] = await pool.query('SELECT * FROM administradores WHERE id = ?', [id]);
  return rows[0];
}

async function list() {
  const [rows] = await pool.query(
    'SELECT id, nome, email, created_at FROM administradores ORDER BY nome'
  );
  return rows;
}

async function create({ nome, email, senha }) {
  const senhaHash = await bcrypt.hash(senha, 10);
  const [result] = await pool.query(
    'INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return findById(result.insertId);
}

async function updateSenha(id, senha) {
  const senhaHash = await bcrypt.hash(senha, 10);
  await pool.query('UPDATE administradores SET senha_hash = ? WHERE id = ?', [senhaHash, id]);
}

async function setResetToken(id, tokenHash, expiresAt) {
  await pool.query(
    'UPDATE administradores SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?',
    [tokenHash, expiresAt, id]
  );
}

async function findByResetTokenHash(tokenHash) {
  const [rows] = await pool.query(
    'SELECT * FROM administradores WHERE reset_token_hash = ? AND reset_token_expires > NOW()',
    [tokenHash]
  );
  return rows[0];
}

async function clearResetToken(id) {
  await pool.query(
    'UPDATE administradores SET reset_token_hash = NULL, reset_token_expires = NULL WHERE id = ?',
    [id]
  );
}

module.exports = {
  findByEmail,
  findById,
  findCredentialsById,
  list,
  create,
  updateSenha,
  setResetToken,
  findByResetTokenHash,
  clearResetToken,
};
