import React from 'react';

function ValidationModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Campos obrigatórios faltando</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>Fechar</button>
          <button className="button" onClick={onClose}>Corrigir</button>
        </div>
      </div>
    </div>
  );
}

export default ValidationModal;
