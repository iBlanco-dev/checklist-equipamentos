const express = require('express');
const { requireAdmin, requireFuncionario, requireAdminOuFuncionario } = require('../middlewares/auth');
const { requireFuncionarioPin } = require('../middlewares/verifyPin');
const controller = require('../controllers/comandaController');

const router = express.Router();

router.get('/minhas', requireFuncionario, controller.listMinhas);
router.get('/abertas', requireAdminOuFuncionario, controller.listAbertas);
router.get('/historico', requireAdmin, controller.listHistorico);
router.get('/:id/pdf', controller.gerarPdf);
router.get('/:id', requireAdminOuFuncionario, controller.getOne);
router.post('/', requireFuncionario, requireFuncionarioPin, controller.create);
router.patch('/:id/concluir', requireFuncionario, requireFuncionarioPin, controller.concluir);
router.delete('/:id', requireAdmin, controller.cancelar);

module.exports = router;
