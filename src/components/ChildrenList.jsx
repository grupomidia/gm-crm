import React from 'react';

function ChildrenList({ children, onAdd, onUpdate, onRemove }) {
  return (
    <section className="sectionGroup">
      <div className="sectionHeader">
        <h2>Filhos (caso os mesmos acompanhem no evento)</h2>
        <p>Adicione os dados dos filhos que vão participar do evento.</p>
      </div>
      <button type="button" className="button secondary" onClick={onAdd}>+ Adicionar filho</button>
      {children.length === 0 && <p className="muted" style={{ marginTop: '14px' }}>Nenhum filho adicionado.</p>}
      {children.map((child, index) => (
        <div className="childCard" key={index}>
          <div className="grid two">
            <label>
              <strong>Nomes filhos(a)</strong>
              <input value={child.name} onChange={e => onUpdate(index, 'name', e.target.value)} />
            </label>
            <label>
              <strong>Data de nascimento</strong>
              <input type="date" value={child.birth} onChange={e => onUpdate(index, 'birth', e.target.value)} />
            </label>
          </div>
          <button type="button" className="button secondary" style={{ marginTop: '12px' }} onClick={() => onRemove(index)}>Remover filho</button>
        </div>
      ))}
    </section>
  );
}

export default ChildrenList;
