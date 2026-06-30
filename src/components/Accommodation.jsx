import React from 'react';

function Accommodation({ value, onChange }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Hospedagem</h2>
        <p>Selecione sua camiseta e informe restrições alimentares.</p>
      </div>
      <div className="grid two">
        <label>Camiseta<select value={value.tshirt} onChange={e => onChange('tshirt', e.target.value)}>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
          <option value="Outro">Outro</option>
        </select></label>
        <label>Restrição alimentar?<input value={value.dietary} onChange={e => onChange('dietary', e.target.value)} placeholder="Opcional" /></label>
      </div>
    </section>
  );
}

export default Accommodation;
