const path = require('path');
const PDFDocument = require('pdfkit');

// Identidade visual Grupo iBlanco
const LOGO = path.join(__dirname, '..', '..', 'assets', 'logo-iblanco.png');
const LARANJA = '#ec6707';
const PRETO = '#000000';
const CINZA = '#5c5c5c';

// RF08: checklist imprimível com campo de assinatura (assinada fisicamente à mão)
function gerarPdfComanda(comanda, stream) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  // Cabeçalho: logo à esquerda, título à direita, faixa laranja embaixo
  doc.image(LOGO, left, 45, { height: 44 });
  doc
    .fillColor(PRETO)
    .font('Helvetica-Bold')
    .fontSize(16)
    .text('Checklist', left, 52, { width: right - left, align: 'right' });
  doc
    .fillColor(CINZA)
    .font('Helvetica')
    .fontSize(10)
    .text('Controle de equipamentos', left, 72, { width: right - left, align: 'right' });
  doc.rect(left, 102, right - left, 3).fill(LARANJA);

  doc.x = left;
  doc.y = 122;
  doc.fillColor(PRETO).font('Helvetica-Bold').fontSize(13).text(`Comanda #${comanda.id}`);
  doc.moveDown(0.4);
  doc.font('Helvetica').fontSize(11);
  doc.text(`Cliente: ${comanda.cliente_nome}`);
  doc.text(`Responsável: ${comanda.funcionario_nome}`);
  doc.text(`Data: ${new Date(comanda.created_at).toLocaleDateString('pt-BR')}`);
  doc.moveDown();

  doc.fillColor(LARANJA).font('Helvetica-Bold').fontSize(12).text('ITENS');
  doc.moveDown(0.5);
  doc.fillColor(PRETO).font('Helvetica').fontSize(11);
  comanda.itens.forEach((item, i) => {
    const y = doc.y;
    doc.rect(left, y + 1, 9, 9).lineWidth(0.8).stroke(PRETO);
    doc.text(`${i + 1}. ${item.nome}`, left + 16, y);
    doc.moveDown(0.3);
  });

  doc.moveDown(4);
  const ySig = doc.y;
  doc.moveTo(left, ySig).lineTo(left + 280, ySig).lineWidth(0.8).stroke(PRETO);
  doc.fillColor(CINZA).fontSize(10).text('Assinatura', left, ySig + 6);

  doc.end();
}

module.exports = { gerarPdfComanda };
