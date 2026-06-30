// ================================================================
//  HEALTHCARE CONFERENCE CMS — FIREBASE INTEGRATION
//  ================================================================
//  🔑 CONFIGURE SUAS CREDENCIAIS ABAIXO:
//
//  1. Acesse: https://console.firebase.google.com
//  2. Seu projeto → ⚙️ Configurações → Seus apps → SDK setup
//  3. Copie o objeto firebaseConfig e cole aqui
// ================================================================

const firebaseConfig = {
  apiKey:            "COLE_SUA_API_KEY_AQUI",
  authDomain:        "COLE_SEU_PROJECT_ID.firebaseapp.com",
  projectId:         "COLE_SEU_PROJECT_ID",
  storageBucket:     "COLE_SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID",
  appId:             "COLE_SEU_APP_ID"
};

// ================================================================
//  GLOBALS COMPARTILHADOS COM script.js
// ================================================================
let _db             = null;   // Firestore instance
let _auth           = null;   // Firebase Auth instance
let _firestoreUnsub = null;   // Unsubscribe fn para onSnapshot
let _currentUser    = null;   // Firebase user object
let _firebaseReady  = false;  // true quando Firebase inicializou

// ================================================================
//  INICIALIZAÇÃO
// ================================================================
(function bootstrap() {
  const isPlaceholder = firebaseConfig.apiKey.startsWith('COLE');

  if (isPlaceholder) {
    console.warn('[Firebase] ⚠️  firebaseConfig ainda tem valores placeholder.');
    const notice = document.getElementById('firebasePlaceholderNotice');
    if (notice) notice.style.display = 'flex';
    _startDemoMode();
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
    _db   = firebase.firestore();
    _auth = firebase.auth();

    // Habilita persistência offline (dados disponíveis sem internet)
    _db.enablePersistence({ synchronizeTabs: true }).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('[Firestore] Persistência offline: múltiplas abas abertas.');
      } else if (err.code === 'unimplemented') {
        console.warn('[Firestore] Este navegador não suporta persistência offline.');
      }
    });

    _firebaseReady = true;
    _initAuthStateListener();

  } catch (err) {
    console.error('[Firebase] Erro fatal na inicialização:', err);
    _startDemoMode();
  }
})();

// ================================================================
//  MODO DEMO — Fallback localStorage (Firebase não configurado)
// ================================================================
function _startDemoMode() {
  const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  speakers     = cached || generateSeedSpeakers();
  if (!cached) localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));

  _showApp(null);
  applyRoleRestrictions();
  renderSpeakers();

  logDev('system', '⚠️  MODO DEMO (localStorage). Para acesso remoto, configure o firebaseConfig em firebase.js.');
}

// ================================================================
//  AUTH STATE LISTENER
// ================================================================
function _initAuthStateListener() {
  if (!_auth) { _startDemoMode(); return; }

  _auth.onAuthStateChanged(async (user) => {
    if (user) {
      _currentUser = user;
      _setConnectionStatus(true);

      try {
        await _loadUserRole(user.uid);
        await _migrateLocalDataIfNeeded();
        _setupFirestoreListener();
        _showApp(user);
        applyRoleRestrictions();
        logDev('api',    `GET /api/auth/me - 200 OK → ${user.email}`);
        logDev('prisma', `prisma.user.findUnique({ where: { uid: "${user.uid}" } })`);
      } catch (err) {
        logDev('system', `⚠️  Erro ao carregar sessão: ${err.message}`);
        _showApp(user);
        applyRoleRestrictions();
      }

    } else {
      _currentUser = null;
      speakers     = [];
      _setConnectionStatus(false);

      if (_firestoreUnsub) { _firestoreUnsub(); _firestoreUnsub = null; }
      _showLoginScreen();
    }
  });
}

// ================================================================
//  CONTROLE DE TELA — Login vs App
// ================================================================
function _showApp(user) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display    = '';

  if (user) {
    const emailEl  = document.getElementById('userEmailDisplay');
    const avatarEl = document.getElementById('userAvatarCircle');
    const roleEl   = document.getElementById('userRoleBadge');

    if (emailEl)  emailEl.textContent  = user.email;
    if (avatarEl) avatarEl.textContent = (user.email || '?')[0].toUpperCase();
    if (roleEl) {
      const labels = { admin: 'Administrador', editor: 'Editor', revisor: 'Revisor', viewer: 'Visualizador' };
      roleEl.textContent = labels[currentRole] || currentRole;
    }
  }

  logDev('system', `✅ Dashboard carregado. Usuário: ${user?.email || 'Demo (local)'}`);
  logDev('prisma', `Firestore conectado. Listener em tempo real ativo para evento: ${activeEvent}`);
}

function _showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appShell').style.display    = 'none';
  // Limpa formulário de login
  const form = document.getElementById('loginForm');
  if (form) form.reset();
  const err = document.getElementById('loginError');
  if (err) { err.classList.remove('visible'); err.style.display = 'none'; }
}

function _setConnectionStatus(online) {
  const el   = document.getElementById('firebaseStatus');
  const text = document.getElementById('firebaseStatusText');
  if (!el) return;
  el.className       = `firebase-status ${online ? 'online' : 'offline'}`;
  text.textContent   = online ? 'Firebase Online' : 'Offline';
}

