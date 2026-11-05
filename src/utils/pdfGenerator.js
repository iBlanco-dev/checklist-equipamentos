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

  const unidades = comanda.itens.reduce((total, item) => total + (item.quantidade || 1), 0);
  doc.fillColor(LARANJA).font('Helvetica-Bold').fontSize(12).text(`ITENS (${unidades})`);
  doc.moveDown(0.5);
  doc.fillColor(PRETO).font('Helvetica').fontSize(11);
  const bottom = () => doc.page.height - doc.page.margins.bottom;
  comanda.itens.forEach((item, i) => {
    // Quebra antes de desenhar, senão a caixinha fica numa página e o texto na outra
    if (doc.y + 20 > bottom()) doc.addPage();
    const y = doc.y;
    const qtd = item.quantidade > 1 ? `${item.quantidade}x ` : '';
    doc.rect(left, y + 1, 9, 9).lineWidth(0.8).stroke(PRETO);
    doc.fillColor(PRETO).text(`${i + 1}. ${qtd}${item.nome}`, left + 16, y);
    doc.moveDown(0.3);
  });

  doc.moveDown(4);
  if (doc.y + 30 > bottom()) doc.addPage();
  const ySig = doc.y;
  doc.moveTo(left, ySig).lineTo(left + 280, ySig).lineWidth(0.8).stroke(PRETO);
  doc.fillColor(CINZA).fontSize(10).text('Assinatura', left, ySig + 6);

  doc.end();
}

module.exports = { gerarPdfComanda };
