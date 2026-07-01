import React from 'react';

function Companion({ value, onSetType, onChangeDetails }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>ACOMPANHANTE (Mesmo quarto duplo casal ou duplo camas de solteiro) <span style={{ color: 'var(--error)', fontWeight: 800 }}>*</span></h2>
        <p>Informe se haverá acompanhante e, se sim, adicione os dados dele.</p>
      </div>
      <div className="radioGroup">
        <label>
          <input type="radio" name="companion" value="no" checked={value.type === 'no'} onChange={() => onSetType('no')} />
          <strong style={{ fontWeight: 600 }}>NÃO</strong>
        </label>
        <label>
          <input type="radio" name="companion" value="couple" checked={value.type === 'couple'} onChange={() => onSetType('couple')} />
          <strong style={{ fontWeight: 600 }}>SIM (casal)</strong>
          <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
        </label>
        <label>
          <input type="radio" name="companion" value="twin" checked={value.type === 'twin'} onChange={() => onSetType('twin')} />
          <strong style={{ fontWeight: 600 }}>SIM (camas de solteiro)</strong>
          <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
        </label>
      </div>

      {value.type !== 'no' && (
        <div className="companionDetails">
          <div className="grid two">
            <label>
              <strong style={{ fontWeight: 600 }}>NOME ACOMPANHANTE</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <input value={value.name} onChange={e => onChangeDetails('name', e.target.value)} />
            </label>
            <label>
              <strong style={{ fontWeight: 600 }}>CPF</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <input value={value.cpf} onChange={e => onChangeDetails('cpf', e.target.value)} />
            </label>
            <label>
              <strong style={{ fontWeight: 600 }}>RG</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <input value={value.rg} onChange={e => onChangeDetails('rg', e.target.value)} />
            </label>
            <label>
              <strong style={{ fontWeight: 600 }}>TELEFONE</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <input value={value.phone} onChange={e => onChangeDetails('phone', e.target.value)} />
            </label>
            <label className="full-width">
              <strong style={{ fontWeight: 600 }}>ENDEREÇO</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <input value={value.address} onChange={e => onChangeDetails('address', e.target.value)} />
            </label>
            <label>
              <strong style={{ fontWeight: 600 }}>NUMERO DA CAMISETA</strong>
              <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              <select value={value.tshirt} onChange={e => onChangeDetails('tshirt', e.target.value)}>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="Outro">Outro</option>
              </select>
            </label>
            <label className="full-width">
              <strong>HÁ ALGUMA RESTRIÇÃO ALIMENTAR? QUAL?</strong>
              <input value={value.dietary} onChange={e => onChangeDetails('dietary', e.target.value)} placeholder="Especifique ou deixe em branco" />
            </label>
          </div>

          <fieldset style={{ marginTop: '18px', padding: '14px', border: '1px solid var(--line)', borderRadius: '14px' }}>
            <legend style={{ fontWeight: '800', color: 'var(--brand)' }}>ACOMPANHANTE VAI PARTICIPAR DO FÓRUM? <span style={{ color: 'var(--error)', fontWeight: 800 }}>*</span></legend>
            <div className="radioGroup">
              <label>
                <input type="radio" name="companion_forum" value="yes" checked={value.participateForum === true} onChange={() => onChangeDetails('participateForum', true)} />
                <strong style={{ fontWeight: 600 }}>SIM</strong>
                <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              </label>
              <label>
                <input type="radio" name="companion_forum" value="no" checked={value.participateForum === false} onChange={() => onChangeDetails('participateForum', false)} />
                <strong style={{ fontWeight: 600 }}>NÃO</strong>
                <span style={{ color: 'var(--error)', marginLeft: 6, fontWeight: 800 }}>*</span>
              </label>
            </div>
          </fieldset>
        </div>
      )}
    </section>
  );
}

export default Companion;
