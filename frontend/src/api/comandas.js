import client, { API_ORIGIN } from './client';

// itens: [{ id_item, quantidade }]
export function createComanda({ id_funcionario, pin, id_cliente, itens }) {
  return client.post('/comandas', { id_funcionario, pin, id_cliente, itens }).then((res) => res.data);
}

export function listMinhasComandas(idFuncionario) {
  return client
    .get('/comandas/minhas', { params: { id_funcionario: idFuncionario } })
    .then((res) => res.data);
}

export function getComanda(id, idFuncionario) {
  return client
    .get(`/comandas/${id}`, { params: idFuncionario ? { id_funcionario: idFuncionario } : {} })
    .then((res) => res.data);
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
