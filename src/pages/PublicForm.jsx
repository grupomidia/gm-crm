import React from 'react';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PersonalData from '../components/PersonalData';
import Accommodation from '../components/Accommodation';
import Networking from '../components/Networking';
import Companion from '../components/Companion';
import ChildrenList from '../components/ChildrenList';

const defaultEvent = {
  title: 'Healthcare Conference 2026',
  slug: 'healthcare-conference-2026',
  description: 'Confirme sua presença em um evento do Grupo Mídia.',
  location: 'São Paulo, SP'
};

const initialForm = {
  personal: {
    name: '',
    email: '',
    company: '',
    role: '',
    cpf: '',
    rg: '',
    birth: '',
    address: '',
    phone: ''
  },
  accommodation: {
    tshirt: 'P',
    dietary: ''
  },
  networking: {
    authorizeSharing: false,
    businessMeetings: false
  },
  companion: {
    type: 'no',
    participateForum: false,
    name: '',
    cpf: '',
    rg: '',
    phone: '',
    address: '',
    tshirt: 'P',
    dietary: ''
  },
  children: []
};

function PublicForm({ slug }) {
  const [event, setEvent] = React.useState(defaultEvent);
  const [form, setForm] = React.useState(initialForm);
  const [loading, setLoading] = React.useState(true);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function loadEvent() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.from('events').select('*').eq('slug', slug).single();
      if (data) setEvent(data);
      setLoading(false);
    }

    loadEvent();
  }, [slug]);

  function updateSection(section, field, value) {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }

  function updatePersonal(field, value) {
    updateSection('personal', field, value);
  }

  function updateAccommodation(field, value) {
    updateSection('accommodation', field, value);
  }

  function updateNetworking(field, value) {
    updateSection('networking', field, value);
  }

  function updateCompanion(field, value) {
    updateSection('companion', field, value);
  }

  function setCompanionType(type) {
    setForm(prev => ({
      ...prev,
      companion: {
        ...prev.companion,
        type
      }
    }));
  }

  function addChild() {
    setForm(prev => ({
      ...prev,
      children: [...prev.children, { name: '', birth: '' }]
    }));
  }

  function updateChild(index, field, value) {
    setForm(prev => ({
      ...prev,
      children: prev.children.map((child, idx) =>
        idx === index ? { ...child, [field]: value } : child
      )
    }));
  }

  function removeChild(index) {
    setForm(prev => ({
      ...prev,
      children: prev.children.filter((_, idx) => idx !== index)
    }));
  }

  async function submit(eventSubmit) {
    eventSubmit.preventDefault();
    setError('');

    const { name, email, company, phone } = form.personal;
    if (!name || !email || !company || !phone) {
      setError('Preencha nome, e-mail, empresa e celular.');
      return;
    }

    if (!isSupabaseConfigured) {
      setSent(true);
      return;
    }

    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .upsert({
        name: form.personal.name,
        email: form.personal.email,
        phone: form.personal.phone,
        company: form.personal.company,
        role: form.personal.role,
        segment: 'Participante',
        tags: [form.accommodation.tshirt]
      }, { onConflict: 'email' })
      .select()
      .single();

    if (contactError) {
      setError(contactError.message);
      return;
    }

    const response = {
      event_id: event.id,
      contact_id: contact.id,
      token: crypto.randomUUID(),
      full_name: form.personal.name,
      email: form.personal.email,
      phone: form.personal.phone,
      company: form.personal.company,
      position: form.personal.role,
      segment: 'Participante',
      status: 'confirmado',
      answers: {
        personal: {
          cpf: form.personal.cpf,
          rg: form.personal.rg,
          birth: form.personal.birth,
          address: form.personal.address
        },
        accommodation: {
          tshirt: form.accommodation.tshirt,
          dietary: form.accommodation.dietary
        },
        networking: {
          authorizeSharing: form.networking.authorizeSharing,
          businessMeetings: form.networking.businessMeetings
        },
        companion: form.companion.type !== 'no' ? {
          type: form.companion.type,
          participateForum: form.companion.participateForum,
          name: form.companion.name,
          cpf: form.companion.cpf,
          rg: form.companion.rg,
          phone: form.companion.phone,
          address: form.companion.address,
          tshirt: form.companion.tshirt,
          dietary: form.companion.dietary
        } : null,
        children: form.children
      }
    };

    const { error: responseError } = await supabase.from('form_responses').insert(response);
    if (responseError) {
      setError(responseError.message);
      return;
    }

    setSent(true);
  }

  if (loading) {
    return (
      <main className="center">
        <div className="card">Carregando...</div>
      </main>
    );
  }

  if (sent) {
    return (
      <main className="center">
        <div className="card success">
          <CheckCircle2 size={44} />
          <h1>Inscrição recebida!</h1>
          <p>Obrigado. Sua credencial foi registrada no GM Connect.</p>
          <button type="button" className="button" onClick={() => window.location.reload()}>
            Nova inscrição
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="formPage">
      <form className="formCard" onSubmit={submit}>
        <ConfigWarning />
        <div className="badge">Credenciamento</div>
        <h2 style={{ lineHeight: 1.2 }}>HOSPEDAGEM - HEALTHCARE CONFERENCE 2026</h2>
        <p><strong>17 A 20 DE SETEMBRO DE 2026</strong></p>
        <p className="muted"><CalendarDays size={16} /> 17/09/2026: Check-in no Hotel a partir das 15h.</p>
        <p className="muted"><CalendarDays size={16} /> 20/09/2026: Check-out no Hotel às 12h</p>

        {error && <div className="error">{error}</div>}

        <PersonalData value={form.personal} onChange={updatePersonal} />
        <Accommodation value={form.accommodation} onChange={updateAccommodation} />
        <Networking value={form.networking} onChange={updateNetworking} />
        <Companion
          value={form.companion}
          onSetType={setCompanionType}
          onChangeDetails={updateCompanion}
        />
        <ChildrenList
          children={form.children}
          onAdd={addChild}
          onUpdate={updateChild}
          onRemove={removeChild}
        />

        <button className="button full">Enviar inscrição</button>
      </form>
    </main>
  );
}

function ConfigWarning() {
  if (isSupabaseConfigured) return null;
  return <div className="warning">Configure o arquivo <strong>.env</strong> com as chaves do Supabase para salvar dados reais.</div>;
}

export default PublicForm;
