import React from 'react';

function Networking({ value, onChange }) {
  return (
    <section className="sectionGroup networking">
      <div className="sectionHeader">
        <h2>Comunicação e networking</h2>
        <p>Autorize o uso dos dados e indique interesse em reuniões de negócios.</p>
      </div>
      <div className="networkingContent">
        <label className="check"><input type="checkbox" checked={value.authorizeSharing} onChange={e => onChange('authorizeSharing', e.target.checked)} />Autorizo o compartilhamento dos meus dados para comunicação sobre o evento.</label>
        <label className="check"><input type="checkbox" checked={value.businessMeetings} onChange={e => onChange('businessMeetings', e.target.checked)} />Tenho interesse em participar das reuniões de negócios com patrocinadores.</label>
      </div>
    </section>
  );
}

export default Networking;
