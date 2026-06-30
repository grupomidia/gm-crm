const STORAGE_KEY = 'healthcare_cms_speakers_v2';
const EVENT_KEY = 'healthcare_cms_active_event_v2';
const ROLE_KEY = 'healthcare_cms_active_role_v2';

// Seed Database Generation: 48 speakers to match stats: 32 Publicado, 10 Rascunho, 6 Revisão
function generateSeedSpeakers() {
  const seedList = [];
  const firstNames = ['Atualpa', 'Alex', 'Fernando', 'Paulo', 'Ana Carolina', 'Ana Cristina', 'Beatriz', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Mariana', 'Nelson', 'Patricia', 'Ricardo', 'Sofia', 'Thiago', 'Vanessa', 'William', 'Renata', 'Gustavo', 'Camila', 'Roberto', 'Letícia', 'Felipe', 'Aline', 'Bruno', 'Cláudia', 'Diego', 'Eliana', 'Fábio', 'Gisele', 'Heitor', 'Isabela', 'João', 'Karina', 'Leonardo', 'Márcia', 'Otávio', 'Priscila', 'Rodrigo', 'Simone', 'Tatiane'];
  const lastNames = ['Aguiar', 'Vieira', 'Torres', 'Chapchap', 'Nardi', 'Pinheiro', 'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Gomes', 'Ribeiro', 'Carvalho', 'Lopes', 'Martins', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Moreira', 'Mendes', 'Cardoso', 'Araújo', 'Costa', 'Teixeira', 'Andrade', 'Marques', 'Melo', 'Freitas', 'Castro', 'Souza', 'Borges', 'Santana', 'Carvalho', 'Coelho', 'Lima', 'Dantas', 'Figueiredo', 'Guedes', 'Macedo', 'Miranda', 'Neves', 'Pinto', 'Vargas'];
  const roles = ['CIO', 'Diretor de Tecnologia', 'Diretora de Infraestrutura', 'CEO', 'Gerente de Inovação', 'Superintendente de Saúde', 'Coordenador Médico', 'Diretor Clínico', 'Head de Digital Health', 'Gerente de TI', 'Diretor Executivo', 'VP de Operações'];
  const companies = ['MedSênior', 'Hcor', 'Hospital Sírio-Libanês', 'Amil', 'Rede D’Or', 'Grupo NotreDame Intermédica', 'Albert Einstein', 'Prevent Senior', 'SulAmérica', 'Unimed', 'Porto Saúde', 'Bradesco Saúde'];
  const forums = ['Tecnologia', 'Infraestrutura', 'Gestão'];
  const types = ['Curador', 'Palestrante', 'Moderador', 'Keynote'];

  // Initial 6 matching original specifications
  const initial6 = [
    { name: 'Atualpa Aguiar', role: 'Diretor de Tecnologia', company: 'MedSênior', forum: 'Tecnologia', type: 'Curador', status: 'Publicado', visibleSite: true, visibleFeed: true, visibleStory: true },
    { name: 'Alex Vieira', role: 'CIO', company: 'Hcor', forum: 'Tecnologia', type: 'Curador', status: 'Revisão', visibleSite: true, visibleFeed: true, visibleStory: true },
    { name: 'Fernando Torres', role: 'Diretor Executivo', company: 'Hospital Sírio-Libanês', forum: 'Infraestrutura', type: 'Curador', status: 'Revisão', visibleSite: false, visibleFeed: true, visibleStory: false },
    { name: 'Paulo Chapchap', role: 'CEO', company: 'Amil', forum: 'Gestão', type: 'Curador', status: 'Publicado', visibleSite: true, visibleFeed: true, visibleStory: true },
    { name: 'Ana Carolina Nardi', role: 'Diretora de Infraestrutura', company: 'Rede D’Or', forum: 'Infraestrutura', type: 'Palestrante', status: 'Rascunho', visibleSite: false, visibleFeed: false, visibleStory: false },
    { name: 'Ana Cristina Pinheiro', role: 'CEO', company: 'Grupo NotreDame Intermédica', forum: 'Gestão', type: 'Palestrante', status: 'Revisão', visibleSite: false, visibleFeed: true, visibleStory: true }
  ];

  initial6.forEach(s => seedList.push(s));

  // Distributions required to match: 32 Publicado, 10 Rascunho, 6 Revisão
  let publicadoNeed = 30; // 32 - 2 (from initial6)
  let rascunhoNeed = 9;  // 10 - 1 (from initial6)
  let revisaoNeed = 3;   // 6 - 3 (from initial6)

  for (let i = 6; i < 48; i++) {
    let status = 'Publicado';
    if (publicadoNeed > 0) {
      status = 'Publicado';
      publicadoNeed--;
    } else if (rascunhoNeed > 0) {
      status = 'Rascunho';
      rascunhoNeed--;
    } else if (revisaoNeed > 0) {
      status = 'Revisão';
      revisaoNeed--;
    }

    const name = `${firstNames[i]} ${lastNames[i]}`;
    const role = roles[i % roles.length];
    const company = companies[i % companies.length];
    const forum = forums[i % forums.length];
    const type = types[i % types.length];
    
    // Default visibility behavior based on status
    const visibleSite = status === 'Publicado';
    const visibleFeed = status !== 'Rascunho';
    const visibleStory = status === 'Publicado' || status === 'Revisão';

    seedList.push({
      name,
      role,
      company,
      forum,
      type,
      status,
      visibleSite,
      visibleFeed,
      visibleStory
    });
  }

  // Populate IDs, bios, socials and orders
  seedList.forEach((s, idx) => {
    s.id = crypto.randomUUID();
    s.shortBio = `Curador e especialista no Fórum de ${s.forum}. Contribui com inovações no setor.`;
    s.fullBio = `Esta é a biografia completa de ${s.name}, que atua como ${s.role} na empresa ${s.company}. Com mais de 10 anos de experiência em saúde corporativa e tecnologia hospitalar, atua na liderança de projetos de transformação digital e infraestrutura.`;
    s.originalPhoto = '';
    s.processedPhoto = '';
    s.linkedin = `https://linkedin.com/in/${s.name.toLowerCase().replace(/\s+/g, '-')}`;
    s.instagram = `@${s.name.toLowerCase().replace(/\s+/g, '.')}`;
    s.displayOrder = idx + 1;
    s.createdAt = new Date(Date.now() - idx * 3600000).toISOString();
    s.updatedAt = new Date().toISOString();
    s.eventId = 'hc2026'; // Default Event
  });

  return seedList;
}

// State variables
let speakers = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
if (!speakers) {
  speakers = generateSeedSpeakers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
}

let activeEvent = localStorage.getItem(EVENT_KEY) || 'hc2026';
let currentRole = localStorage.getItem(ROLE_KEY) || 'admin';

// DOM Element shortcuts
const $ = (selector) => document.querySelector(selector);

// Currently editing speaker temp container
let currentSpeakerData = {
  id: '',
  name: '',
  role: '',
  company: '',
  forum: 'Tecnologia',
  type: 'Palestrante',
  displayOrder: 0,
  linkedin: '',
  instagram: '',
  shortBio: '',
  fullBio: '',
  originalPhoto: '',
  processedPhoto: '',
  visibleSite: true,
  visibleFeed: true,
  visibleStory: true,
  status: 'Rascunho',
  bgRemoved: false,
  bwApplied: false
};

// Escape helper for HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Log dev console helper
function logDev(type, message) {
  const container = $('#consoleLogs');
  if (!container) return;
  const time = new Date().toTimeString().split(' ')[0];
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  
  let prefix = '';
  if (type === 'api') prefix = '[MOCK API] ';
  if (type === 'prisma') prefix = '[PRISMA ORM] ';
  if (type === 'sql') prefix = '[POSTGRESQL] ';
  if (type === 'system') prefix = '[SYSTEM] ';
  
  div.innerHTML = `<span class="log-time">[${time}]</span><span class="log-msg">${prefix}${escapeHtml(message)}</span>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Display toast notifications
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Get Name Initials
function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

// Save speaker list to storage
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
}

// Render Stats indicators
function renderStats() {
  const eventSpeakers = speakers.filter(s => s.eventId === activeEvent);
  $('#totalSpeakers').textContent = eventSpeakers.length;
  $('#publishedSpeakers').textContent = eventSpeakers.filter(s => s.status === 'Publicado').length;
  $('#pendingSpeakers').textContent = eventSpeakers.filter(s => s.status === 'Rascunho').length;
  $('#reviewSpeakers').textContent = eventSpeakers.filter(s => s.status === 'Revisão').length;
}

// Apply role restrictions to elements
function applyRoleRestrictions() {
  $('#roleSelect').value = currentRole;
  if (typeof _firebaseReady !== 'undefined' && _firebaseReady) {
    $('#roleSelect').disabled = currentRole !== 'admin';
  } else {
    $('#roleSelect').disabled = false;
  }
  $('#eventSelect').value = activeEvent;
  
  // Controls state
  const isViewer = currentRole === 'viewer';
  const isRevisor = currentRole === 'revisor';
  const isEditor = currentRole === 'editor';
  
  // Add buttons
  $('#newSpeakerBtn').disabled = isViewer || isRevisor;
  $('#headerGenerateAll').disabled = isViewer;
  
  // Inputs in Form Modal
  const textInputs = ['#name', '#role', '#company', '#forum', '#type', '#displayOrder', '#linkedin', '#instagram', '#shortBio', '#fullBio'];
  textInputs.forEach(selector => {
    $(selector).disabled = isViewer || isRevisor;
  });
  
  $('#triggerUploadBtn').disabled = isViewer || isRevisor;
  $('#visibleSite').disabled = isViewer || isRevisor;
  $('#visibleFeed').disabled = isViewer || isRevisor;
  $('#visibleStory').disabled = isViewer || isRevisor;
  
  // Form modal action buttons
  $('#btnSaveDraft').disabled = isViewer; // Revisor can save draft
  $('#btnSendReview').disabled = isViewer;
  $('#btnPublish').disabled = isViewer || isEditor; // Editor cannot publish (revisor and admin can)
  
  if (isViewer) {
    logDev('system', `Interface em modo Leitura (Visualizador).`);
  } else if (isRevisor) {
    logDev('system', `Interface em modo Revisão. Apenas alteração de status/aprovação permitida.`);
  } else {
    logDev('system', `Permissões atualizadas para Perfil: ${currentRole.toUpperCase()}.`);
  }
  
  renderSpeakers();
}

// Render Speaker list in Table
function renderSpeakers() {
  const search = $('#searchInput').value.toLowerCase();
  const forum = $('#forumFilter').value;
  const status = $('#statusFilter').value;
  const visibility = $('#visibilityFilter').value;
  const sort = $('#sortFilter').value;
  
  let filtered = speakers.filter(s => s.eventId === activeEvent);
  
  // Log Prisma SELECT Query simulation
  let prismaWhere = { eventId: activeEvent };
  
  // Apply Search
  if (search) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.role.toLowerCase().includes(search) || 
      s.company.toLowerCase().includes(search)
    );
    prismaWhere.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { role: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // Apply Forum Filter
  if (forum !== 'all') {
    filtered = filtered.filter(s => s.forum === forum);
    prismaWhere.forum = forum;
  }
  
  // Apply Status Filter
  if (status !== 'all') {
    filtered = filtered.filter(s => s.status === status);
    prismaWhere.status = status;
  }
  
  // Apply Visibility Filter
  if (visibility !== 'all') {
    filtered = filtered.filter(s => s[visibility] === true);
    prismaWhere[visibility] = true;
  }
  
  // Apply Sorting
  let prismaOrderBy = {};
  if (sort === 'ordem') {
    filtered.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
    prismaOrderBy = { displayOrder: 'asc' };
  } else if (sort === 'nome') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    prismaOrderBy = { name: 'asc' };
  } else if (sort === 'recente') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    prismaOrderBy = { createdAt: 'desc' };
  }
  
  // Render table
  const tbody = $('#speakerTableBody');
  tbody.innerHTML = '';
  
  if (filtered.length === 0) {
    $('#noSpeakersMessage').style.display = 'block';
  } else {
    $('#noSpeakersMessage').style.display = 'none';
    
    filtered.forEach(s => {
      const tr = document.createElement('tr');
      
      // Photo Column
      const tdPhoto = document.createElement('td');
      tdPhoto.className = 'table-photo';
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'table-avatar';
      if (s.processedPhoto || s.originalPhoto) {
        avatarDiv.style.backgroundImage = `url('${s.processedPhoto || s.originalPhoto}')`;
      } else {
        avatarDiv.textContent = getInitials(s.name);
      }
      tdPhoto.appendChild(avatarDiv);
      tr.appendChild(tdPhoto);
      
      // Name & Profile
      const tdProfile = document.createElement('td');
      tdProfile.setAttribute('data-label', 'Palestrante');
      tdProfile.innerHTML = `
        <div class="profile-info">
          <h4>${escapeHtml(s.name)}</h4>
          <p>${escapeHtml(s.role)} • <strong>${escapeHtml(s.company)}</strong></p>
        </div>
      `;
      tr.appendChild(tdProfile);
      
      // Forum & Type Column
      const tdForum = document.createElement('td');
      tdForum.setAttribute('data-label', 'Fórum');
      tdForum.innerHTML = `
        <span class="badge forum-${s.forum}">${s.forum}</span>
        <span class="type-pill">${s.type}</span>
      `;
      tr.appendChild(tdForum);
      
      // Status Column
      const tdStatus = document.createElement('td');
      tdStatus.setAttribute('data-label', 'Status');
      tdStatus.innerHTML = `<span class="status-dot status-${s.status}">${s.status}</span>`;
      tr.appendChild(tdStatus);
      
      // Visibility Column
      const tdVis = document.createElement('td');
      tdVis.setAttribute('data-label', 'Canais');
      tdVis.innerHTML = `
        <div class="visibility-icons">
          <span class="visibility-icon ${s.visibleSite ? 'active' : ''}" title="Site">S</span>
          <span class="visibility-icon ${s.visibleFeed ? 'active' : ''}" title="Feed">F</span>
          <span class="visibility-icon ${s.visibleStory ? 'active' : ''}" title="Story">St</span>
        </div>
      `;
      tr.appendChild(tdVis);
      
      // Ordem Column
      const tdOrdem = document.createElement('td');
      tdOrdem.setAttribute('data-label', 'Ordem');
      tdOrdem.innerHTML = `<span class="ordem-number">${s.displayOrder || 0}</span>`;
      tr.appendChild(tdOrdem);
      
      // Actions Column
      const tdActions = document.createElement('td');
      tdActions.className = 'table-actions';
      
      const isViewer = currentRole === 'viewer';
      const isRevisor = currentRole === 'revisor';
      const isEditor = currentRole === 'editor';
      
      tdActions.innerHTML = `
        <button class="mini-btn" onclick="openFormModal('${s.id}')" ${isViewer ? 'title="Ver Perfil"' : 'title="Editar"'}>
          ${isViewer || isRevisor ? 'Ver / Revisar' : 'Editar'}
        </button>
        <button class="mini-btn success" onclick="openCardGenerator('${s.id}')" title="Gerar Peças Visual">
          Cards
        </button>
        <button class="mini-btn" onclick="quickToggleVisibility('${s.id}')" ${isViewer || isRevisor ? 'disabled' : ''} title="Visibilidade Site">
          ${s.visibleSite ? 'Ocultar' : 'Exibir'}
        </button>
        <button class="mini-btn" onclick="duplicateSpeaker('${s.id}')" ${isViewer || isRevisor ? 'disabled' : ''} title="Duplicar Cadastro">
          Duplicar
        </button>
        <button class="mini-btn danger" onclick="deleteSpeaker('${s.id}')" ${isViewer || isEditor || isRevisor ? 'disabled style="display:none;"' : ''} title="Excluir do Evento">
          Excluir
        </button>
      `;
      tr.appendChild(tdActions);
      
      tbody.appendChild(tr);
    });
  }
  
  // Render stats
  renderStats();
}

// Simulated backend API log triggers
function triggerGetSpeakersLog(prismaWhere, prismaOrderBy) {
  logDev('api', `GET /api/speakers?event=${activeEvent}&forum=${$('#forumFilter').value}&status=${$('#statusFilter').value} - 200 OK`);
  logDev('prisma', `prisma.speaker.findMany({\n  where: ${JSON.stringify(prismaWhere, null, 2)},\n  orderBy: ${JSON.stringify(prismaOrderBy)}\n})`);
  
  let sqlWhere = `eventId = '${activeEvent}'`;
  if ($('#forumFilter').value !== 'all') sqlWhere += ` AND forum = '${$('#forumFilter').value}'`;
  if ($('#statusFilter').value !== 'all') sqlWhere += ` AND status = '${$('#statusFilter').value}'`;
  
  logDev('sql', `SELECT * FROM "Speaker" WHERE ${sqlWhere} ORDER BY displayOrder ASC;`);
}

// Modal open controller
window.openFormModal = function(id = null) {
  // Clear previous values
  $('#speakerForm').reset();
  $('#speakerId').value = '';
  
  // Reset temp object
  currentSpeakerData = {
    id: '',
    name: '',
    role: '',
    company: '',
    forum: 'Tecnologia',
    type: 'Palestrante',
    displayOrder: 0,
    linkedin: '',
    instagram: '',
    shortBio: '',
    fullBio: '',
    originalPhoto: '',
    processedPhoto: '',
    visibleSite: true,
    visibleFeed: true,
    visibleStory: true,
    status: 'Rascunho',
    bgRemoved: false,
    bwApplied: false
  };

  const isViewer = currentRole === 'viewer';
  const isRevisor = currentRole === 'revisor';

  if (id) {
    // Edit Mode
    const speaker = speakers.find(s => s.id === id);
    if (!speaker) return;
    
    // Copy properties to current temp
    Object.assign(currentSpeakerData, speaker);
    
    $('#speakerId').value = speaker.id;
    $('#name').value = speaker.name;
    $('#role').value = speaker.role;
    $('#company').value = speaker.company;
    $('#forum').value = speaker.forum;
    $('#type').value = speaker.type;
    $('#displayOrder').value = speaker.displayOrder || 0;
    $('#linkedin').value = speaker.linkedin || '';
    $('#instagram').value = speaker.instagram || '';
    $('#shortBio').value = speaker.shortBio || '';
    $('#fullBio').value = speaker.fullBio || '';
    $('#visibleSite').checked = speaker.visibleSite;
    $('#visibleFeed').checked = speaker.visibleFeed;
    $('#visibleStory').checked = speaker.visibleStory;
    
    $('#modalTitle').textContent = isViewer ? 'Visualizar Palestrante' : (isRevisor ? 'Revisar Informações' : 'Editar Palestrante');
    $('#modalSubTitle').textContent = 'ID: ' + speaker.id.substring(0, 8);
    
    logDev('api', `GET /api/speakers/${speaker.id} - 200 OK`);
    logDev('prisma', `prisma.speaker.findUnique({ where: { id: "${speaker.id}" } })`);
  } else {
    // Create Mode
    $('#modalTitle').textContent = 'Novo Palestrante';
    $('#modalSubTitle').textContent = 'Cadastro Editorial';
    $('#displayOrder').value = speakers.filter(s => s.eventId === activeEvent).length + 1;
  }
  
  updatePhotoPreviews();
  $('#speakerModal').showModal();
};

window.closeFormModal = function() {
  $('#speakerModal').close();
};

// Update Photo elements
function updatePhotoPreviews() {
  const originalFrame = $('#originalPhotoFrame');
  const processedFrame = $('#processedPhotoFrame');
  
  if (currentSpeakerData.originalPhoto) {
    originalFrame.innerHTML = '';
    originalFrame.style.backgroundImage = `url('${currentSpeakerData.originalPhoto}')`;
    
    processedFrame.innerHTML = '';
    processedFrame.style.backgroundImage = `url('${currentSpeakerData.processedPhoto || currentSpeakerData.originalPhoto}')`;
    
    // Toggle active filters classes
    processedFrame.className = 'photo-frame processed';
    if (currentSpeakerData.bwApplied) processedFrame.classList.add('bw');
    if (currentSpeakerData.bgRemoved) processedFrame.classList.add('nobg');
    
    $('#photoActionsRow').style.display = 'flex';
    
    // Toggle active states on buttons
    $('#toggleBgRemovalBtn').classList.toggle('active', currentSpeakerData.bgRemoved);
    $('#toggleGrayscaleBtn').classList.toggle('active', currentSpeakerData.bwApplied);
  } else {
    originalFrame.innerHTML = '<span class="placeholder-text">Sem Foto</span>';
    originalFrame.style.backgroundImage = '';
    processedFrame.innerHTML = '<span class="placeholder-text">Sem Foto</span>';
    processedFrame.style.backgroundImage = '';
    processedFrame.className = 'photo-frame processed';
    $('#photoActionsRow').style.display = 'none';
  }
}

// Upload photo handler
$('#triggerUploadBtn').addEventListener('click', () => $('#photoInput').click());

$('#photoInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    currentSpeakerData.originalPhoto = e.target.result;
    currentSpeakerData.processedPhoto = e.target.result;
    currentSpeakerData.bgRemoved = false;
    currentSpeakerData.bwApplied = false;
    
    logDev('api', `POST /api/speakers/temp/upload-photo - 200 OK (Mídia Processada no Cliente)`);
    updatePhotoPreviews();
  };
  reader.readAsDataURL(file);
});

