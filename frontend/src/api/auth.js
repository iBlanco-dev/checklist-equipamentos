import client from './client';

export function login(email, senha) {
  return client.post('/auth/login', { email, senha }).then((res) => res.data);
}

export function forgotPassword(email) {
  return client.post('/auth/forgot-password', { email }).then((res) => res.data);
}

export function resetPassword(token, senha) {
  return client.post('/auth/reset-password', { token, senha }).then((res) => res.data);
}

export function changePassword(senhaAtual, novaSenha) {
  return client.post('/auth/change-password', { senhaAtual, novaSenha }).then((res) => res.data);
}
