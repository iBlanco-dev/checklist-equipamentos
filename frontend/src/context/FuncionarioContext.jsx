import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FUNCIONARIO_STORAGE_KEY as STORAGE_KEY, SESSAO_FUNCIONARIO_EXPIRADA } from '../api/client';

const FuncionarioContext = createContext(null);

function sessaoValida(f) {
  if (!f?.token) return false; // perfis salvos antes do PIN na entrada não têm token
  try {
    const { exp } = JSON.parse(atob(f.token.split('.')[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function lerSessao() {
  try {
    const f = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (sessaoValida(f)) return f;
  } catch {
    // valor corrompido: trata como sem sessão
  }
  localStorage.removeItem(STORAGE_KEY);
  return null;
}

// funcionario: { id, nome, token } — o token vem de POST /funcionarios/:id/entrar com o PIN
export function FuncionarioProvider({ children }) {
  const [funcionario, setFuncionarioState] = useState(lerSessao);

  const setFuncionario = (f) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
    setFuncionarioState(f);
  };

  const limparFuncionario = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFuncionarioState(null);
  };

  useEffect(() => {
    window.addEventListener(SESSAO_FUNCIONARIO_EXPIRADA, limparFuncionario);
    return () => window.removeEventListener(SESSAO_FUNCIONARIO_EXPIRADA, limparFuncionario);
  }, []);

  const value = useMemo(
    () => ({ funcionario, setFuncionario, limparFuncionario }),
    [funcionario]
  );

  return <FuncionarioContext.Provider value={value}>{children}</FuncionarioContext.Provider>;
}

export function useFuncionario() {
  return useContext(FuncionarioContext);
}