// Image Cutout & B&W Filters Canvas Simulator
function processImage(grayscale, nobg) {
  if (!currentSpeakerData.originalPhoto) return;
  
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    if (grayscale) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = gray;
        data[i+1] = gray;
        data[i+2] = gray;
      }
    }
    
    if (nobg) {
      // Background Removal Mask Simulator: creates circular center alpha cutout overlay
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxD = Math.min(cx, cy) * 0.9;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > maxD) {
            const alpha = Math.max(0, 1 - (d - maxD) / (maxD * 0.25));
            data[idx + 3] = data[idx + 3] * alpha;
          }
        }
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    currentSpeakerData.processedPhoto = canvas.toDataURL();
    updatePhotoPreviews();
  };
  img.src = currentSpeakerData.originalPhoto;
}

$('#toggleBgRemovalBtn').addEventListener('click', () => {
  currentSpeakerData.bgRemoved = !currentSpeakerData.bgRemoved;
  processImage(currentSpeakerData.bwApplied, currentSpeakerData.bgRemoved);
  logDev('system', `Filtro AI: Remoção de Fundo ${currentSpeakerData.bgRemoved ? 'Ativado' : 'Desativado'}`);
});

$('#toggleGrayscaleBtn').addEventListener('click', () => {
  currentSpeakerData.bwApplied = !currentSpeakerData.bwApplied;
  processImage(currentSpeakerData.bwApplied, currentSpeakerData.bgRemoved);
  logDev('system', `Filtro AI: Conversão em Preto e Branco ${currentSpeakerData.bwApplied ? 'Ativado' : 'Desativado'}`);
});

