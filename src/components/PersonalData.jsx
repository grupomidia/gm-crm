import React from 'react';

function PersonalData({ value, onChange }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Dados principais</h2>
        <p>Preencha as informações necessárias para a credencial e o contato.</p>
      </div>
      <div className="grid two">
        <label>Nome para credencial *<input value={value.name} onChange={e => onChange('name', e.target.value)} /></label>
        <label>E-mail *<input type="email" value={value.email} onChange={e => onChange('email', e.target.value)} /></label>
        <label>Instituição / Empresa *<input value={value.company} onChange={e => onChange('company', e.target.value)} /></label>
        <label>Cargo *<input value={value.role} onChange={e => onChange('role', e.target.value)} /></label>
        <label>CPF *<input value={value.cpf} onChange={e => onChange('cpf', e.target.value)} /></label>
        <label>RG *<input value={value.rg} onChange={e => onChange('rg', e.target.value)} /></label>
        <label>Data de nascimento *<input type="date" value={value.birth} onChange={e => onChange('birth', e.target.value)} /></label>
        <label>Celular *<input value={value.phone} onChange={e => onChange('phone', e.target.value)} /></label>
      </div>
      <label>Endereço<input value={value.address} onChange={e => onChange('address', e.target.value)} /></label>
    </section>
  );
}

export default PersonalData;
