import React from 'react';

function Companion({ value, onSetType, onChangeDetails }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>ACOMPANHANTE (Mesmo quarto duplo casal ou duplo camas de solteiro) *</h2>
        <p>Informe se haverá acompanhante e, se sim, adicione os dados dele.</p>
      </div>
      <div className="radioGroup">
        <label><input type="radio" name="companion" value="no" checked={value.type === 'no'} onChange={() => onSetType('no')} /><strong>NÃO</strong></label>
        <label><input type="radio" name="companion" value="couple" checked={value.type === 'couple'} onChange={() => onSetType('couple')} /><strong>SIM (casal) *</strong></label>
        <label><input type="radio" name="companion" value="twin" checked={value.type === 'twin'} onChange={() => onSetType('twin')} /><strong>SIM (camas de solteiro) *</strong></label>
      </div>

      {value.type !== 'no' && (
        <div className="companionDetails">
          <div className="grid two">
            <label>
              <strong>NOME ACOMPANHANTE *</strong>
              <input value={value.name} onChange={e => onChangeDetails('name', e.target.value)} />
            </label>
            <label>
              <strong>CPF *</strong>
              <input value={value.cpf} onChange={e => onChangeDetails('cpf', e.target.value)} />
            </label>
            <label>
              <strong>RG *</strong>
              <input value={value.rg} onChange={e => onChangeDetails('rg', e.target.value)} />
            </label>
            <label>
              <strong>TELEFONE *</strong>
              <input value={value.phone} onChange={e => onChangeDetails('phone', e.target.value)} />
            </label>
            <label className="full-width">
              <strong>ENDEREÇO *</strong>
              <input value={value.address} onChange={e => onChangeDetails('address', e.target.value)} />
            </label>
            <label>
              <strong>NUMERO DA CAMISETA *</strong>
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
            <legend style={{ fontWeight: '800', color: 'var(--brand)' }}>ACOMPANHANTE VAI PARTICIPAR DO FÓRUM? *</legend>
            <div className="radioGroup">
              <label><input type="radio" name="companion_forum" value="yes" checked={value.participateForum === true} onChange={() => onChangeDetails('participateForum', true)} /><strong>SIM *</strong></label>
              <label><input type="radio" name="companion_forum" value="no" checked={value.participateForum === false} onChange={() => onChangeDetails('participateForum', false)} /><strong>NÃO *</strong></label>
            </div>
          </fieldset>
        </div>
      )}
    </section>
  );
}

export default Companion;
