const relatorioModel = require('../models/relatorioModel');

const PERIODOS = [0, 7, 30, 90, 365];

// ?dias=30 (0 = todo o período). Tudo numa resposta só: a página de relatórios monta os 3 blocos a partir dela.
async function geral(req, res, next) {
  try {
    const dias = req.query.dias === undefined ? 30 : Number(req.query.dias);
    if (!PERIODOS.includes(dias)) {
      return res.status(400).json({ error: `dias deve ser um destes: ${PERIODOS.join(', ')}` });
    }

    const [abertas, usoItens, resumo, comandas] = await Promise.all([
      relatorioModel.abertas(),
      relatorioModel.usoItens(dias),
      relatorioModel.resumo(dias),
      relatorioModel.comandasPeriodo(dias),
    ]);

    res.json({ dias, resumo, abertas, uso_itens: usoItens, comandas });
  } catch (err) {
    next(err);
  }
}

module.exports = { geral };
