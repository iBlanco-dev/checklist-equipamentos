-- Rode este script no banco já existente para habilitar a redefinição de senha.
ALTER TABLE administradores
  ADD COLUMN reset_token_hash VARCHAR(255) NULL AFTER senha_hash,
  ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token_hash;
