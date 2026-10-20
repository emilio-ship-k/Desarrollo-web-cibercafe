import React, { useState } from 'react';

function FormReporteFalla({ onGuardarFalla }) {
  const [nuevaFalla, setNuevaFalla] = useState('');

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nuevaFalla.trim()) return;
    onGuardarFalla(nuevaFalla);
    setNuevaFalla('');
  };

  return (
    <form onSubmit={manejarSubmit} className="mt-3 p-3 bg-white rounded border border-danger text-dark">
      <label className="form-label fw-bold text-danger small mb-1">
        Describir falla técnica (bloqueará el computador):
      </label>
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Ej: Pantalla sin señal / Teclado no responde..."
          value={nuevaFalla}
          onChange={(e) => setNuevaFalla(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-danger btn-sm fw-bold">
          Bloquear PC
        </button>
      </div>
    </form>
  );
}

export default FormReporteFalla;