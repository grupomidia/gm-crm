import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, CheckCircle2, Download, Search, Users } from 'lucide-react';
import { supabase, isSupabaseConfigured, getSupabaseErrorMessage } from './lib/supabase';
import PublicForm from './pages/PublicForm';
import './styles.css';

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

function Admin() {
  const [rows, setRows] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => { load(); }, []);

  async function load() {
    if (!isSupabaseConfigured) { setRows([]); setLoading(false); return; }
    const { data, error: loadError } = await supabase
      .from('form_responses')
      .select('id, status, created_at, answers, contacts(name,email,phone,company,role,segment)')
      .order('created_at', { ascending: false });
    if (loadError) setError(getSupabaseErrorMessage(loadError));
    setRows(data || []);
    setLoading(false);
  }

  const filtered = rows.filter(row => {
    const c = row.contacts || {};
    return [c.name, c.email, c.company, c.role, c.segment].join(' ').toLowerCase().includes(query.toLowerCase());
  });

  function exportCsv() {
  const header = [
    'Nome',
    'Email',
    'Telefone',
    'Empresa',
    'Cargo',
    'Segmento',
    'Status',
    'Data',

    'CPF',
    'RG',
    'Data de nascimento',
    'Endereco',

    'Camiseta',
    'Restricao alimentar',

    'Autoriza compartilhamento',
    'Interesse reunioes de negocios',

    'Chegada',
    'Precisa de transfer',
    'Aeroporto',
    'Numero do voo',
    'Horario de chegada',

    'Tipo de acompanhante',
    'Acompanhante participa do forum',
    'Nome acompanhante',
    'CPF acompanhante',
    'RG acompanhante',
    'Telefone acompanhante',
    'Endereco acompanhante',
    'Camiseta acompanhante',
    'Restricao alimentar acompanhante',

    'Criancas'
  ];

  const formatBoolean = (value) => {
    if (value === true) return 'Sim';
    if (value === false) return 'Nao';
    return '';
  };

  const formatChildren = (children) => {
    if (!Array.isArray(children) || children.length === 0) return '';

    return children
      .map((child, index) => {
        const name = child?.name || '';
        const birth = child?.birth || '';
        return `Crianca ${index + 1}: ${name}${birth ? ` - ${birth}` : ''}`;
      })
      .join(' | ');
  };

  const escapeCsv = (value) =>
    `"${String(value ?? '').replaceAll('"', '""')}"`;

  const lines = filtered.map((row) => {
    const c = row.contacts || {};
    const answers = row.answers || {};
    const personal = answers.personal || {};
    const accommodation = answers.accommodation || {};
    const networking = answers.networking || {};
    const logistics = answers.logistics || {};
    const companion = answers.companion || {};

    const values = [
      c.name,
      c.email,
      c.phone,
      c.company,
      c.role,
      c.segment,
      row.status,
      row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : '',

      personal.cpf,
      personal.rg,
      personal.birth,
      personal.address,

      accommodation.tshirt,
      accommodation.dietary,

      formatBoolean(networking.authorizeSharing),
      formatBoolean(networking.businessMeetings),

      logistics.arrival,
      formatBoolean(logistics.needsTransfer),
      logistics.airport,
      logistics.flightNumber,
      logistics.arrivalTime,

      companion.type,
      formatBoolean(companion.participateForum),
      companion.name,
      companion.cpf,
      companion.rg,
      companion.phone,
      companion.address,
      companion.tshirt,
      companion.dietary,

      formatChildren(answers.children)
    ];

    return values.map(escapeCsv).join(',');
  });

  const csvContent = '\uFEFF' + [header.join(','), ...lines].join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

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
      {error && <div className="error">{error}</div>}
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
