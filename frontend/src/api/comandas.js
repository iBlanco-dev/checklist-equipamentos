import client, { API_ORIGIN } from './client';

// itens: [{ id_item, quantidade }]
export function createComanda({ id_funcionario, pin, id_cliente, itens }) {
  return client.post('/comandas', { id_funcionario, pin, id_cliente, itens }).then((res) => res.data);
}

// Funcionário vem da sessão de campo (header X-Funcionario-Token)
export function listMinhasComandas() {
  return client.get('/comandas/minhas').then((res) => res.data);
}

// Todas as comandas abertas, com itens, responsável e cliente
export function listComandasAbertas() {
  return client.get('/comandas/abertas').then((res) => res.data);
}

export function getComanda(id) {
  return client.get(`/comandas/${id}`).then((res) => res.data);
}

export function listHistorico({ id_cliente, id_funcionario } = {}) {
  const params = {};
  if (id_cliente) params.id_cliente = id_cliente;
  if (id_funcionario) params.id_funcionario = id_funcionario;
  return client.get('/comandas/historico', { params }).then((res) => res.data);
}

export function concluirComanda(id, { id_funcionario, pin }) {
  return client.patch(`/comandas/${id}/concluir`, { id_funcionario, pin }).then((res) => res.data);
}

export function cancelarComanda(id) {
  return client.delete(`/comandas/${id}`);
}

export function pdfUrl(id) {
  return `${API_ORIGIN}/api/comandas/${id}/pdf`;
}
