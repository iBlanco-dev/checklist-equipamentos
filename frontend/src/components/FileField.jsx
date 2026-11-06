import { Camera, X } from 'lucide-react';

// Substitui o "Escolher arquivo" nativo. No iPhone o toque abre câmera ou galeria.
export default function FileField({ file, onChange, placeholder = 'Escolher foto' }) {
  return (
    <label className={`file-field ${file ? 'has-file' : ''}`}>
      <Camera size={18} />
      <span className="file-field-name">{file ? file.name : placeholder}</span>
      <input
        type="file"
        accept="image/*"
        onClick={(e) => (e.target.value = '')}
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
      {file && (
        <button
          type="button"
          className="file-field-clear"
          aria-label="Remover foto"
          onClick={(e) => {
            e.preventDefault();
            onChange(null);
          }}
        >
          <X size={16} />
        </button>
      )}
    </label>
  );
}
