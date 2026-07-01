import React from 'react';

function DressCode() {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Sugestões de Trajes</h2>
        <p>Para facilitar sua escolha dos trajes para o evento e montagem das malas.</p>
      </div>
      <div className="card" style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
        <p style={{ marginBottom: '16px', fontWeight: '600', color: 'var(--brand)' }}>Período do evento:</p>
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Dia 17/09/2026 - Noite:</strong> Traje casual - livre</p>
          <p><strong>Dia 18/09/2026 - Fórum:</strong> Traje casual - livre / <strong>Noite:</strong> Teremos a "MV Folia" - Traje livre/micareta</p>
          <p><strong>Dia 19/09/2026 - Fórum:</strong> Traje casual - livre / <strong>Noite:</strong> Teremos o Jantar de Premiação - Traje Social</p>
          <p><strong>Dia 20/09/2026 -</strong> Livre</p>
        </div>
      </div>
    </section>
  );
}

export default DressCode;
