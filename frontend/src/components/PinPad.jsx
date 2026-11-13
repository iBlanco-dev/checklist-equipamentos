import { useEffect, useRef, useState } from 'react';
import './PinPad.css';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

// Dígito da tecla, inclusive do teclado numérico com NumLock desligado (e.key vira "End", "ArrowDown"...)
function digitoDaTecla(e) {
  if (/^[0-9]$/.test(e.key)) return e.key;
  const match = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
  return match ? match[1] : null;
}

export default function PinPad({ nomeFuncionario, onConfirm, onCancel, loading, error, label = 'Confirmar como' }) {
  const [pin, setPin] = useState('');
  const [tremendo, setTremendo] = useState(false);

  // PIN recusado: limpa pra digitar de novo direto, sem precisar apagar ou cancelar
  useEffect(() => {
    if (!error) return;
    setPin('');
    setTremendo(true);
    const t = setTimeout(() => setTremendo(false), 400);
    return () => clearTimeout(t);
  }, [error]);

  const press = (key) => {
    if (loading) return;
    if (key === 'back') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === '') return;
    setPin((p) => (p.length < 4 ? p + key : p));
  };

  const confirmar = () => {
    if (pin.length === 4) onConfirm(pin);
  };

  // No desktop o PIN também pode ser digitado pelo teclado (inclusive o numérico).
  // Ref com os handlers atuais: o listener é registrado uma vez só, na fase de captura,
  // pra o foco em algum botão da página não engolir as teclas.
  const handlers = useRef();
  handlers.current = { press, confirmar, onCancel, loading };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const { press, confirmar, onCancel, loading } = handlers.current;
      const digito = digitoDaTecla(e);
      if (digito) {
        e.preventDefault();
        press(digito);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        press('back');
      } else if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        if (!loading) confirmar();
      } else if (e.key === 'Escape') {
        if (!loading) onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  return (
    <div className="pinpad stack">
      <p className="eyebrow">
        {label} {nomeFuncionario}
      </p>
      <p className="pinpad-dica">Toque nos números ou digite pelo teclado</p>

      <div className={`pinpad-dots ${tremendo ? 'erro' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pinpad-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="pinpad-grid">
        {KEYS.map((key, i) =>
          key === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              className="pinpad-key"
              onClick={() => press(key)}
              disabled={loading}
              tabIndex={-1}
            >
              {key === 'back' ? '⌫' : key}
            </button>
          )
        )}
      </div>

      <div className="row" style={{ justifyContent: 'stretch' }}>
        <button className="btn btn-ghost btn-block" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button
          className="btn btn-primary btn-block"
          onClick={confirmar}
          disabled={pin.length !== 4 || loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}
