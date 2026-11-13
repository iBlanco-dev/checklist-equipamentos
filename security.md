# Segurança e correções — planejamento futuro

Levantamento feito em 13/11/2026 a partir da leitura do código (sem testes de invasão). Os itens estão em ordem de prioridade dentro de cada seção. Marque `[x]` ao concluir.

## 1. Segurança

### 1.1 Upload permite XSS armazenado sem login — **alta**

- **Onde:** `src/middlewares/upload.js` (extensão vem de `file.originalname`), rota aberta `POST /api/itens` (`src/routes/itemRoutes.js`).
- **Problema:** o `mimetype` é declarado pelo próprio cliente, então dá para enviar um `.html` dizendo ser `image/png`. O arquivo é servido em `/uploads` no mesmo domínio do painel, e o token do admin fica em `localStorage`. Um link para esse arquivo aberto por um admin pode roubar a sessão.
- **Plano:**
  - [ ] Definir a extensão por uma lista fixa de tipos (`image/jpeg → .jpg`, `image/png → .png`, `image/webp → .webp`), recusando o resto (inclusive `image/svg+xml`).
  - [ ] Servir `/uploads` com `X-Content-Type-Options: nosniff` (e, de preferência, `Content-Disposition`/CSP restritiva).
  - [x] Exigir sessão de funcionário (PIN) ou admin para criar item — feito junto com o PIN na seleção de perfil.

### 1.2 Força bruta do PIN e do login — **alta**

- **Onde:** `POST /api/funcionarios/:id/pin/alterar`, `POST /api/comandas`, `PATCH /api/comandas/:id/concluir`, `POST /api/auth/login`, `POST /api/auth/forgot-password`.
- **Problema:** não há limite de tentativas. O PIN tem só 10 mil combinações, então dá para descobrir e trocar o PIN de qualquer funcionário em minutos.
- **Plano:**
  - [ ] Adicionar `express-rate-limit` nas rotas de autenticação (por IP).
  - [ ] Contar falhas de PIN por funcionário e bloquear temporariamente depois de N erros (ex.: 5 erros → 15 min).
  - [ ] Limitar envio de e-mails de redefinição de senha.

### 1.3 Comandas e PDF acessíveis por qualquer pessoa — **alta**

- **Onde:** `src/controllers/comandaController.js` (`getOne`, `gerarPdf`), `src/routes/comandaRoutes.js`.
- **Problema:** `getOne` considera "dono" quem mandar `?id_funcionario=` na URL, valor que qualquer um pode inventar. `GET /comandas/:id/pdf` não tem nenhuma checagem. Como os IDs são sequenciais, todas as comandas ficam expostas.
- **Plano:**
  - [x] Sessão de funcionário: JWT de 12h emitido em `POST /funcionarios/:id/entrar` após o PIN, enviado no header `X-Funcionario-Token`. `GET /comandas/:id`, `/comandas/minhas`, `/comandas/abertas`, `/itens` e `/clientes` agora exigem essa sessão ou o admin.
  - [ ] PDF (`GET /comandas/:id/pdf`) continua aberto: é aberto por link (`<a href>`), que não envia header. Baixar via `fetch`/blob com o token ou usar um token curto na URL.

### 1.4 Vazamento de mensagens internas — **média**

- **Onde:** `src/middlewares/errorHandler.js`.
- **Problema:** erros 500 devolvem `err.message`, que pode conter mensagens do MySQL (ex.: violação de chave estrangeira).
- **Plano:**
  - [ ] Para status ≥ 500, responder mensagem genérica e só logar o erro real no servidor.

### 1.5 Endurecimento geral — **média/baixa**

- [ ] Restringir `cors()` à origem do frontend (`FRONTEND_URL`) em produção.
- [ ] Adicionar `helmet` com uma CSP compatível com o frontend.
- [ ] Avaliar trocar o JWT em `localStorage` por cookie `HttpOnly` + `SameSite`.
- [ ] Validar que `JWT_SECRET` está definido e não é o valor de exemplo ao iniciar o servidor.

## 2. Bugs e regras de negócio

- [ ] **Cancelar comanda concluída:** `comandaModel.cancelar` não verifica status, então uma comanda concluída pode virar "cancelada" e alterar histórico e relatórios. Restringir a `status = 'aberta'` e devolver 404/409 quando não afetar nenhuma linha.
- [ ] **Cliente da comanda não validado:** `create` aceita cliente inativo; cliente inexistente gera 500. Validar que o cliente existe e está ativo (400/409).
- [ ] **Funcionário excluído com comandas abertas:** os itens ficam reservados indefinidamente. Bloquear a exclusão ou avisar o admin e oferecer cancelar ou transferir as comandas.
- [ ] **Imagem do item via texto livre:** `itemController.update` aceita `req.body.image` como qualquer caminho. Aceitar só arquivo enviado ou manter o atual.
- [ ] **Redução de quantidade sem trava:** `itemController.update` compara com `em_uso` sem `FOR UPDATE`; uma comanda criada ao mesmo tempo pode deixar o estoque abaixo do reservado. Fazer a checagem e o update numa transação com trava na linha do item.

## 3. Qualidade e manutenção

- [ ] Criar `README.md` com o passo a passo: `schema.sql` → migrations (só para bancos antigos; a `001` falha num banco novo) → `npm run seed:admin` → build do frontend → variáveis de ambiente.
- [ ] Adicionar testes automatizados, começando por RN01 (disponibilidade), concluir/cancelar comanda e autenticação por PIN.
- [ ] Configurar ESLint/Prettier no backend e no frontend.
- [ ] `verificarDisponibilidade` faz uma consulta por item (`findById` no loop); calcular o `em_uso` de todos os itens numa consulta só.
