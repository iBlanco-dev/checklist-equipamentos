import { useTheme } from '../context/ThemeContext';

// Logo do Grupo iBlanco. No tema escuro usa a variante com preto/branco invertidos (laranja mantido).
export default function BrandLogo({ height = 32, simbolo = false, style }) {
  const { theme } = useTheme();
  const src = simbolo
    ? '/brand/simbolo-ib.png'
    : theme === 'dark'
      ? '/brand/logo-iblanco-dark.png'
      : '/brand/logo-iblanco.png';

  return <img src={src} alt="Grupo iBlanco" height={height} style={{ display: 'block', height, width: 'auto', ...style }} />;
}
