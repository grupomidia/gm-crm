import React from 'react';

function PersonalData({ value, onChange }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Dados principais</h2>
        <p>Preencha as informações necessárias para a credencial e o contato.</p>
      </div>
      <div className="grid two">
        <label><strong>Nome para credencial *</strong><input value={value.name} onChange={e => onChange('name', e.target.value)} /></label>
        <label><strong>E-mail *</strong><input type="email" value={value.email} onChange={e => onChange('email', e.target.value)} /></label>
        <label><strong>Instituição / Empresa *</strong><input value={value.company} onChange={e => onChange('company', e.target.value)} /></label>
        <label><strong>Cargo *</strong><input value={value.role} onChange={e => onChange('role', e.target.value)} /></label>
        <label><strong>Segmento / Área de atuação</strong><input value={value.segment || ''} onChange={e => onChange('segment', e.target.value)} placeholder="Ex: Healthcare, Tecnologia, etc" /></label>
        <label><strong>CPF *</strong><input value={value.cpf} onChange={e => onChange('cpf', e.target.value)} placeholder="000.000.000-00" /></label>
        <label><strong>RG *</strong><input value={value.rg} onChange={e => onChange('rg', e.target.value)} placeholder="00.000.000-0" /></label>
        <label><strong>Data de nascimento *</strong><input type="date" value={value.birth} onChange={e => onChange('birth', e.target.value)} /></label>
        <label><strong>Celular *</strong><input type="tel" value={value.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+55 11 9999-9999" /></label>
        <label><strong>LinkedIn</strong><input type="url" value={value.linkedin || ''} onChange={e => onChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/seu-perfil" /></label>
      </div>
      <label><strong>Endereço</strong><input value={value.address} onChange={e => onChange('address', e.target.value)} /></label>
    </section>
  );
}

export default PersonalData;
