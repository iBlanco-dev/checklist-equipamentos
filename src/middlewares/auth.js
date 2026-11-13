const jwt = require('jsonwebtoken');

// Sessão do funcionário: emitida ao digitar o PIN na seleção de perfil (ver funcionarioController.entrar).
// Vai num header próprio para não colidir com o token do Admin no mesmo navegador.
const FUNCIONARIO_HEADER = 'x-funcionario-token';
const FUNCIONARIO_TOKEN_TTL = '12h';

function lerAdmin(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return payload.role === 'admin' ? payload : null;
  } catch (err) {
    return null;
  }
}

function lerFuncionario(req) {
  const token = req.headers[FUNCIONARIO_HEADER];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.role === 'funcionario' ? { id: payload.sub, nome: payload.nome } : null;
  } catch (err) {
    return null;
  }
}

function assinarSessaoFuncionario(funcionario) {
  return jwt.sign({ sub: funcionario.id, role: 'funcionario', nome: funcionario.nome }, process.env.JWT_SECRET, {
    expiresIn: FUNCIONARIO_TOKEN_TTL,
  });
}

// `code` deixa o frontend distinguir sessão expirada de um PIN digitado errado (ambos 401)
function sessaoFuncionarioInvalida(res) {
  return res.status(401).json({ error: 'Sessão expirada. Selecione seu perfil e digite o PIN.', code: 'SESSAO_FUNCIONARIO' });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito ao administrador' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireFuncionario(req, res, next) {
  const funcionario = lerFuncionario(req);
  if (!funcionario) return sessaoFuncionarioInvalida(res);
  req.funcionario = funcionario;
  next();
}

// Rotas de leitura usadas tanto no painel Admin quanto em campo
function requireAdminOuFuncionario(req, res, next) {
  const admin = lerAdmin(req);
  const funcionario = lerFuncionario(req);
  if (!admin && !funcionario) {
    return req.headers[FUNCIONARIO_HEADER]
      ? sessaoFuncionarioInvalida(res)
      : res.status(401).json({ error: 'Faça login ou selecione seu perfil com o PIN' });
  }
  if (admin) req.admin = admin;
  if (funcionario) req.funcionario = funcionario;
  next();
}

module.exports = { requireAdmin, requireFuncionario, requireAdminOuFuncionario, assinarSessaoFuncionario };
