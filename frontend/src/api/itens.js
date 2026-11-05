import client from './client';

export function listItens({ apenasDisponiveis = false } = {}) {
  return client
    .get('/itens', { params: apenasDisponiveis ? { disponivel: 'true' } : {} })
    .then((res) => res.data);
}

export function createItem({ nome, quantidade, imageFile }) {
  const form = new FormData();
  form.append('nome', nome);
  if (quantidade) form.append('quantidade', quantidade);
  if (imageFile) form.append('image', imageFile);
  return client.post('/itens', form).then((res) => res.data);
}

export function updateItem(id, { nome, quantidade, imageFile }) {
  const form = new FormData();
  form.append('nome', nome);
  if (quantidade) form.append('quantidade', quantidade);
  if (imageFile) form.append('image', imageFile);
  return client.patch(`/itens/${id}`, form).then((res) => res.data);
}

export function deleteItem(id) {
  return client.delete(`/itens/${id}`);
}
