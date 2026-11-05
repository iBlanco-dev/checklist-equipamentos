const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const controller = require('../controllers/relatorioController');

const router = express.Router();

router.get('/', requireAdmin, controller.geral);

module.exports = router;