$('#deletePhotoBtn').addEventListener('click', () => {
  currentSpeakerData.originalPhoto = '';
  currentSpeakerData.processedPhoto = '';
  currentSpeakerData.bgRemoved = false;
  currentSpeakerData.bwApplied = false;
  updatePhotoPreviews();
  logDev('system', `Foto excluída.`);
});

// Save Speaker Handler (Status parameters)
function handleSpeakerSave(targetStatus) {
  const id = $('#speakerId').value || crypto.randomUUID();
  const name = $('#name').value.trim();
  const role = $('#role').value.trim();
  const company = $('#company').value.trim();
  const forum = $('#forum').value;
  const type = $('#type').value;
  const displayOrder = Number($('#displayOrder').value) || 0;
  
  if (!name || !role || !company) {
    showToast('Por favor, preencha todos os campos obrigatórios (*).');
    return;
  }
  
  const payload = {
    id,
    name,
    role,
    company,
    forum,
    type,
    displayOrder,
    linkedin: $('#linkedin').value.trim(),
    instagram: $('#instagram').value.trim(),
    shortBio: $('#shortBio').value.trim(),
    fullBio: $('#fullBio').value.trim(),
    originalPhoto: currentSpeakerData.originalPhoto,
    processedPhoto: currentSpeakerData.processedPhoto,
    visibleSite: $('#visibleSite').checked,
    visibleFeed: $('#visibleFeed').checked,
    visibleStory: $('#visibleStory').checked,
    status: targetStatus,
    createdAt: currentSpeakerData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    eventId: activeEvent
  };
  
  const idx = speakers.findIndex(s => s.id === id);
  const isNew = idx < 0;
  
  if (typeof _db !== 'undefined' && _db && _firebaseReady) {
    _db.collection('speakers').doc(id).set(payload)
      .then(() => {
        if (isNew) {
          logDev('api', `POST /api/speakers - 201 Created`);
          logDev('prisma', `prisma.speaker.create({\n  data: ${JSON.stringify(payload, null, 2)}\n})`);
          showToast(`Palestrante "${name}" cadastrado como ${targetStatus}!`);
        } else {
          logDev('api', `PATCH /api/speakers/${id} - 200 OK`);
          logDev('prisma', `prisma.speaker.update({\n  where: { id: "${id}" },\n  data: ${JSON.stringify(payload, null, 2)}\n})`);
          showToast(`Cadastro de "${name}" atualizado como ${targetStatus}!`);
        }
      })
      .catch(err => {
        logDev('system', `⚠️ Erro ao salvar no Firestore: ${err.message}`);
        showToast('Erro ao salvar palestrante.');
      });
    closeFormModal();
  } else {
    // Demo Mode fallback
    if (isNew) {
      speakers.unshift(payload);
    } else {
      speakers[idx] = payload;
    }
    persist();
    renderSpeakers();
    closeFormModal();
    if (isNew) {
      logDev('api', `POST /api/speakers - 201 Created`);
      logDev('prisma', `prisma.speaker.create({\n  data: ${JSON.stringify(payload, null, 2)}\n})`);
      showToast(`Palestrante "${name}" cadastrado como ${targetStatus}!`);
    } else {
      logDev('api', `PATCH /api/speakers/${id} - 200 OK`);
      logDev('prisma', `prisma.speaker.update({\n  where: { id: "${id}" },\n  data: ${JSON.stringify(payload, null, 2)}\n})`);
      showToast(`Cadastro de "${name}" atualizado como ${targetStatus}!`);
    }
  }
}

