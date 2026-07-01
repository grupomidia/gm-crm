import React from 'react';

function Logistics({ value, onChange }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Logística de Chegada ao Evento</h2>
        <p>Informe como pretende chegar e se necessita de transfer.</p>
      </div>

      <fieldset style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <legend style={{ fontWeight: '800', color: 'var(--brand)', paddingLeft: '8px', paddingRight: '8px' }}>Como pretende chegar a Ribeirão Preto? *</legend>
        <div className="radioGroup" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {['Avião', 'Carro', 'Ônibus', 'Ainda não definido', 'Outro'].map(option => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="arrival"
                value={option}
                checked={value.arrival === option}
                onChange={e => onChange('arrival', e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <legend style={{ fontWeight: '800', color: 'var(--brand)', paddingLeft: '8px', paddingRight: '8px' }}>Você precisará de transfer (aeroporto/hotel)? *</legend>
        <div className="radioGroup" style={{ display: 'flex', gap: '16px' }}>
          {['SIM', 'NÃO'].map(option => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="needsTransfer"
                value={option}
                checked={value.needsTransfer === option}
                onChange={e => onChange('needsTransfer', e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {value.arrival === 'Avião' && (
        <div className="card" style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <label><strong>Aeroporto de chegada *</strong>
            <select value={value.airport} onChange={e => onChange('airport', e.target.value)}>
              <option value="">-- Selecione --</option>
              <option value="Ribeirão Preto">Ribeirão Preto</option>
              <option value="São Paulo (Guarulhos)">São Paulo (Guarulhos)</option>
              <option value="São Paulo (Congonhas)">São Paulo (Congonhas)</option>
              <option value="Campinas (Viracopos)">Campinas (Viracopos)</option>
            </select>
          </label>

          <div className="grid two">
            <label><strong>Número do voo *</strong>
              <input
                value={value.flightNumber}
                onChange={e => onChange('flightNumber', e.target.value)}
                placeholder="Ex: AA123"
              />
            </label>
            <label><strong>Horário de chegada *</strong>
              <input
                type="time"
                value={value.arrivalTime}
                onChange={e => onChange('arrivalTime', e.target.value)}
              />
            </label>
          </div>
        </div>
      )}
    </section>
  );
}

export default Logistics;
