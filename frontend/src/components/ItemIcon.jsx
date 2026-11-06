// Ícones próprios dos equipamentos, desenhados no grid 24x24 com traço no estilo do lucide.
// O ícone é escolhido pelo nome do item, então itens novos já ganham ícone sem cadastro extra.

const dot = (cx, cy, r = 0.9) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;

const ICONES = {
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.8" />
      <circle cx="12" cy="13" r="1.6" />
      <path d="M5.5 9.5H7" />
    </>
  ),
  lente: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M8.6 9.4A4 4 0 0 1 11.2 8" />
    </>
  ),
  tripe: (
    <>
      <rect x="8.5" y="3" width="7" height="3" rx="1" />
      <path d="M12 6v5M12 11 5 21M12 11l7 10M12 11v10M8.6 16h6.8" />
    </>
  ),
  gimbal: (
    <>
      <rect x="6" y="3" width="13" height="4.5" rx="1" />
      <path d="M12 13v-2.5h6V7.5" />
      <rect x="10" y="13" width="4" height="8.5" rx="2" />
      {dot(12, 16)}
    </>
  ),
  drone: (
    <>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" />
      <path d="M9.5 9.5 6.5 6.5M14.5 9.5l3-3M9.5 14.5l-3 3M14.5 14.5l3 3" />
      <ellipse cx="6" cy="6" rx="3.4" ry="1.2" />
      <ellipse cx="18" cy="6" rx="3.4" ry="1.2" />
      <ellipse cx="6" cy="18" rx="3.4" ry="1.2" />
      <ellipse cx="18" cy="18" rx="3.4" ry="1.2" />
    </>
  ),
  filtro: (
    <>
      <circle cx="9" cy="12" r="5.8" />
      <circle cx="15" cy="12" r="5.8" />
      <path d="M6.2 10.2a3 3 0 0 1 1.6-1.7" />
    </>
  ),
  bateria: (
    <>
      <rect x="2.5" y="7" width="16.5" height="10" rx="1.8" />
      <path d="M19 10h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H19" />
      <path d="M11.8 9.2 9.4 12.4h3.2l-2.4 3.2" />
    </>
  ),
  carregador: (
    <>
      <path d="M3 13h18v5.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />
      <rect x="6" y="5" width="12" height="8" rx="1" />
      <path d="M12.8 6.8 11 9.2h2l-1.8 2.4" />
      {dot(7, 16.5, 0.7)}
      {dot(9.5, 16.5, 0.7)}
    </>
  ),
  tomada: (
    <>
      <path d="M8 6.5V3M12 6.5V3" />
      <rect x="5.5" y="6.5" width="9" height="8.5" rx="2" />
      <path d="M10 15v2a3 3 0 0 0 3 3h3.5a2 2 0 0 0 2-2v-5" />
      <rect x="17" y="9" width="3" height="4" rx=".6" />
    </>
  ),
  powerbank: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 5.5h3" />
      <path d="M12.9 9.5 10.6 12.7h3l-2.3 3.3" />
    </>
  ),
  lapela: (
    <>
      <rect x="9.5" y="2.5" width="5" height="8.5" rx="2.5" />
      <path d="M11 5.5h2M11 7.8h2" />
      <path d="M9.5 5H7v5h2.5" />
      <path d="M12 11v2.5c0 2 1.5 3 3.5 3S19 17.5 19 19.5V21" />
    </>
  ),
  microfone: (
    <>
      <path d="M9 5.4a4.5 4.5 0 0 1 6 0M6.8 3a8 8 0 0 1 10.4 0" />
      <rect x="7" y="8.5" width="10" height="13" rx="2.5" />
      <circle cx="12" cy="13" r="2.2" />
      <path d="M10 18h4" />
    </>
  ),
  bastao: (
    <>
      <rect x="9.5" y="2.5" width="5" height="19" rx="2.5" />
      <path d="M12 6v8M9.5 17h5" />
      <path d="M5.8 7 3.8 6M5.8 12H3.3M5.8 17l-2 1M18.2 7l2-1M18.2 12h2.5M18.2 17l2 1" />
    </>
  ),
  painel: (
    <>
      <rect x="3" y="3" width="18" height="13" rx="1.5" />
      {dot(7.5, 7.2)}
      {dot(12, 7.2)}
      {dot(16.5, 7.2)}
      {dot(7.5, 11.8)}
      {dot(12, 11.8)}
      {dot(16.5, 11.8)}
      <path d="M12 16v5M8.5 21h7" />
    </>
  ),
  fonte: (
    <>
      <rect x="3" y="8" width="9.5" height="8" rx="1.5" />
      <path d="M12.5 9.5 18 6v12l-5.5-3.5" />
      <path d="M21 9.5v5M6 10.5v3M8.5 10.5v3" />
      <path d="M7.8 16v5M5.3 21h5" />
    </>
  ),
  softbox: (
    <>
      <rect x="3" y="3" width="18" height="14" rx="1" />
      <rect x="6.5" y="6.2" width="11" height="7.6" rx=".5" />
      <path d="M3 3l3.5 3.2M21 3l-3.5 3.2M3 17l3.5-3.2M21 17l-3.5-3.2" />
      <path d="M12 17v4M8.5 21h7" />
    </>
  ),
  rebatedor: (
    <>
      <circle cx="13.5" cy="12" r="8" />
      <path d="M13.5 4a8 8 0 0 1 0 16z" fill="currentColor" fillOpacity=".22" />
      <path d="M2 8.4l1.9.8M1.6 12h2.2M2 15.6l1.9-.8" />
    </>
  ),
  cage: (
    <>
      <path d="M8 6V3.5h8V6" />
      <rect x="2.5" y="6" width="19" height="14" rx="1.5" />
      <rect x="6" y="9" width="12" height="8" rx="1" />
      <circle cx="12" cy="13" r="2.4" />
      {dot(4.3, 10, 0.6)}
      {dot(4.3, 16, 0.6)}
      {dot(19.7, 10, 0.6)}
      {dot(19.7, 16, 0.6)}
    </>
  ),
  teleprompter: (
    <>
      <rect x="3" y="3" width="18" height="13" rx="1.5" />
      {dot(12, 5.4, 0.7)}
      <path d="M7 8.3h10M7 10.8h10M7 13.3h6" />
      <path d="M12 16v5M8.5 21h7" />
    </>
  ),
  tablet: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2.2" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  celular: (
    <>
      <rect x="6.5" y="2" width="11" height="20" rx="2.5" />
      <path d="M10.5 4.8h3" />
      <path d="M10.8 19h2.4" />
    </>
  ),
  claquete: (
    <>
      <path d="M3 10h18v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z" />
      <path d="M3.2 9.8 2.6 6.9 18.6 3.4l.6 2.9z" />
      <path d="M6.6 5.9l2.6 2.5M11.4 4.9 14 7.4" />
      <path d="M3 13.5h18M6.5 10l3.5 3.5M11.5 10l3.5 3.5M16.5 10l3.5 3.5" />
    </>
  ),
  fita: (
    <>
      <circle cx="11" cy="11" r="8" />
      <circle cx="11" cy="11" r="3.5" />
      <path d="M19 11v10l-1.5-1-1.5 1v-3.8" />
    </>
  ),
  regua: (
    <>
      <rect x="2" y="8" width="17" height="8" rx="2" />
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="10.5" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <path d="M19 12h1.5a1.5 1.5 0 0 1 1.5 1.5V20" />
    </>
  ),
  extensao: (
    <>
      <path d="M4.3 9V6M6.7 9V6" />
      <rect x="3" y="9" width="5" height="5" rx="1" />
      <path d="M5.5 14v2.5a3.5 3.5 0 0 0 7 0v-9a3.5 3.5 0 0 1 7 0V10" />
      <rect x="16" y="10" width="7" height="6" rx="1" />
      <path d="M18.3 12.3v1.4M20.7 12.3v1.4" />
    </>
  ),
  cartao: (
    <>
      <path d="M5 4a1.5 1.5 0 0 1 1.5-1.5H15l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20z" />
      <path d="M8.5 5v3M11 5v3M13.5 5v3M8.5 16h7" />
    </>
  ),
  mala: (
    <>
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M2.5 11.5h19M6.5 10v3M17.5 10v3" />
    </>
  ),
  mochila: (
    <>
      <path d="M10 3.2V2.5h4v.7" />
      <path d="M6 9a6 6 0 0 1 12 0v10.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" />
      <path d="M8.5 14v-1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1M8.5 14h7v4.5h-7z" />
    </>
  ),
  generico: (
    <>
      <path d="M12 2.5 3 7v10l9 4.5 9-4.5V7z" />
      <path d="M3 7l9 4.5L21 7M12 11.5v10M7.5 4.8l9 4.5" />
    </>
  ),
};

