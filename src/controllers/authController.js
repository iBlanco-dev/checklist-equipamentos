const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const administradorModel = require('../models/administradorModel');
const { sendPasswordResetEmail } = require('../utils/mailer');

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    const admin = await administradorModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valido = await bcrypt.compare(senha, admin.senha_hash);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ sub: admin.id, role: 'admin', nome: admin.nome }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { senhaAtual, novaSenha } = req.body;
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'senhaAtual e novaSenha são obrigatórios' });
    }
    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'a nova senha deve ter ao menos 6 caracteres' });
    }

    const admin = await administradorModel.findCredentialsById(req.admin.sub);
    const valido = admin && (await bcrypt.compare(senhaAtual, admin.senha_hash));
    if (!valido) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    await administradorModel.updateSenha(req.admin.sub, novaSenha);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email é obrigatório' });
    }

    const admin = await administradorModel.findByEmail(email);
    if (admin) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await administradorModel.setResetToken(admin.id, hashToken(token), expiresAt);

      const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
      const link = `${baseUrl.replace(/\/$/, '')}/redefinir-senha?token=${token}`;
      await sendPasswordResetEmail(admin.email, link);
    }

    res.json({ message: 'Se o email existir, enviaremos instruções de redefinição de senha.' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, senha } = req.body;
    if (!token || !senha) {
      return res.status(400).json({ error: 'token e senha são obrigatórios' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ error: 'senha deve ter ao menos 6 caracteres' });
    }

    const admin = await administradorModel.findByResetTokenHash(hashToken(token));
    if (!admin) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    await administradorModel.updateSenha(admin.id, senha);
    await administradorModel.clearResetToken(admin.id);

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, changePassword, forgotPassword, resetPassword };