// Connect buttons
$('#btnSaveDraft').addEventListener('click', () => handleSpeakerSave('Rascunho'));
$('#btnSendReview').addEventListener('click', () => handleSpeakerSave('Revisão'));
$('#btnPublish').addEventListener('click', () => handleSpeakerSave('Publicado'));

$('#cancelFormBtn').addEventListener('click', closeFormModal);
$('#closeFormBtn').addEventListener('click', closeFormModal);
$('#newSpeakerBtn').addEventListener('click', () => openFormModal());

// Quick Visiblity Toggle
window.quickToggleVisibility = function(id) {
  const speaker = speakers.find(s => s.id === id);
  if (!speaker) return;
  
  const newVal = !speaker.visibleSite;
  
  if (typeof _db !== 'undefined' && _db && _firebaseReady) {
    _db.collection('speakers').doc(id).update({
      visibleSite: newVal,
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      logDev('api', `PATCH /api/speakers/${id} - 200 OK`);
      logDev('prisma', `prisma.speaker.update({\n  where: { id: "${id}" },\n  data: { visibleSite: ${newVal} }\n})`);
      showToast(`Visibilidade de "${speaker.name}" alterada.`);
    })
    .catch(err => {
      logDev('system', `⚠️ Erro no Firestore: ${err.message}`);
      showToast('Erro ao alterar visibilidade.');
    });
  } else {
    speaker.visibleSite = newVal;
    speaker.updatedAt = new Date().toISOString();
    persist();
    renderSpeakers();
    logDev('api', `PATCH /api/speakers/${id} - 200 OK`);
    logDev('prisma', `prisma.speaker.update({\n  where: { id: "${id}" },\n  data: { visibleSite: ${newVal} }\n})`);
    showToast(`Visibilidade de "${speaker.name}" alterada.`);
  }
};

