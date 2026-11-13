import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ORIGIN = /^https?:\/\//.test(API_URL)
  ? new URL(API_URL).origin
  : window.location.origin;

const client = axios.create({ baseURL: API_URL });

export const FUNCIONARIO_STORAGE_KEY = 'funcionario_atual';
export const SESSAO_FUNCIONARIO_EXPIRADA = 'sessao-funcionario-expirada';

function tokenFuncionario() {
  try {
    return JSON.parse(localStorage.getItem(FUNCIONARIO_STORAGE_KEY))?.token || null;
  } catch {
    return null;
  }
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const funcionarioToken = tokenFuncionario();
  if (funcionarioToken) {
    config.headers['X-Funcionario-Token'] = funcionarioToken;
  }
  return config;
});

// Sessão de campo vencida: o FuncionarioContext escuta e volta pra seleção de perfil
client.interceptors.response.use(undefined, (err) => {
  if (err?.response?.data?.code === 'SESSAO_FUNCIONARIO') {
    window.dispatchEvent(new Event(SESSAO_FUNCIONARIO_EXPIRADA));
  }
  return Promise.reject(err);
});

export function extractErrorMessage(err) {
  return err?.response?.data?.error || 'Não foi possível completar a ação. Tente novamente.';
}

export function imageUrl(path) {
  if (!path) return null;
  return `${API_ORIGIN}${path}`;
}

export default client;