// ================================================================
//  CARREGAR PAPEL DO USUÁRIO (Firestore → users/{uid})
// ================================================================
async function _loadUserRole(uid) {
  if (!_db || !uid) return;

  try {
    const snap = await _db.collection('users').doc(uid).get();

    if (snap.exists) {
      currentRole = snap.data().role || 'viewer';
    } else {
      // Auto-detectar papel pelo e-mail (conveniência inicial)
      const email = _currentUser?.email || '';
      if      (email.includes('admin'))   currentRole = 'admin';
      else if (email.includes('editor'))  currentRole = 'editor';
      else if (email.includes('revisor')) currentRole = 'revisor';
      else                                currentRole = 'viewer';

      // Cria documento de usuário no Firestore
      await _db.collection('users').doc(uid).set({
        email,
        role:      currentRole,
        name:      email.split('@')[0],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      logDev('prisma', `prisma.user.create({ data: { email: "${email}", role: "${currentRole}" } })`);
    }

    localStorage.setItem(ROLE_KEY, currentRole);

    // Sincroniza o select da UI com o papel real
    const sel = document.getElementById('roleSelect');
    if (sel) sel.value = currentRole;

    logDev('system', `Papel carregado do Firestore: ${currentRole.toUpperCase()}`);
  } catch (err) {
    currentRole = localStorage.getItem(ROLE_KEY) || 'viewer';
    logDev('system', `⚠️  Falha ao carregar papel: ${err.message}. Usando cache: ${currentRole}`);
  }
}

// ================================================================
//  LISTENER EM TEMPO REAL (Firestore → speakers collection)
// ================================================================
function _setupFirestoreListener() {
  if (_firestoreUnsub) _firestoreUnsub();
  if (!_db) return;

  _firestoreUnsub = _db.collection('speakers')
    .onSnapshot(
      (snapshot) => {
        speakers = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            ...d,
            id:        doc.id,
            createdAt: _toISOString(d.createdAt),
            updatedAt: _toISOString(d.updatedAt),
          };
        });

        // Cache local como backup offline
        localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
        renderSpeakers();

        logDev('sql', `SELECT * FROM "Speaker"; → ${speakers.length} registros`);
      },
      (err) => {
        logDev('system', `⚠️  Firestore snapshot error: ${err.message}`);
        _setConnectionStatus(false);

        // Fallback: usar cache do localStorage
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (cached) {
          speakers = cached;
          renderSpeakers();
          logDev('system', '📦 Usando cache local (localStorage). Reconecte para sincronizar.');
        }
      }
    );
}

// Converte Timestamp do Firestore ou string para ISO string
function _toISOString(val) {
  if (!val) return new Date().toISOString();
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  return val;
}

// ================================================================
//  MIGRAÇÃO: localStorage → Firestore (apenas na 1ª execução)
// ================================================================
async function _migrateLocalDataIfNeeded() {
  if (!_db) return;

  try {
    const check = await _db.collection('speakers').limit(1).get();
    if (!check.empty) return; // Banco já possui dados

    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    const seedData  = localData || generateSeedSpeakers();

    logDev('system', `🚀 Banco vazio. Migrando ${seedData.length} palestrantes para o Firestore...`);

    // Escreve em batches de 200 (limite do Firestore por batch)
    const BATCH_SIZE = 200;
    for (let i = 0; i < seedData.length; i += BATCH_SIZE) {
      const batch = _db.batch();
      seedData.slice(i, i + BATCH_SIZE).forEach(s => {
        const id  = s.id || _db.collection('speakers').doc().id;
        const ref = _db.collection('speakers').doc(id);
        batch.set(ref, { ...s, id });
      });
      await batch.commit();
    }

    logDev('system',  `✅ Migração concluída: ${seedData.length} registros no Firestore.`);
    logDev('prisma',  `prisma.speaker.createMany({ data: [...${seedData.length} speakers] })`);
    logDev('api',     `POST /api/events/${activeEvent}/seed - 201 Created`);
  } catch (err) {
    logDev('system', `⚠️  Migração falhou: ${err.message}`);
  }
}

// ================================================================
//  LOGIN FORM HANDLER
// ================================================================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('loginBtn');
  const label    = document.getElementById('loginBtnText');
  const spinner  = document.getElementById('loginSpinner');
  const errorEl  = document.getElementById('loginError');

  // Estado de carregamento
  btn.disabled          = true;
  label.style.display   = 'none';
  spinner.style.display = 'block';
  errorEl.classList.remove('visible');
  errorEl.style.display = 'none';

  const showErr = (msg) => {
    errorEl.textContent   = msg;
    errorEl.style.display = 'block';
    errorEl.classList.add('visible');
    btn.disabled          = false;
    label.style.display   = '';
    spinner.style.display = 'none';
  };

  try {
    if (!_auth) {
      throw { code: 'not-configured', message: '⚠️ Firebase não configurado. Substitua o firebaseConfig em firebase.js.' };
    }
    await _auth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged cuida da transição para o app

  } catch (err) {
    const errorMessages = {
      'auth/user-not-found':         'Usuário não encontrado.',
      'auth/wrong-password':         'Senha incorreta.',
      'auth/invalid-credential':     'E-mail ou senha incorretos.',
      'auth/invalid-email':          'Formato de e-mail inválido.',
      'auth/too-many-requests':      'Muitas tentativas. Aguarde alguns minutos.',
      'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
      'auth/user-disabled':          'Conta desativada. Contate o administrador.',
      'not-configured':              err.message,
    };
    showErr(errorMessages[err.code] || err.message || 'Erro ao entrar. Tente novamente.');
  }
});

// ================================================================
//  MOSTRAR/OCULTAR SENHA
// ================================================================
document.getElementById('togglePassBtn').addEventListener('click', () => {
  const input = document.getElementById('loginPassword');
  input.type  = input.type === 'password' ? 'text' : 'password';
});

// ================================================================
//  LOGOUT
// ================================================================
document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (!_auth) {
    _showLoginScreen();
    return;
  }
  try {
    await _auth.signOut();
    showToast('Sessão encerrada com sucesso.');
    logDev('api', 'POST /api/auth/logout - 200 OK');
  } catch (err) {
    showToast(`Erro ao sair: ${err.message}`);
  }
});