// Duplicate Speaker
window.duplicateSpeaker = function(id) {
  const speaker = speakers.find(s => s.id === id);
  if (!speaker) return;
  
  const duplicated = {
    ...speaker,
    id: crypto.randomUUID(),
    name: `${speaker.name} - Cópia`,
    displayOrder: (speaker.displayOrder || 0) + 1,
    status: 'Rascunho',
    visibleSite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (typeof _db !== 'undefined' && _db && _firebaseReady) {
    _db.collection('speakers').doc(duplicated.id).set(duplicated)
      .then(() => {
        logDev('api', `POST /api/speakers/${id}/duplicate - 201 Created`);
        logDev('prisma', `prisma.speaker.create({\n  data: ${JSON.stringify(duplicated, null, 2)}\n})`);
        showToast(`Cadastro "${speaker.name}" duplicado como rascunho.`);
      })
      .catch(err => {
        logDev('system', `⚠️ Erro no Firestore: ${err.message}`);
        showToast('Erro ao duplicar palestrante.');
      });
  } else {
    speakers.unshift(duplicated);
    persist();
    renderSpeakers();
    logDev('api', `POST /api/speakers/${id}/duplicate - 201 Created`);
    logDev('prisma', `prisma.speaker.create({\n  data: ${JSON.stringify(duplicated, null, 2)}\n})`);
    showToast(`Cadastro "${speaker.name}" duplicado como rascunho.`);
  }
};

// Delete Speaker
window.deleteSpeaker = function(id) {
  const speaker = speakers.find(s => s.id === id);
  if (!speaker) return;
  
  if (confirm(`Tem certeza que deseja excluir permanentemente o palestrante "${speaker.name}"?`)) {
    if (typeof _db !== 'undefined' && _db && _firebaseReady) {
      _db.collection('speakers').doc(id).delete()
        .then(() => {
          logDev('api', `DELETE /api/speakers/${id} - 200 OK`);
          logDev('prisma', `prisma.speaker.delete({ where: { id: "${id}" } })`);
          showToast(`Palestrante removido.`);
        })
        .catch(err => {
          logDev('system', `⚠️ Erro no Firestore: ${err.message}`);
          showToast('Erro ao remover palestrante.');
        });
    } else {
      speakers = speakers.filter(s => s.id !== id);
      persist();
      renderSpeakers();
      logDev('api', `DELETE /api/speakers/${id} - 200 OK`);
      logDev('prisma', `prisma.speaker.delete({ where: { id: "${id}" } })`);
      showToast(`Palestrante removido.`);
    }
  }
};

// ==========================================
// CARD GENERATOR VIEW & CANVAS RENDERING
// ==========================================

let activeGenSpeakerId = '';
let activeGenSpeakerId2 = '';

// Helper to preload image URLs asynchronously
function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Draw gradient text helper (template-aware)
function drawGradientText(ctx, text, x, y, font, align, baseline, templateName = 'neon') {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  
  const metrics = ctx.measureText(text);
  const textW = metrics.width;
  
  let startX = x;
  if (align === 'center') startX = x - textW / 2;
  else if (align === 'right') startX = x - textW;
  
  const grad = ctx.createLinearGradient(startX, 0, startX + textW, 0);
  
  if (templateName === 'aurora') {
    grad.addColorStop(0, '#00e6b4');   // teal
    grad.addColorStop(0.4, '#8b2cff'); // purple
    grad.addColorStop(1, '#00c8ff');   // cyan
  } else if (templateName === 'cyber') {
    grad.addColorStop(0, '#0967ff');   // blue
    grad.addColorStop(0.5, '#00f2fe'); // cyan
    grad.addColorStop(1, '#e33495');   // pink
  } else {
    grad.addColorStop(0, '#0967ff');   // blue
    grad.addColorStop(0.35, '#8b2cff'); // purple
    grad.addColorStop(0.7, '#e33495');  // pink
    grad.addColorStop(1, '#ff7a18');    // orange
  }
  
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
  ctx.restore();
}


// Draw neural connecting lines
function drawNeuralLines(ctx, cx, cy, radius, numLines = 14) {
  ctx.save();
  // Central glowing node
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#8b2cff';
  ctx.fill();
  
  // Radiating curved network lines
  ctx.shadowBlur = 0;
  for (let i = 0; i < numLines; i++) {
    const angle = (i * Math.PI * 2) / numLines + (Math.random() - 0.5) * 0.12;
    const length = radius * (0.35 + Math.random() * 0.5);
    const xEnd = cx + Math.cos(angle) * length;
    const yEnd = cy + Math.sin(angle) * length;
    
    const gradLine = ctx.createLinearGradient(cx, cy, xEnd, yEnd);
    gradLine.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradLine.addColorStop(0.2, 'rgba(139, 44, 255, 0.4)');
    gradLine.addColorStop(0.7, 'rgba(9, 103, 255, 0.1)');
    gradLine.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.strokeStyle = gradLine;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw GM realization logo circle
function drawGMLogo(ctx, x, y, size) {
  ctx.save();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // Diagonal GM cutout slice
  ctx.beginPath();
  ctx.moveTo(x - size * 0.3, y + size * 0.3);
  ctx.lineTo(x + size * 0.3, y - size * 0.3);
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold ' + Math.round(size * 0.42) + 'px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GM', x, y);
  ctx.restore();
}

window.openCardGenerator = function(speakerId = null) {
  const eventSpeakers = speakers.filter(s => s.eventId === activeEvent);
  if (eventSpeakers.length === 0) {
    showToast('Nenhum palestrante cadastrado para este evento.');
    return;
  }
  
  // Populate dropdowns
  const select1 = $('#genSpeakerSelect');
  const select2 = $('#genSpeakerSelect2');
  select1.innerHTML = '';
  select2.innerHTML = '';
  
  eventSpeakers.forEach(s => {
    const opt1 = document.createElement('option');
    opt1.value = s.id;
    opt1.textContent = `${s.name} (${s.forum})`;
    select1.appendChild(opt1);
    
    const opt2 = document.createElement('option');
    opt2.value = s.id;
    opt2.textContent = `${s.name} (${s.forum})`;
    select2.appendChild(opt2);
  });
  
  // Default selections
  activeGenSpeakerId = speakerId || eventSpeakers[0].id;
  select1.value = activeGenSpeakerId;
  
  const otherSpeakers = eventSpeakers.filter(s => s.id !== activeGenSpeakerId);
  activeGenSpeakerId2 = otherSpeakers.length > 0 ? otherSpeakers[0].id : eventSpeakers[0].id;
  select2.value = activeGenSpeakerId2;
  
  // Reset Layout selection
  $('#genLayoutSelect').value = 'individual';
  $('#speakerSelectBlock1').style.display = 'block';
  $('#speakerSelectBlock2').style.display = 'none';
  $('#speakerSelectLabel1').textContent = 'Palestrante Selecionado';
  
  updateMockPreviews();
  
  logDev('api', `GET /api/speakers/${activeGenSpeakerId}/assets - 200 OK`);
  $('#cardGeneratorModal').showModal();
};

window.closeGeneratorModal = function() {
  $('#cardGeneratorModal').close();
};

$('#closeGeneratorBtn').addEventListener('click', window.closeGeneratorModal);
$('#openAssetsNav').addEventListener('click', (e) => {
  e.preventDefault();
  window.openCardGenerator();
});

// Update controls change event listeners
$('#genLayoutSelect').addEventListener('change', (e) => {
  const layout = e.target.value;
  if (layout === 'individual') {
    $('#speakerSelectBlock1').style.display = 'block';
    $('#speakerSelectBlock2').style.display = 'none';
    $('#speakerSelectLabel1').textContent = 'Palestrante Selecionado';
  } else if (layout === 'duplo') {
    $('#speakerSelectBlock1').style.display = 'block';
    $('#speakerSelectBlock2').style.display = 'block';
    $('#speakerSelectLabel1').textContent = 'Primeiro Palestrante';
  } else if (layout === 'grid') {
    $('#speakerSelectBlock1').style.display = 'none';
    $('#speakerSelectBlock2').style.display = 'none';
  }
  updateMockPreviews();
});

$('#genSpeakerSelect').addEventListener('change', (e) => {
  activeGenSpeakerId = e.target.value;
  updateMockPreviews();
  logDev('api', `GET /api/speakers/${activeGenSpeakerId}/assets - 200 OK`);
});

$('#genSpeakerSelect2').addEventListener('change', (e) => {
  activeGenSpeakerId2 = e.target.value;
  updateMockPreviews();
});

$('#genTemplateSelect').addEventListener('change', () => {
  updateMockPreviews();
});

// Pre-render simulated HTML/CSS preview cards inside mock containers
function updateMockPreviews() {
  const layout = $('#genLayoutSelect').value;
  const template = $('#genTemplateSelect').value;
  
  const s1 = speakers.find(s => s.id === activeGenSpeakerId);
  const s2 = speakers.find(s => s.id === activeGenSpeakerId2) || s1;
  
  const presets = ['feed', 'story', 'banner', 'site'];
  
  presets.forEach(preset => {
    const mockBox = $(`#mock${preset.charAt(0).toUpperCase() + preset.slice(1)}`);
    if (!mockBox) return;
    
    // Clear styles
    mockBox.className = `card-canvas-mock template-${template} size-${preset}`;
    
    // Top headers
    const brandHtml = `
      <div class="mock-logo-area">
        <div class="mock-brand-text">
          HEALTHCARE
          <span>CONFERENCE</span>
        </div>
        <div class="mock-midia-logo">GM</div>
      </div>
    `;
    
    const sloganGradient = template === 'aurora'
      ? 'linear-gradient(90deg, #00e6b4, #8b2cff, #00c8ff)'
      : template === 'cyber'
        ? 'linear-gradient(90deg, #0967ff, #00f2fe, #e33495)'
        : 'linear-gradient(90deg, #0967ff, #e33495, #ff7a18)';
    const sloganHtml = `
      <div class="text-center" style="margin-top: 5px; line-height: 1.15; z-index: 2;">
        <span style="font-size: 0.5rem; letter-spacing: 0.2em; color: var(--muted); font-weight: 700;">MANDATO DO FUTURO</span>
        <h4 style="font-size: 0.72rem; font-weight: 900; background: ${sloganGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LIDERAR, DECIDIR E TRANSFORMAR A SAÚDE</h4>
      </div>
    `;
    
    // Build HTML based on selected layout mode
    if (layout === 'individual' && s1) {
      const photoHtml = s1.processedPhoto || s1.originalPhoto 
        ? `<div class="mock-avatar" style="background-image: url('${s1.processedPhoto || s1.originalPhoto}')"></div>`
        : `<div class="mock-avatar"><div class="mock-avatar-placeholder">${getInitials(s1.name)}</div></div>`;
        
      mockBox.innerHTML = `
        ${brandHtml}
        <span class="mock-forum-badge">Fórum ${s1.forum}</span>
        <div class="mock-center">
          ${photoHtml}
          <div class="mock-details">
            <div class="mock-name">${escapeHtml(s1.name)}</div>
            <div class="mock-role-comp">${escapeHtml(s1.role)} • <strong>${escapeHtml(s1.company)}</strong></div>
          </div>
        </div>
        <div class="mock-footer">
          17 a 20 de Setembro de 2026 • Hotel JP • Ribeirão Preto/SP
        </div>
      `;
    } 
    else if (layout === 'duplo' && s1 && s2) {
      const photoHtml1 = s1.processedPhoto || s1.originalPhoto 
        ? `<div class="mock-avatar" style="background-image: url('${s1.processedPhoto || s1.originalPhoto}')"></div>`
        : `<div class="mock-avatar"><div class="mock-avatar-placeholder">${getInitials(s1.name)}</div></div>`;
        
      const photoHtml2 = s2.processedPhoto || s2.originalPhoto 
        ? `<div class="mock-avatar" style="background-image: url('${s2.processedPhoto || s2.originalPhoto}')"></div>`
        : `<div class="mock-avatar"><div class="mock-avatar-placeholder">${getInitials(s2.name)}</div></div>`;
        
      const badgeText = s1.forum === s2.forum ? `FÓRUM DE ${s1.forum.toUpperCase()}` : 'CURADORIA ESTRATÉGICA';
      
      mockBox.innerHTML = `
        ${brandHtml}
        ${sloganHtml}
        
        <span class="mock-forum-badge" style="align-self: center; margin-top: 5px;">${badgeText}</span>
        
        <div class="mock-center-duplo">
          <div class="mock-neural-lines">
            <div class="mock-neural-dot"></div>
            <div class="mock-neural-path left" style="transform: rotate(180deg) scaleX(1.3);"></div>
            <div class="mock-neural-path right" style="transform: rotate(0deg) scaleX(1.3);"></div>
            <div class="mock-neural-path" style="transform: rotate(-30deg) scaleX(1.1);"></div>
            <div class="mock-neural-path" style="transform: rotate(150deg) scaleX(1.1);"></div>
          </div>
          
          <div class="mock-speaker-unit">
            ${photoHtml1}
            <div class="mock-details">
              <span style="font-size: 0.45rem; color: #a855f7; font-weight: 800; text-transform: uppercase;">${s1.type}</span>
              <div class="mock-name" style="border-bottom: 2px solid #8b2cff; padding-bottom: 2px;">${escapeHtml(s1.name)}</div>
              <div class="mock-role-comp" style="font-size: 0.5rem; margin-top: 4px;">${escapeHtml(s1.role)}</div>
              <div style="font-size: 0.45rem; color: var(--muted); font-weight: 700;">${escapeHtml(s1.company)}</div>
            </div>
          </div>
          
          <div class="mock-speaker-unit">
            ${photoHtml2}
            <div class="mock-details">
              <span style="font-size: 0.45rem; color: #a855f7; font-weight: 800; text-transform: uppercase;">${s2.type}</span>
              <div class="mock-name" style="border-bottom: 2px solid #8b2cff; padding-bottom: 2px;">${escapeHtml(s2.name)}</div>
              <div class="mock-role-comp" style="font-size: 0.5rem; margin-top: 4px;">${escapeHtml(s2.role)}</div>
              <div style="font-size: 0.45rem; color: var(--muted); font-weight: 700;">${escapeHtml(s2.company)}</div>
            </div>
          </div>
        </div>
        
        <div class="mock-footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
          <span>📅 17 a 20 de Setembro • Hotel JP</span>
          <span style="font-size: 0.48rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">REALIZAÇÃO <strong class="mock-GMLogo">GM</strong> Grupo Mídia</span>
        </div>
      `;
    } 
    else if (layout === 'grid') {
      const techList = speakers.filter(s => s.forum === 'Tecnologia' && s.eventId === activeEvent).slice(0, 2);
      const infraList = speakers.filter(s => s.forum === 'Infraestrutura' && s.eventId === activeEvent).slice(0, 2);
      const gestaoList = speakers.filter(s => s.forum === 'Gestão' && s.eventId === activeEvent).slice(0, 2);
      
      const renderGridItem = (s) => {
        if (!s) return '<div class="mock-grid-speaker" style="opacity:0.2;">Sem palestrante</div>';
        const avatarStyle = s.processedPhoto || s.originalPhoto 
          ? `background-image: url('${s.processedPhoto || s.originalPhoto}')` 
          : '';
        const initials = getInitials(s.name);
        return `
          <div class="mock-grid-speaker">
            <div class="mock-avatar" style="${avatarStyle}">
              ${avatarStyle ? '' : `<div class="mock-avatar-placeholder" style="font-size:0.5rem;">${initials}</div>`}
            </div>
            <div class="mock-details">
              <div class="mock-name">${escapeHtml(s.name)}</div>
              <div class="mock-role-comp">${escapeHtml(s.role)} <strong style="color:var(--muted);">${escapeHtml(s.company)}</strong></div>
            </div>
          </div>
        `;
      };
      
      mockBox.innerHTML = `
        ${brandHtml}
        ${sloganHtml}
        
        <div style="font-size: 0.5rem; letter-spacing: 0.15em; font-weight: 800; color: #fff; text-align: center; margin-top: 5px; z-index: 2;">
          CURADORIA ESTRATÉGICA 2026
        </div>
        
        <div class="mock-grid-columns">
          <div class="mock-grid-column col-Tecnologia">
            <div class="mock-grid-col-header">🌐 Fórum Tecnologia</div>
            ${renderGridItem(techList[0])}
            ${renderGridItem(techList[1])}
          </div>
          <div class="mock-grid-column col-Infraestrutura">
            <div class="mock-grid-col-header">🏢 Fórum Infraestrutura</div>
            ${renderGridItem(infraList[0])}
            ${renderGridItem(infraList[1])}
          </div>
          <div class="mock-grid-column col-Gestão">
            <div class="mock-grid-col-header">👥 Fórum Gestão</div>
            ${renderGridItem(gestaoList[0])}
            ${renderGridItem(gestaoList[1])}
          </div>
        </div>
        
        <div class="mock-footer" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px; font-size: 0.45rem;">
          17 A 20 DE SETEMBRO DE 2026 • HOTEL JP - RIBEIRÃO PRETO/SP • REALIZAÇÃO GRUPO MÍDIA
        </div>
      `;
    }
  });
}

// Canvas Drawer to export actual PNG images (High resolution support)
async function renderPresetToCanvas(presetName, templateName, download = true, customSpeaker = null) {
  return new Promise(async (resolve) => {
  const layout = customSpeaker ? 'individual' : $('#genLayoutSelect').value;
  const s1 = customSpeaker || speakers.find(s => s.id === activeGenSpeakerId);
  const s2 = customSpeaker || speakers.find(s => s.id === activeGenSpeakerId2) || s1;
  
  const canvas = $('#exportCanvas');
  const ctx = canvas.getContext('2d');
  
  let w = 1080, h = 1080;
  if (presetName === 'feed') { w = 1080; h = 1080; }
  else if (presetName === 'story') { w = 1080; h = 1920; }
  else if (presetName === 'banner') { w = 1600; h = 900; }
  else if (presetName === 'site') { w = 800; h = 1000; }
  
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  
  // 1. Draw Background Colors
  if (templateName === 'neon') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#04050d');
    g.addColorStop(0.5, '#0d091e');
    g.addColorStop(1, '#050308');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    
    const r1 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, w * 0.7);
    r1.addColorStop(0, 'rgba(139, 44, 255, 0.4)');
    r1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = r1;
    ctx.fillRect(0, 0, w, h);
    
    const r2 = ctx.createRadialGradient(w * 0.2, h * 0.8, 0, w * 0.2, h * 0.8, w * 0.7);
    r2.addColorStop(0, 'rgba(255, 122, 24, 0.3)');
    r2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = r2;
    ctx.fillRect(0, 0, w, h);
  } else if (templateName === 'cyber') {
    ctx.fillStyle = '#040810';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
    ctx.lineWidth = 2;
    const stepG = 45;
    for (let gx = 0; gx < w; gx += stepG) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += stepG) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }
    
    const rCyber = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.8);
    rCyber.addColorStop(0, 'rgba(9, 103, 255, 0.25)');
    rCyber.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rCyber;
    ctx.fillRect(0, 0, w, h);
  } else if (templateName === 'aurora') {
    // Aurora Borealis — deep teal/green/purple sweep
    const gAurora = ctx.createLinearGradient(0, 0, w, h);
    gAurora.addColorStop(0, '#02060f');
    gAurora.addColorStop(0.45, '#060d18');
    gAurora.addColorStop(1, '#03070d');
    ctx.fillStyle = gAurora;
    ctx.fillRect(0, 0, w, h);
    
    const rA1 = ctx.createRadialGradient(w * 0.15, h * 0.3, 0, w * 0.15, h * 0.3, w * 0.75);
    rA1.addColorStop(0, 'rgba(0, 230, 180, 0.35)');
    rA1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rA1;
    ctx.fillRect(0, 0, w, h);
    
    const rA2 = ctx.createRadialGradient(w * 0.85, h * 0.7, 0, w * 0.85, h * 0.7, w * 0.65);
    rA2.addColorStop(0, 'rgba(139, 44, 255, 0.4)');
    rA2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rA2;
    ctx.fillRect(0, 0, w, h);
    
    const rA3 = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, w * 0.5);
    rA3.addColorStop(0, 'rgba(0, 200, 255, 0.2)');
    rA3.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rA3;
    ctx.fillRect(0, 0, w, h);
  } else { // minimal
    const gMin = ctx.createLinearGradient(0, 0, 0, h);
    gMin.addColorStop(0, '#0f1015');
    gMin.addColorStop(1, '#050608');
    ctx.fillStyle = gMin;
    ctx.fillRect(0, 0, w, h);
  }
  
  const bottomBarH = Math.round(h * 0.005) || 4;
  const gBar = ctx.createLinearGradient(0, 0, w, 0);
  gBar.addColorStop(0, '#0967ff');
  gBar.addColorStop(0.33, '#8b2cff');
  gBar.addColorStop(0.66, '#e33495');
  gBar.addColorStop(1, '#ff7a18');
  ctx.fillStyle = gBar;
  ctx.fillRect(0, h - bottomBarH, w, bottomBarH);
  
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '900 ' + Math.round(w * 0.03) + 'px Inter, sans-serif';
  ctx.fillText('HEALTHCARE', w * 0.07, h * 0.06);
  ctx.font = '800 ' + Math.round(w * 0.016) + 'px Inter, sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('CONFERENCE', w * 0.07, h * 0.06 + w * 0.035);
  
  drawGMLogo(ctx, w * 0.93, h * 0.075, w * 0.04);
  
  const drawAvatarOnCanvas = (img, x, y, size, glowColor = '#8b2cff') => {
    ctx.save();
    const radialAv = ctx.createRadialGradient(x, y, 0, x, y, size * 0.75);
    radialAv.addColorStop(0, glowColor + '66');
    radialAv.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radialAv;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    if (templateName === 'cyber') {
      ctx.roundRect(x - size/2, y - size/2, size, size, 20);
    } else {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
    }
    ctx.clip();
    if (img) {
      ctx.drawImage(img, x - size/2, y - size/2, size, size);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - size/2, y - size/2, size, size);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold ' + Math.round(size * 0.35) + 'px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HC', x, y);
    }
    ctx.restore();
    ctx.beginPath();
    if (templateName === 'cyber') {
      ctx.roundRect(x - size/2, y - size/2, size, size, 20);
      ctx.strokeStyle = '#e33495';
      ctx.lineWidth = 5;
      ctx.stroke();
    } else if (templateName === 'neon') {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 5;
      ctx.stroke();
    } else {
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  
  if (layout === 'individual' && s1) {
    const img1 = await preloadImage(s1.processedPhoto || s1.originalPhoto);
    const badgeY = h * 0.16;
    const badgeH = Math.round(w * 0.04);
    const badgeW = Math.round(w * 0.32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(w * 0.07, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 ' + Math.round(w * 0.015) + 'px Inter, sans-serif';
    ctx.fillText(`FÓRUM ${s1.forum.toUpperCase()}`, w * 0.09, badgeY + badgeH * 0.25);
    let ax = w / 2, ay = h * 0.44, asize = w * 0.3;
    if (presetName === 'story') { ax = w / 2; ay = h * 0.4; asize = w * 0.35; }
    else if (presetName === 'banner') { ax = w * 0.24; ay = h * 0.5; asize = h * 0.45; }
    else if (presetName === 'site') { ax = w / 2; ay = h * 0.4; asize = w * 0.32; }
    const glow = s1.forum === 'Tecnologia' ? '#0967ff' : (s1.forum === 'Infraestrutura' ? '#e33495' : '#ff7a18');
    drawAvatarOnCanvas(img1, ax, ay, asize, glow);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (presetName === 'feed') {
      ctx.font = '900 ' + Math.round(w * 0.04) + 'px Inter, sans-serif';
      ctx.fillText(s1.name.toUpperCase(), w / 2, h * 0.65);
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold ' + Math.round(w * 0.02) + 'px Inter, sans-serif';
      ctx.fillText(`${s1.role} • ${s1.company}`, w / 2, h * 0.71);
    } else if (presetName === 'story') {
      ctx.font = '900 ' + Math.round(w * 0.048) + 'px Inter, sans-serif';
      ctx.fillText(s1.name.toUpperCase(), w / 2, h * 0.62);
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold ' + Math.round(w * 0.024) + 'px Inter, sans-serif';
      ctx.fillText(s1.role, w / 2, h * 0.68);
      ctx.fillText(s1.company, w / 2, h * 0.72);
    } else if (presetName === 'banner') {
      ctx.textAlign = 'left';
      ctx.font = '900 ' + Math.round(w * 0.035) + 'px Inter, sans-serif';
      ctx.fillText(s1.name.toUpperCase(), w * 0.44, h * 0.4);
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold ' + Math.round(w * 0.02) + 'px Inter, sans-serif';
      ctx.fillText(`${s1.role} • ${s1.company}`, w * 0.44, h * 0.48);
    } else {
      ctx.font = '900 ' + Math.round(w * 0.044) + 'px Inter, sans-serif';
      ctx.fillText(s1.name.toUpperCase(), w / 2, h * 0.63);
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold ' + Math.round(w * 0.022) + 'px Inter, sans-serif';
      ctx.fillText(`${s1.role} • ${s1.company}`, w / 2, h * 0.69);
    }
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = '800 ' + Math.round(w * 0.018) + 'px Inter, sans-serif';
    ctx.fillText('17 A 20 DE SETEMBRO DE 2026 • HOTEL JP - RIBEIRÃO PRETO/SP', w / 2, h * 0.9);
  }
  else if (layout === 'duplo' && s1 && s2) {
    const img1 = await preloadImage(s1.processedPhoto || s1.originalPhoto);
    const img2 = await preloadImage(s2.processedPhoto || s2.originalPhoto);
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.round(w * 0.016) + 'px Inter, sans-serif';
    ctx.fillText('MANDATO DO FUTURO', w / 2, h * 0.16);
    drawGradientText(ctx, 'LIDERAR, DECIDIR E TRANSFORMAR A SAÚDE', w / 2, h * 0.2, '900 ' + Math.round(w * 0.024) + 'px Inter, sans-serif', 'center', 'top');
    const badgeText = s1.forum === s2.forum ? `FÓRUM DE ${s1.forum.toUpperCase()}` : 'CURADORIA ESTRATÉGICA';
    const badgeY = h * 0.27;
    const badgeH = Math.round(w * 0.038);
    const badgeW = Math.round(w * 0.28);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - badgeW / 2, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 ' + Math.round(w * 0.014) + 'px Inter, sans-serif';
    ctx.fillText(badgeText, w / 2, badgeY + badgeH * 0.25);
    let ax1 = w * 0.32, ax2 = w * 0.68, ay = h * 0.52, asize = w * 0.22;
    if (presetName === 'story') {
      asize = w * 0.28;
    } else if (presetName === 'banner') {
      ax1 = w * 0.3; ax2 = w * 0.7; ay = h * 0.58; asize = h * 0.38;
    }
    const glowColor1 = s1.forum === 'Tecnologia' ? '#0967ff' : (s1.forum === 'Infraestrutura' ? '#e33495' : '#ff7a18');
    const glowColor2 = s2.forum === 'Tecnologia' ? '#0967ff' : (s2.forum === 'Infraestrutura' ? '#e33495' : '#ff7a18');
    if (presetName === 'story') {
      // Story: two avatars side-by-side vertically centered
      const storyAY = h * 0.50;
      const storyAX1 = w * 0.28;
      const storyAX2 = w * 0.72;
      drawNeuralLines(ctx, w/2, storyAY, w * 0.22, 12);
      drawAvatarOnCanvas(img1, storyAX1, storyAY, asize, glowColor1);
      drawAvatarOnCanvas(img2, storyAX2, storyAY, asize, glowColor2);
    } else {
      drawNeuralLines(ctx, w/2, ay, w * 0.25, 16);
      drawAvatarOnCanvas(img1, ax1, ay, asize, glowColor1);
      drawAvatarOnCanvas(img2, ax2, ay, asize, glowColor2);
    }
    ctx.textAlign = 'center';
    const drawSpeakerLabel = (speaker, x, y) => {
      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.font = '800 ' + Math.round(w * 0.014) + 'px Inter, sans-serif';
      ctx.fillText(speaker.type.toUpperCase(), x, y);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 ' + Math.round(w * 0.02) + 'px Inter, sans-serif';
      ctx.fillText(speaker.name.toUpperCase(), x, y + w * 0.022);
      const metrics = ctx.measureText(speaker.name.toUpperCase());
      const uW = metrics.width;
      const gLine = ctx.createLinearGradient(x - uW/2, 0, x + uW/2, 0);
      gLine.addColorStop(0, '#0967ff');
      gLine.addColorStop(1, '#ff7a18');
      ctx.fillStyle = gLine;
      ctx.fillRect(x - uW/2, y + w * 0.046, uW, 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 ' + Math.round(w * 0.015) + 'px Inter, sans-serif';
      ctx.fillText(speaker.role, x, y + w * 0.06);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '700 ' + Math.round(w * 0.013) + 'px Inter, sans-serif';
      ctx.fillText(speaker.company, x, y + w * 0.08);
      ctx.restore();
    };
    if (presetName === 'story') {
      const storyLabelY = h * 0.50 + asize/2 + h * 0.025;
      drawSpeakerLabel(s1, w * 0.28, storyLabelY);
      drawSpeakerLabel(s2, w * 0.72, storyLabelY);
    } else {
      const labelY = ay + asize/2 + w * 0.03;
      drawSpeakerLabel(s1, ax1, labelY);
      drawSpeakerLabel(s2, ax2, labelY);
    }
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';
    ctx.font = '800 ' + Math.round(w * 0.015) + 'px Inter, sans-serif';
    ctx.fillText('📅 17 A 20 DE SETEMBRO • HOTEL JP - RIBEIRÃO PRETO/SP', w * 0.07, h * 0.91);
    ctx.textAlign = 'right';
    ctx.fillText('REALIZAÇÃO GRUPO MÍDIA', w * 0.93, h * 0.91);
  }
  else if (layout === 'grid') {
    const tech = speakers.filter(s => s.forum === 'Tecnologia' && s.eventId === activeEvent).slice(0, 2);
    const infra = speakers.filter(s => s.forum === 'Infraestrutura' && s.eventId === activeEvent).slice(0, 2);
    const gestao = speakers.filter(s => s.forum === 'Gestão' && s.eventId === activeEvent).slice(0, 2);
    const all6 = [...tech, ...infra, ...gestao];
    const images = await Promise.all(all6.map(s => preloadImage(s.processedPhoto || s.originalPhoto)));
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = 'bold ' + Math.round(w * 0.014) + 'px Inter, sans-serif';
    ctx.fillText('MANDATO DO FUTURO', w / 2, h * 0.14);
    drawGradientText(ctx, 'LIDERAR, DECIDIR E TRANSFORMAR A SAÚDE', w / 2, h * 0.175, '900 ' + Math.round(w * 0.024) + 'px Inter, sans-serif', 'center', 'top');
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 ' + Math.round(w * 0.016) + 'px Inter, sans-serif';
    ctx.fillText('CURADORIA ESTRATÉGICA 2026', w / 2, h * 0.24);
    drawNeuralLines(ctx, w/2, h * 0.58, w * 0.35, 18);
    const colW = w * 0.27;
    const colH = h * 0.54;
    const colY = h * 0.29;
    const colX = [w * 0.07, w * 0.365, w * 0.66];
    const forumLabels = ['TECNOLOGIA', 'INFRAESTRUTURA', 'GESTÃO'];
    const forumColors = ['#0967ff', '#e33495', '#ff7a18'];
    for (let c = 0; c < 3; c++) {
      const cx = colX[c];
      ctx.save();
      ctx.strokeStyle = forumColors[c] + '55';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255,255,255,0.01)';
      ctx.beginPath();
      ctx.roundRect(cx, colY, colW, colH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = forumColors[c] + '22';
      ctx.beginPath();
      ctx.roundRect(cx + colW*0.05, colY + colH*0.04, colW*0.9, colH*0.1, 6);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillStyle = forumColors[c];
      ctx.font = '900 ' + Math.round(colW * 0.065) + 'px Inter, sans-serif';
      ctx.fillText(`FÓRUM ${forumLabels[c]}`, cx + colW/2, colY + colH*0.065);
      const colSpeakers = c === 0 ? tech : (c === 1 ? infra : gestao);
      for (let sIdx = 0; sIdx < 2; sIdx++) {
        const speaker = colSpeakers[sIdx];
        if (!speaker) continue;
        const overallIdx = all6.indexOf(speaker);
        const img = images[overallIdx];
        const sy = colY + colH * 0.2 + sIdx * colH * 0.38;
        const avX = cx + colW * 0.25;
        const avY = sy + colH * 0.12;
        const avSize = colW * 0.36;
        drawAvatarOnCanvas(img, avX, avY, avSize, forumColors[c]);
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 ' + Math.round(colW * 0.068) + 'px Inter, sans-serif';
        ctx.fillText(speaker.name.toUpperCase(), cx + colW * 0.48, avY - colH * 0.04);
        ctx.fillStyle = forumColors[c];
        ctx.fillRect(cx + colW * 0.48, avY - colH * 0.015, colW * 0.45, 1.5);
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 ' + Math.round(colW * 0.048) + 'px Inter, sans-serif';
        ctx.fillText(speaker.role, cx + colW * 0.48, avY + colH * 0.02);
        ctx.fillStyle = '#9ca3af';
        ctx.font = '700 ' + Math.round(colW * 0.042) + 'px Inter, sans-serif';
        ctx.fillText(speaker.company, cx + colW * 0.48, avY + colH * 0.06);
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = '800 ' + Math.round(w * 0.016) + 'px Inter, sans-serif';
    ctx.fillText('17 A 20 DE SETEMBRO DE 2026 • HOTEL JP - RIBEIRÃO PRETO/SP • REALIZAÇÃO GRUPO MÍDIA', w/2, h * 0.91);
  }
  if (download) {
    const link = document.createElement('a');
    link.download = `criativo_${activeEvent}_${layout}_${presetName}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logDev('api', `POST /api/assets - 201 Created (Asset gerado: ${layout} - ${presetName})`);
  }
  resolve(canvas.toDataURL('image/png'));
  }); // close Promise
}

// Single preset download button handlers
$('#downloadFeedSingleBtn').addEventListener('click', () => {
  const template = $('#genTemplateSelect').value;
  renderPresetToCanvas('feed', template, true);
});

$('#downloadStorySingleBtn').addEventListener('click', () => {
  const template = $('#genTemplateSelect').value;
  renderPresetToCanvas('story', template, true);
});

$('#downloadBannerSingleBtn').addEventListener('click', () => {
  const template = $('#genTemplateSelect').value;
  renderPresetToCanvas('banner', template, true);
});

$('#downloadSiteSingleBtn').addEventListener('click', () => {
  const template = $('#genTemplateSelect').value;
  renderPresetToCanvas('site', template, true);
});

// Download selected presets
$('#downloadSelectedPresetsBtn').addEventListener('click', async () => {
  const speaker = speakers.find(s => s.id === activeGenSpeakerId);
  const template = $('#genTemplateSelect').value;
  
  const selected = [
    { id: 'checkFeed', name: 'feed' },
    { id: 'checkStory', name: 'story' },
    { id: 'checkBanner', name: 'banner' },
    { id: 'checkSite', name: 'site' }
  ].filter(p => $(`#${p.id}`).checked);
  
  if (selected.length === 0) {
    showToast('Selecione ao menos um formato de saída.');
    return;
  }
  
  const btn = $('#downloadSelectedPresetsBtn');
  btn.disabled = true;
  btn.textContent = `Gerando 0/${selected.length}...`;
  
  logDev('api', `POST /api/speakers/${speaker ? speaker.id : 'bulk'}/generate-assets - 200 OK`);
  
  for (let i = 0; i < selected.length; i++) {
    btn.textContent = `Gerando ${i + 1}/${selected.length}...`;
    await renderPresetToCanvas(selected[i].name, template, true);
    await new Promise(r => setTimeout(r, 200)); // brief pause between downloads
  }
  
  btn.disabled = false;
  btn.textContent = 'Download das Peças Selecionadas';
  showToast(`✓ ${selected.length} peça(s) gerada(s) com sucesso!`);
});

// Header generate all cards trigger
$('#headerGenerateAll').addEventListener('click', async () => {
  const list = speakers.filter(s => s.eventId === activeEvent && s.status === 'Publicado');
  if (list.length === 0) {
    showToast('Nenhum palestrante publicado para geração em lote.');
    return;
  }
  
  const template = 'neon';
  const btn = $('#headerGenerateAll');
  btn.disabled = true;
  
  logDev('api', `POST /api/events/${activeEvent}/generate-bulk - 200 OK (Simulando fila BullMQ + Redis)`);
  logDev('prisma', `// Batch job enqueued for ${list.length} speakers`);
  
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    btn.textContent = `Gerando ${i + 1}/${list.length}: ${s.name.split(' ')[0]}...`;
    showToast(`Gerando ${i + 1}/${list.length}: ${s.name}`);
    await renderPresetToCanvas('feed', template, true, s);
    await new Promise(r => setTimeout(r, 120));
  }
  
  btn.disabled = false;
  btn.textContent = 'Gerar todos os cards';
  showToast(`✓ ${list.length} cards Feed gerados!`);
});

// ==========================================
// DATA EXPORTS & INITIAL SETUPS
// ==========================================

$('#exportJsonBtn').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(speakers, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", dataStr);
  link.setAttribute("download", "healthcare_speakers.json");
  link.click();
  logDev('system', 'Banco de dados exportado em JSON.');
  showToast('Exportação concluída (JSON).');
});

$('#exportCsvBtn').addEventListener('click', () => {
  let csv = 'ID,Nome,Cargo,Empresa,Fórum,Tipo,Status,Exibição,Site,Feed,Story\n';
  speakers.forEach(s => {
    csv += `"${s.id}","${s.name}","${s.role}","${s.company}","${s.forum}","${s.type}","${s.status}",${s.displayOrder},${s.visibleSite},${s.visibleFeed},${s.visibleStory}\n`;
  });
  
  const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  const link = document.createElement('a');
  link.setAttribute("href", dataStr);
  link.setAttribute("download", "healthcare_speakers.csv");
  link.click();
  logDev('system', 'Banco de dados exportado em CSV.');
  showToast('Exportação concluída (CSV).');
});

// Filters event listeners
['searchInput', 'forumFilter', 'statusFilter', 'visibilityFilter', 'sortFilter'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    renderSpeakers();
    
    // Log ORM selection changes
    const prismaWhere = { eventId: activeEvent };
    if ($('#forumFilter').value !== 'all') prismaWhere.forum = $('#forumFilter').value;
    if ($('#statusFilter').value !== 'all') prismaWhere.status = $('#statusFilter').value;
    const searchVal = $('#searchInput').value;
    if (searchVal) prismaWhere.name = { contains: searchVal };
    
    const sortVal = $('#sortFilter').value;
    const orderObj = sortVal === 'ordem' ? { displayOrder: 'asc' } : (sortVal === 'nome' ? { name: 'asc' } : { createdAt: 'desc' });
    
    triggerGetSpeakersLog(prismaWhere, orderObj);
  });
});

