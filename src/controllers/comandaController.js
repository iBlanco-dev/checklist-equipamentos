const comandaModel = require('../models/comandaModel');
const { gerarPdfComanda } = require('../utils/pdfGenerator');

// Junta pedidos do mesmo item e valida quantidades. Aceita o formato antigo id_itens (1 unidade cada).
function normalizarItens({ itens, id_itens }) {
  const lista = Array.isArray(itens)
    ? itens
    : Array.isArray(id_itens)
      ? id_itens.map((id_item) => ({ id_item, quantidade: 1 }))
      : [];

  const porItem = new Map();
  for (const { id_item, quantidade } of lista) {
    const id = Number(id_item);
    const qtd = Number(quantidade);
    if (!Number.isInteger(id) || !Number.isInteger(qtd) || qtd < 1) return null;
    porItem.set(id, (porItem.get(id) || 0) + qtd);
  }
  return [...porItem].map(([id_item, quantidade]) => ({ id_item, quantidade }));
}

async function create(req, res, next) {
  try {
    const { id_cliente } = req.body;
    const itens = normalizarItens(req.body);
    if (!id_cliente || !itens || itens.length === 0) {
      return res
        .status(400)
        .json({ error: 'id_cliente e itens (lista de { id_item, quantidade }) são obrigatórios' });
    }

    const comanda = await comandaModel.create({
      id_funcionario: req.funcionario.id,
      id_cliente,
      itens,
    });
    res.status(201).json(comanda);
  } catch (err) {
    next(err);
  }
}

// Comandas abertas do funcionário da sessão (PIN digitado ao selecionar o perfil)
async function listMinhas(req, res, next) {
  try {
    res.json(await comandaModel.listAbertasPorFuncionario(req.funcionario.id));
  } catch (err) {
    next(err);
  }
}

// Resumo para toda a equipe: o que está fora agora, com quem e em qual cliente
async function listAbertas(req, res, next) {
  try {
    res.json(await comandaModel.listAbertas());
  } catch (err) {
    next(err);
  }
}

// Admin vê qualquer comanda; funcionário só a própria
async function getOne(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }

    const isAdmin = Boolean(req.admin);
    const isDono = req.funcionario && req.funcionario.id === comanda.id_funcionario;

    if (!isAdmin && !isDono) {
      return res.status(403).json({ error: 'Sem permissão para ver esta comanda' });
    }

    res.json(comanda);
  } catch (err) {
    next(err);
  }
}

async function listHistorico(req, res, next) {
  try {
    const { id_cliente, id_funcionario } = req.query;
    res.json(await comandaModel.listHistorico({ id_cliente, id_funcionario }));
  } catch (err) {
    next(err);
  }
}

// Concluir exige PIN válido (middleware) e só o funcionário dono da comanda pode concluir
async function concluir(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }
    if (comanda.id_funcionario !== req.funcionario.id) {
      return res.status(403).json({ error: 'Você só pode concluir suas próprias comandas' });
    }
    if (comanda.status !== 'aberta') {
      return res.status(409).json({ error: 'Comanda não está aberta' });
    }
    res.json(await comandaModel.concluir(req.params.id));
  } catch (err) {
    next(err);
  }
}

// Soft delete: apenas Admin (RN03)
async function cancelar(req, res, next) {
  try {
    await comandaModel.cancelar(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function gerarPdf(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=comanda-${comanda.id}.pdf`);
    gerarPdfComanda(comanda, res);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getOne, listMinhas, listAbertas, listHistorico, concluir, cancelar, gerarPdf };
