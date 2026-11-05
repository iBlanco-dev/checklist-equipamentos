import client from './client';

// dias = 0 traz todo o período
export function getRelatorios(dias) {
  return client.get('/relatorios', { params: { dias } }).then((res) => res.data);
}
