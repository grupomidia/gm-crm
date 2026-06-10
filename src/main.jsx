import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, CheckCircle2, Download, Search, Users } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import './styles.css';

const defaultEvent = {
  title: 'Healthcare Conference 2026',
  slug: 'healthcare-conference-2026',
  description: 'Confirme sua presença em um evento do Grupo Mídia.',
  location: 'São Paulo, SP'
};

function App() {
  const path = window.location.pathname;
  if (path.startsWith('/form/')) return <PublicForm slug={path.split('/form/')[1]} />;
  if (path.startsWith('/admin')) return <Admin />;
  return <Home />;
}

function Home() {
  return (
    <main className="hero">
      <section className="heroCard">
        <div className="badge">Grupo Mídia CRM Forms</div>
        <h1>GM Connect</h1>
        <p>Formulários inteligentes, relacionamento, confirmação de presença e base de contatos para eventos do Grupo Mídia.</p>
        <div className="actions">
          <a className="button" href="/form/healthcare-conference-2026">Abrir formulário</a>
          <a className="button secondary" href="/admin">Painel admin</a>
        </div>
      </section>
    </main>
  );
}

function ConfigWarning() {
  if (isSupabaseConfigured) return null;
  return <div className="warning">Configure o arquivo <strong>.env</strong> com as chaves do Supabase para salvar dados reais.</div>;
}

function PublicForm({ slug }) {
  const [event, setEvent] = React.useState(defaultEvent);
  const [loading, setLoading] = React.useState(true);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({
    name: '', email: '', phone: '', company: '', role: '', segment: 'Executivo(a)',
    dietary: '', interests: []
  });

  React.useEffect(() => {
    async function loadEvent() {
      if (!isSupabaseConfigured) return setLoading(false);
      const { data } = await supabase.from('events').select('*').eq('slug', slug).single();
      if (data) setEvent(data);
      setLoading(false);
    }
    loadEvent();
  }, [slug]);

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function toggleInterest(value) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(item => item !== value)
        : [...prev.interests, value]
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.company) {
      setError('Preencha nome, e-mail e empresa.');
      return;
    }
    if (!isSupabaseConfigured) { setSent(true); return; }

    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .upsert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        role: form.role,
        segment: form.segment,
        tags: form.interests
      }, { onConflict: 'email' })
      .select()
      .single();

    if (contactError) { setError(contactError.message); return; }

    const { error: responseError } = await supabase.from('form_responses').insert({
  event_id: event.id,
  contact_id: contact.id,
  token: crypto.randomUUID(),

  full_name: form.name,
  email: form.email,
  phone: form.phone,
  company: form.company,
  position: form.role,
  segment: form.segment,

  status: 'confirmado',
  answers: {
    dietary: form.dietary,
    interests: form.interests
  }
});

    if (responseError) { setError(responseError.message); return; }
    setSent(true);
  }

  if (loading) return <main className="center"><div className="card">Carregando...</div></main>;
  if (sent)
  return (
    <main className="center">
      <div className="card success">
        <CheckCircle2 size={44}/>
        <h1>Presença confirmada!</h1>
        <p>Obrigado. Seus dados foram registrados no GM Connect.</p>

        <button
          type="button"
          className="button"
          onClick={() => window.location.reload()}
        >
          Nova confirmação
        </button>
      </div>
    </main>
  );

  return (
    <main className="formPage">
      <form className="formCard" onSubmit={submit}>
        <ConfigWarning />
        <div className="badge">Confirmação de presença</div>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p className="muted"><CalendarDays size={16}/> {event.location || 'Local a confirmar'}</p>
        {error && <div className="error">{error}</div>}
        <div className="grid two">
          <label>Nome completo<input value={form.name} onChange={e => update('name', e.target.value)} /></label>
          <label>E-mail<input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></label>
          <label>Telefone/WhatsApp<input value={form.phone} onChange={e => update('phone', e.target.value)} /></label>
          <label>Empresa<input value={form.company} onChange={e => update('company', e.target.value)} /></label>
          <label>Cargo<input value={form.role} onChange={e => update('role', e.target.value)} /></label>
          <label>Segmento<select value={form.segment} onChange={e => update('segment', e.target.value)}><option>Executivo(a)</option><option>Hospital</option><option>Patrocinador</option><option>Fornecedor</option><option>Imprensa</option><option>Speaker</option></select></label>
        </div>
        <label>Restrição alimentar<input value={form.dietary} onChange={e => update('dietary', e.target.value)} placeholder="Opcional" /></label>
        <fieldset>
          <legend>Interesses</legend>
          {['Gestão em saúde','Inovação','Tecnologia','ESG','Liderança','Relacionamento comercial'].map(item => (
            <label className="check" key={item}><input type="checkbox" checked={form.interests.includes(item)} onChange={() => toggleInterest(item)} />{item}</label>
          ))}
        </fieldset>
        <button className="button full">Confirmar presença</button>
      </form>
    </main>
  );
}

function Admin() {
  const [rows, setRows] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { load(); }, []);

  async function load() {
    if (!isSupabaseConfigured) { setRows([]); setLoading(false); return; }
    const { data } = await supabase
      .from('form_responses')
      .select('id, status, created_at, answers, contacts(name,email,phone,company,role,segment)')
      .order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  }

  const filtered = rows.filter(row => {
    const c = row.contacts || {};
    return [c.name, c.email, c.company, c.role, c.segment].join(' ').toLowerCase().includes(query.toLowerCase());
  });

  function exportCsv() {
    const header = ['Nome','Email','Telefone','Empresa','Cargo','Segmento','Status','Data'];
    const lines = filtered.map(row => {
      const c = row.contacts || {};
      return [c.name,c.email,c.phone,c.company,c.role,c.segment,row.status,new Date(row.created_at).toLocaleString('pt-BR')]
        .map(value => `"${String(value || '').replaceAll('"','""')}"`).join(',');
    });
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gm-connect-inscritos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin">
      <ConfigWarning />
      <header className="adminHeader">
        <div><div className="badge">Painel Grupo Mídia</div><h1>GM Connect</h1><p>Inscrições e relacionamento em tempo real.</p></div>
        <button className="button" onClick={exportCsv}><Download size={18}/> Exportar CSV</button>
      </header>
      <section className="metrics">
        <Metric icon={<Users/>} label="Inscritos" value={filtered.length}/>
        <Metric icon={<CheckCircle2/>} label="Confirmados" value={filtered.filter(r => r.status === 'confirmado').length}/>
        <Metric icon={<CalendarDays/>} label="Eventos ativos" value="1"/>
      </section>
      <div className="toolbar"><Search size={18}/><input placeholder="Buscar por nome, empresa ou e-mail" value={query} onChange={e => setQuery(e.target.value)} /></div>
      <section className="tableCard">
        {loading ? <p>Carregando...</p> : <table><thead><tr><th>Nome</th><th>Empresa</th><th>Cargo</th><th>Segmento</th><th>Status</th></tr></thead><tbody>{filtered.map(row => { const c = row.contacts || {}; return <tr key={row.id}><td><strong>{c.name}</strong><small>{c.email}</small></td><td>{c.company}</td><td>{c.role}</td><td>{c.segment}</td><td><span className="pill">{row.status}</span></td></tr>; })}</tbody></table>}
      </section>
    </main>
  );
}

function Metric({ icon, label, value }) {
  return <div className="metric"><div>{icon}</div><strong>{value}</strong><span>{label}</span></div>;
}

createRoot(document.getElementById('root')).render(<App />);