// A ordem importa: o primeiro que casar vence ("Carregador Bateria" é carregador, não bateria)
const REGRAS = [
  ['powerbank', /carregador portatil|power ?bank/],
  ['tomada', /carregador.*(iphone|celular|usb|tipo c)/],
  ['carregador', /carregador/],
  ['bateria', /bateria/],
  ['regua', /regua|filtro de linha/],
  ['filtro', /filtro/],
  ['lente', /lente|objetiva/],
  ['lapela', /lapela/],
  ['microfone', /hollyland|lark|microfone|\bmic\b|\brode\b/],
  ['drone', /drone|mavic/],
  ['cage', /\bcage\b/],
  ['gimbal', /gimbal|osmo|estabilizador/],
  ['teleprompter', /prompter/],
  ['tripe', /tripe|monope/],
  ['softbox', /softbox/],
  ['bastao', /bastao|tubo de led/],
  ['painel', /painel/],
  ['rebatedor', /rebatedor/],
  ['fonte', /fonte|refletor|\bcob\b|\bled\b|\bluz\b/],
  ['claquete', /claquete/],
  ['fita', /fita/],
  ['extensao', /extensao|\bcabo\b/],
  ['cartao', /cartao|\bsd\b|memoria/],
  ['mala', /\bmala\b|\bcase\b/],
  ['mochila', /mochila|bolsa/],
  ['tablet', /tablet|ipad/],
  ['celular', /iphone|celular|smartphone/],
  ['camera', /camera|canon|sony|nikon|gopro/],
];

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tipoDoItem(nome = '') {
  const n = normalizar(nome);
  const regra = REGRAS.find(([, re]) => re.test(n));
  return regra ? regra[0] : 'generico';
}

export default function ItemIcon({ nome, size = 28, strokeWidth = 1.6, style, ...props }) {
  return (
    <svg
      style={{ color: 'var(--accent)', ...style }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {ICONES[tipoDoItem(nome)]}
    </svg>
  );
}