// Role switcher handler
$('#roleSelect').addEventListener('change', (e) => {
  currentRole = e.target.value;
  localStorage.setItem(ROLE_KEY, currentRole);
  applyRoleRestrictions();
});

// Event switcher handler
$('#eventSelect').addEventListener('change', (e) => {
  activeEvent = e.target.value;
  localStorage.setItem(EVENT_KEY, activeEvent);
  renderSpeakers();
  logDev('system', `Filtro de evento alterado para: ${activeEvent.toUpperCase()}`);
});

// Dev Console toggle/minimize
$('#toggleConsoleBtn').addEventListener('click', () => {
  const devConsole = $('#devConsole');
  devConsole.classList.toggle('collapsed');
  $('#toggleConsoleBtn').textContent = devConsole.classList.contains('collapsed') ? 'Expandir' : 'Minimizar';
});

$('#clearLogsBtn').addEventListener('click', () => {
  $('#consoleLogs').innerHTML = '';
  logDev('system', 'Histórico de logs limpo.');
});

// Responsive Sidebar toggle
$('.menu-btn').addEventListener('click', () => $('.sidebar').classList.toggle('open'));

// Initial configurations load
logDev('system', 'Dashboard administrativo do Healthcare CMS inicializado com sucesso.');
logDev('prisma', 'Banco de dados relacional (simulado via localStorage) está ativo.');

applyRoleRestrictions();
renderSpeakers();
