const itemModel = require('../models/itemModel');

// ?disponivel=true retorna só itens que não estão numa comanda aberta agora
async function list(req, res, next) {
  try {
    const apenasDisponiveis = req.query.disponivel === 'true';
    res.json(await itemModel.listAtivos({ apenasDisponiveis }));
  } catch (err) {
    next(err);
  }
}

// Vem de multipart (string); sem valor = 1 unidade
function lerQuantidade(valor, padrao = 1) {
  if (valor === undefined || valor === '') return padrao;
  const qtd = Number(valor);
  return Number.isInteger(qtd) && qtd >= 1 ? qtd : null;
}

// Create é aberto a todos (RF05)
async function create(req, res, next) {
  try {
    const nome = req.body.nome?.trim();
    const quantidade = lerQuantidade(req.body.quantidade);
    if (!nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    if (quantidade === null) {
      return res.status(400).json({ error: 'quantidade deve ser um número inteiro a partir de 1' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    res.status(201).json(await itemModel.create({ nome, image, quantidade }));
  } catch (err) {
    next(err);
  }
}

// Update restrito ao Admin (RF05): funcionário só cria itens novos, não edita existentes
async function update(req, res, next) {
  try {
    const atual = await itemModel.findById(req.params.id);
    if (!atual) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    const nome = req.body.nome?.trim();
    const quantidade = lerQuantidade(req.body.quantidade, atual.quantidade);
    if (!nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    if (quantidade === null) {
      return res.status(400).json({ error: 'quantidade deve ser um número inteiro a partir de 1' });
    }
    if (quantidade < atual.em_uso) {
      return res
        .status(409)
        .json({ error: `${atual.em_uso} unidade(s) estão em comandas abertas; a quantidade não pode ficar abaixo disso` });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || atual.image;
    res.json(await itemModel.update(req.params.id, { nome, image, quantidade }));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await itemModel.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
