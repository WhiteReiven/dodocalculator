import { BASE_TIER_RATES, BASE_DINOS, MUTATED_DINOS, RECURSOS_DATA, BP_CATEGORIES } from './data.js';

// --- ROLES DE ADMINISTRACIÓN Y CANAL DE DISCORD ---
const ADMIN_DISCORD_IDS = ['574721030732513306']; 
const ADMIN_USERNAMES = ['cuervitoblanco']; 
const DISCORD_MARKET_CHANNEL_URL = "https://discord.com/channels/880306217413668914/1060750333959213066";

// Función robusta para copiar al portapapeles sin bloqueos de navegador
async function copiarAlPortapapelesSeguro(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch (e) {
    console.warn('Fallback a execCommand por permiso bloqueado:', e);
  }

  // Fallback tradicional con textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Error al copiar:', err);
    return false;
  }
}

function isCurrentUserAdmin() {
  if (!currentUser) return false;
  const meta = currentUser.user_metadata || {};
  const discordId = meta.provider_id || meta.sub || '';
  const username = meta.name || meta.preferred_username || meta.user_name || '';
  return ADMIN_DISCORD_IDS.includes(discordId) || ADMIN_USERNAMES.includes(username.toLowerCase());
}

// --- PESTAÑAS PRINCIPALES ---
const tabs = {
  mutated: { btn: document.getElementById('tab-mutated'), sec: document.getElementById('section-mutated') },
  base: { btn: document.getElementById('tab-base'), sec: document.getElementById('section-base') },
  recursos: { btn: document.getElementById('tab-recursos'), sec: document.getElementById('section-recursos') },
  bp: { btn: document.getElementById('tab-bp'), sec: document.getElementById('section-bp') },
  market: { btn: document.getElementById('tab-marketplace'), sec: document.getElementById('section-marketplace') }
};

Object.keys(tabs).forEach(k => {
  if (tabs[k].btn && tabs[k].sec) {
    tabs[k].btn.addEventListener('click', () => {
      Object.keys(tabs).forEach(other => {
        if (tabs[other].btn) tabs[other].btn.classList.remove('active');
        if (tabs[other].sec) tabs[other].sec.classList.add('hidden');
      });
      tabs[k].btn.classList.add('active');
      tabs[k].sec.classList.remove('hidden');
    });
  }
});

// Helper genérico para autocompletado
function setupAutocomplete(inputEl, dropdownEl, listKeys, onSelect) {
  function renderList(query = '') {
    dropdownEl.innerHTML = '';
    const clean = query.toLowerCase().trim();
    const filtered = listKeys.filter(i => i.toLowerCase().includes(clean));

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'autocomplete-empty';
      emptyLi.textContent = 'Sin coincidencias';
      dropdownEl.appendChild(emptyLi);
      dropdownEl.classList.remove('hidden');
      return;
    }

    filtered.forEach(item => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.textContent = item;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = item;
        dropdownEl.classList.add('hidden');
        onSelect(item);
      });
      dropdownEl.appendChild(li);
    });

    dropdownEl.classList.remove('hidden');
  }

  inputEl.addEventListener('input', () => renderList(inputEl.value));
  inputEl.addEventListener('focus', () => renderList(inputEl.value));
  inputEl.addEventListener('blur', () => setTimeout(() => dropdownEl.classList.add('hidden'), 150));
}

// ==========================================
// 1. DINOS MUTADOS
// ==========================================
const STATS_MUTADOS = [
  { key: 'vida', label: 'VIDA', type: 'principal' },
  { key: 'dano', label: 'DAÑO', type: 'principal' },
  { key: 'peso', label: 'PESO', type: 'secundaria' },
  { key: 'energia', label: 'ENERGIA', type: 'secundaria' },
  { key: 'comida', label: 'COMIDA', type: 'secundaria' },
  { key: 'oxigeno', label: 'OXIGENO', type: 'secundaria' },
  { key: 'velocidad', label: 'VELOCIDAD', type: 'secundaria' }
];

const inputMutated = document.getElementById('search-mutated-dino');
const dropdownMutated = document.getElementById('dropdown-mutated-dino');
const mutatedStatsList = document.getElementById('mutated-stats-list');
const mutatedBasePriceEl = document.getElementById('mutated-base-price');
const priceUncasteredEl = document.getElementById('price-uncastered');
const priceCasteredEl = document.getElementById('price-castered');

let currentMutated = Object.keys(MUTATED_DINOS)[0] || '';

function initMutated() {
  const dinos = Object.keys(MUTATED_DINOS).sort();
  inputMutated.value = currentMutated;

  setupAutocomplete(inputMutated, dropdownMutated, dinos, (val) => {
    currentMutated = val;
    calculateMutated();
  });

  STATS_MUTADOS.forEach(stat => {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <input type="checkbox" id="chk-mut-${stat.key}" class="stat-checkbox">
      <label for="chk-mut-${stat.key}">${stat.label}</label>
      <input type="number" id="val-mut-${stat.key}" class="stat-input" value="0" min="0">
      <span class="stat-badge ${stat.type}">${stat.type.toUpperCase()}</span>
    `;
    mutatedStatsList.appendChild(row);
    row.querySelector('.stat-checkbox').addEventListener('change', calculateMutated);
    row.querySelector('.stat-input').addEventListener('input', calculateMutated);
  });

  calculateMutated();
}

function calculateMutated() {
  const basePrice = MUTATED_DINOS[currentMutated] || 0;
  mutatedBasePriceEl.textContent = `${basePrice.toLocaleString()} DodoCoins`;

  const fPrin = ((basePrice / 4) * 1.5) / 254;
  const fSecH = ((basePrice / 4) / 2) / 254;
  const fSecI = ((basePrice / 4) * 1.25) / 254;

  const chkVida = document.getElementById('chk-mut-vida')?.checked;
  const chkDano = document.getElementById('chk-mut-dano')?.checked;
  const hasPrin = chkVida || chkDano;

  let total = 0;
  if (chkVida) total += Number(document.getElementById('val-mut-vida')?.value || 0) * fPrin;
  if (chkDano) total += Number(document.getElementById('val-mut-dano')?.value || 0) * fPrin;

  const secKeys = ['peso', 'energia', 'comida', 'oxigeno', 'velocidad'];
  let countSec = 0;

  secKeys.forEach(k => {
    if (document.getElementById(`chk-mut-${k}`)?.checked) {
      const val = Number(document.getElementById(`val-mut-${k}`)?.value || 0);
      if (hasPrin) total += val * fSecH;
      else total += (countSec === 0) ? (val * fSecI) : (val * fSecH);
      countSec++;
    }
  });

  const sinCastrar = Math.round(total);
  priceUncasteredEl.textContent = `${sinCastrar.toLocaleString()} DodoCoins`;
  priceCasteredEl.textContent = `${Math.round(sinCastrar * 0.75).toLocaleString()} DodoCoins`;
}

// ==========================================
// 2. DINOS BASE
// ==========================================
const STATS_BASE = [
  { key: 'vida', label: 'VIDA', type: 'hp_dmg' },
  { key: 'dano', label: 'DAÑO', type: 'hp_dmg' },
  { key: 'energia', label: 'ENERGIA', type: 'eng_wgt' },
  { key: 'peso', label: 'PESO', type: 'eng_wgt' },
  { key: 'comida', label: 'COMIDA', type: 'other' },
  { key: 'oxigeno', label: 'OXIGENO', type: 'other' },
  { key: 'velocidad', label: 'VELOCIDAD', type: 'other' }
];

const inputBase = document.getElementById('search-base-dino');
const dropdownBase = document.getElementById('dropdown-base-dino');
const baseStatsGrid = document.getElementById('base-stats-grid');
const baseDinoTierEl = document.getElementById('base-dino-tier');
const baseTotalLvlEl = document.getElementById('base-total-lvl');
const basePriceTotalEl = document.getElementById('base-price-total');

let currentBase = Object.keys(BASE_DINOS)[0] || '';

function initBase() {
  const dinos = Object.keys(BASE_DINOS).sort();
  inputBase.value = currentBase;

  setupAutocomplete(inputBase, dropdownBase, dinos, (val) => {
    currentBase = val;
    calculateBase();
  });

  STATS_BASE.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card-input';
    card.innerHTML = `
      <label for="val-base-${stat.key}">${stat.label}</label>
      <input type="number" id="val-base-${stat.key}" class="stat-input" value="0" min="0">
    `;
    baseStatsGrid.appendChild(card);
    card.querySelector('input').addEventListener('input', calculateBase);
  });

  calculateBase();
}

function calculateBase() {
  const tier = BASE_DINOS[currentBase] ?? 4;
  baseDinoTierEl.textContent = `Tier ${tier}`;
  const rates = BASE_TIER_RATES[tier] || BASE_TIER_RATES[4];

  let totalPrice = 0;
  let totalLvl = 1;

  STATS_BASE.forEach(stat => {
    const val = Number(document.getElementById(`val-base-${stat.key}`)?.value || 0);
    totalLvl += val;
    if (stat.type === 'hp_dmg') totalPrice += val * rates.hp_dmg;
    else if (stat.type === 'eng_wgt') totalPrice += val * rates.eng_wgt;
    else totalPrice += val * rates.other;
  });

  baseTotalLvlEl.textContent = totalLvl.toString();
  basePriceTotalEl.textContent = `${Math.round(totalPrice).toLocaleString()} DodoCoins`;
}

// ==========================================
// 3. RECURSOS
// ==========================================
const inputRecurso = document.getElementById('search-recurso');
const dropdownRecurso = document.getElementById('dropdown-recurso');
const inputRecursoCant = document.getElementById('input-recurso-cant');
const recursoRateEl = document.getElementById('recurso-rate-info');
const recursoPriceTotalEl = document.getElementById('recurso-price-total');

let currentRecurso = "PERLA NEGRA";

function initRecursos() {
  const recursosList = Object.keys(RECURSOS_DATA).sort();
  inputRecurso.value = currentRecurso;

  setupAutocomplete(inputRecurso, dropdownRecurso, recursosList, (val) => {
    currentRecurso = val;
    calculateRecursos();
  });

  inputRecursoCant.addEventListener('input', calculateRecursos);
  calculateRecursos();
}

function calculateRecursos() {
  const rec = RECURSOS_DATA[currentRecurso] || { ddc: 1, cant: 1 };
  const cant = Math.max(0, Number(inputRecursoCant.value || 0));

  recursoRateEl.textContent = `${rec.cant} ${currentRecurso} = ${rec.ddc} DDC`;
  const totalDDC = Math.round((cant * rec.ddc) / rec.cant);
  recursoPriceTotalEl.textContent = `${totalDDC.toLocaleString()} DodoCoins`;
}

// ==========================================
// 4. BP ARMAS & MONTURAS
// ==========================================
const selectBpCategory = document.getElementById('select-bp-category');
const inputBpItem = document.getElementById('search-bp-item');
const dropdownBpItem = document.getElementById('dropdown-bp-item');
const bpF3PriceEl = document.getElementById('bp-f3-price');
const labelBpStat = document.getElementById('label-bp-stat');
const inputBpStat = document.getElementById('input-bp-stat');
const bpPriceTotalEl = document.getElementById('bp-price-total');

let currentBpCatKey = "BP_ARMA_755";
let currentBpItem = "SIERRA";

function initBP() {
  selectBpCategory.innerHTML = '';
  Object.keys(BP_CATEGORIES).forEach(catKey => {
    const opt = document.createElement('option');
    opt.value = catKey;
    opt.textContent = BP_CATEGORIES[catKey].label;
    selectBpCategory.appendChild(opt);
  });

  selectBpCategory.addEventListener('change', () => {
    currentBpCatKey = selectBpCategory.value;
    const cat = BP_CATEGORIES[currentBpCatKey];
    labelBpStat.textContent = `Indicar ${cat.statLabel} (Máx ${cat.maxStat})`;
    const items = Object.keys(cat.items).sort();
    currentBpItem = items[0] || '';
    inputBpItem.value = currentBpItem;
    inputBpStat.value = cat.ranges[0] || 100;
    updateBpAutocomplete();
    calculateBP();
  });

  inputBpStat.addEventListener('input', calculateBP);
  updateBpAutocomplete();
  calculateBP();
}

function updateBpAutocomplete() {
  const cat = BP_CATEGORIES[currentBpCatKey];
  const items = Object.keys(cat.items).sort();
  inputBpItem.value = currentBpItem;

  setupAutocomplete(inputBpItem, dropdownBpItem, items, (val) => {
    currentBpItem = val;
    calculateBP();
  });
}

function calculateBP() {
  const cat = BP_CATEGORIES[currentBpCatKey];
  const f3Price = cat.items[currentBpItem] || 0;
  bpF3PriceEl.textContent = `${f3Price.toLocaleString()} DDC`;

  const stat = Math.max(0, Number(inputBpStat.value || 0));
  const ranges = cat.ranges;
  const mults = cat.mults;

  const prices = mults.map(m => f3Price * m);

  let baseR = ranges[0];
  if (stat > ranges[0]) {
    const valid = ranges.filter(r => r <= stat);
    baseR = valid[valid.length - 1];
  }

  const idx = ranges.indexOf(baseR);
  const diff = Math.max(0, stat - baseR);
  const basePrice = prices[idx];

  let total = basePrice;
  if (idx < ranges.length - 1) {
    const nextR = ranges[idx + 1];
    const nextPrice = prices[idx + 1];
    const ratePerUnit = (nextPrice - basePrice) / (nextR - baseR);
    total = basePrice + (diff * ratePerUnit);
  }

  bpPriceTotalEl.textContent = `${Math.round(total).toLocaleString()} DodoCoins`;
}

// ==========================================
// 5. ESPECIALES: MEK & GACHA
// ==========================================
const GACHA_PRECIOS = {
  "ELEMENTO": 15000,
  "POLIMERO": 8000,
  "PERLA NEGRA": 8000,
  "METAL": 6000,
  "CRISTAL": 6000,
  "OBSIDIANA": 6000,
  "VARIOS": 4000
};

function initEspecialesBase() {
  const mekInput = document.getElementById('mek-level-input');
  const mekHelper = document.getElementById('mek-helper-text');
  const mekPriceBp = document.getElementById('mek-price-bp');
  const mekPriceFab = document.getElementById('mek-price-fab');

  const gachaSelect = document.getElementById('select-gacha-recurso');
  const gachaTotal = document.getElementById('gacha-price-total');

  function calcularMek() {
    if (!mekInput) return;
    const lvl = Number(mekInput.value);

    if (isNaN(lvl) || lvl < 150 || lvl > 540) {
      if (mekHelper) {
        mekHelper.textContent = "¡Error! Nivel permitido entre 150 y 540";
        mekHelper.classList.add("error");
      }
      if (mekPriceBp) mekPriceBp.textContent = "---";
      if (mekPriceFab) mekPriceFab.textContent = "---";
      return;
    }

    if (mekHelper) {
      mekHelper.textContent = "Nivel mínimo 150 · Máximo 540";
      mekHelper.classList.remove("error");
    }

    let bp = 6000;
    let fab = 5000;

    if (lvl <= 250) bp = 6000 + (lvl - 150) * 125;
    else bp = 18500 + (lvl - 250) * 230;

    if (lvl <= 250) fab = 5000 + (lvl - 150) * 70;
    else if (lvl <= 300) fab = 12000 + (lvl - 250) * 100;
    else fab = 17000 + (lvl - 300) * 137.5;

    if (mekPriceBp) mekPriceBp.textContent = Math.round(bp).toLocaleString();
    if (mekPriceFab) mekPriceFab.textContent = Math.round(fab).toLocaleString();
  }

  function calcularGacha() {
    if (!gachaSelect || !gachaTotal) return;
    const rec = gachaSelect.value;
    const precio = GACHA_PRECIOS[rec] || 4000;
    gachaTotal.textContent = precio.toLocaleString();
  }

  if (mekInput) mekInput.addEventListener('input', calcularMek);
  if (gachaSelect) gachaSelect.addEventListener('change', calcularGacha);

  calcularMek();
  calcularGacha();
}

// ==========================================
// 6. SUPABASE AUTH & IDENTIDAD
// ==========================================
const SUPABASE_URL = "https://wuxsgpbynwrubemamfzb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZKrh4YjvMrl8yiWLTwLYcQ_6pYn2Rdx";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let currentUser = null;

function getActiveDisplayName() {
  const custom = localStorage.getItem('wd_ingame_name');
  if (custom && custom.trim()) return custom.trim();

  if (!currentUser) return 'Sobreviviente';
  const meta = currentUser.user_metadata || {};
  return meta.full_name || meta.custom_claims?.global_name || meta.name || 'Sobreviviente';
}

function updateHeaderBadge() {
  const nameSpan = document.getElementById('user-discord-name');
  if (nameSpan) {
    if (isCurrentUserAdmin()) {
      nameSpan.innerHTML = `${getActiveDisplayName()} <span style="color:#ef4444; font-size:0.75rem; font-weight:800; border:1px solid #ef4444; border-radius:4px; padding:1px 5px; margin-left:4px;">ADMIN</span>`;
    } else {
      nameSpan.textContent = getActiveDisplayName();
    }
  }
}

function initIdentityModal() {
  const modal = document.getElementById('modal-identity');
  const preview = document.getElementById('identity-discord-preview');
  const groupInGame = document.getElementById('group-ingame-input');
  const inputInGame = document.getElementById('input-ingame-name');
  const btnSave = document.getElementById('btn-save-identity');
  const radios = document.getElementsByName('identity-type');
  const btnChange = document.getElementById('btn-change-identity');

  if (!modal) return null;

  radios.forEach(r => {
    r.addEventListener('change', () => {
      if (groupInGame) groupInGame.classList.toggle('hidden', r.value !== 'ingame');
    });
  });

  if (btnChange) {
    btnChange.addEventListener('click', () => {
      openIdentityModal();
    });
  }

  function openIdentityModal() {
    if (!currentUser) return;
    const meta = currentUser.user_metadata || {};
    const discordName = meta.full_name || meta.custom_claims?.global_name || meta.name || 'Discord User';
    if (preview) preview.textContent = discordName;

    const saved = localStorage.getItem('wd_ingame_name');
    if (saved) {
      if (radios[1]) radios[1].checked = true;
      if (groupInGame) groupInGame.classList.remove('hidden');
      if (inputInGame) inputInGame.value = saved;
    } else {
      if (radios[0]) radios[0].checked = true;
      if (groupInGame) groupInGame.classList.add('hidden');
    }
    modal.classList.remove('hidden');
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      let isIngame = false;
      radios.forEach(r => { if (r.checked && r.value === 'ingame') isIngame = true; });

      if (isIngame) {
        const val = inputInGame.value.trim();
        if (!val) {
          alert('Por favor, ingresa tu nombre In-Game o selecciona usar tu usuario de Discord.');
          return;
        }
        localStorage.setItem('wd_ingame_name', val);
      } else {
        localStorage.removeItem('wd_ingame_name');
      }

      modal.classList.add('hidden');
      updateHeaderBadge();
    });
  }

  return { openIdentityModal };
}

let identityManager = null;

async function initAuth() {
  if (!supabaseClient) return;

  identityManager = initIdentityModal();

  const btnLogin = document.getElementById('btn-login-discord');
  const btnLogout = document.getElementById('btn-logout');
  const userBadge = document.getElementById('user-profile-badge');
  const avatarImg = document.getElementById('user-discord-avatar');

  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
        options: { redirectTo: window.location.origin }
      });
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      window.location.reload();
    });
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  renderUser(session?.user || null);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    renderUser(session?.user || null);
  });

  function renderUser(user) {
    currentUser = user;
    if (user) {
      if (btnLogin) btnLogin.classList.add('hidden');
      if (userBadge) userBadge.classList.remove('hidden');

      const meta = user.user_metadata || {};
      const avatar = meta.avatar_url || meta.picture || 'https://cdn.discordapp.com/embed/avatars/0.png';

      if (avatarImg) avatarImg.src = avatar;
      updateHeaderBadge();

      if (!localStorage.getItem('wd_identity_prompted') && identityManager) {
        localStorage.setItem('wd_identity_prompted', 'true');
        identityManager.openIdentityModal();
      }
    } else {
      if (btnLogin) btnLogin.classList.remove('hidden');
      if (userBadge) userBadge.classList.add('hidden');
    }
  }
}

// ==========================================
// 7. SISTEMA DE MARKETPLACE
// ==========================================
function initMarketplace() {
  const tabMarket = document.getElementById('tab-marketplace');
  const btnOpenPublish = document.getElementById('btn-open-publish');
  const modalPublish = document.getElementById('modal-publish');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formPublish = document.getElementById('form-publish-listing');
  const btnSubmitListing = document.getElementById('btn-submit-listing');
  const gridListings = document.getElementById('market-listings-grid');
  const searchInput = document.getElementById('market-search-input');
  const filterCat = document.getElementById('market-filter-cat');

  // Input de imagen y preview
  const inputImageUrl = document.getElementById('pub-image-url');
  const previewBox = document.getElementById('pub-image-preview-box');
  const previewImg = document.getElementById('pub-image-preview');

  if (inputImageUrl && previewBox && previewImg) {
    inputImageUrl.addEventListener('input', () => {
      const url = inputImageUrl.value.trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        previewImg.src = url;
        previewBox.classList.remove('hidden');
      } else {
        previewBox.classList.add('hidden');
        previewImg.src = '';
      }
    });
  }

  // Modal Carga Masiva Excel
  const btnOpenBulk = document.getElementById('btn-open-bulk');
  const modalBulk = document.getElementById('modal-bulk');
  const btnCloseBulk = document.getElementById('btn-close-bulk');
  const btnDownloadTemplate = document.getElementById('btn-download-template');
  const bulkFileInput = document.getElementById('bulk-excel-file');
  const bulkStatusEl = document.getElementById('bulk-preview-status');
  const btnProcessBulk = document.getElementById('btn-process-bulk');

  // Parser Rápido
  const quickInput = document.getElementById('quick-parse-input');
  const btnQuick = document.getElementById('btn-apply-quick-parse');

  const catSelect = document.getElementById('pub-category');
  const dinoGroup = document.getElementById('group-pub-dino');
  const dinoInput = document.getElementById('pub-dino-name');
  const dinoDropdown = document.getElementById('dropdown-pub-dino');
  const tierBadge = document.getElementById('pub-tier-badge');

  const groupStatsMutated = document.getElementById('group-stats-mutated');
  const mutStatsList = document.getElementById('pub-mutated-stats-list');
  const mutCastradoChk = document.getElementById('pub-mut-castrado');

  const groupStatsBase = document.getElementById('group-stats-base');
  const baseStatsGridModal = document.getElementById('pub-base-stats-grid');
  const baseLvlCountEl = document.getElementById('pub-base-lvl-count');

  const gachaGroup = document.getElementById('group-pub-gacha');
  const gachaSelect = document.getElementById('pub-gacha-res');
  const mekGroup = document.getElementById('group-pub-mek');
  const mekLvlInput = document.getElementById('pub-mek-lvl');
  const mekTypeRadios = document.getElementsByName('mek-type');

  // Elementos BP / Armas y Monturas
  const bpGroup = document.getElementById('group-pub-bp');
  const bpSubcatSelect = document.getElementById('pub-bp-subcat');
  const bpItemInput = document.getElementById('pub-bp-item');
  const bpItemDropdown = document.getElementById('dropdown-pub-bp-item');
  const bpF3PriceEl = document.getElementById('pub-bp-f3-price');
  const bpLabelStat = document.getElementById('pub-label-bp-stat');
  const bpStatInput = document.getElementById('pub-bp-stat');

  const calculatedFloorSpan = document.getElementById('pub-calculated-floor');
  const floorLegend = document.getElementById('pub-floor-legend');
  const sellPriceInput = document.getElementById('pub-selling-price');
  const priceError = document.getElementById('pub-price-error');

  let activeFloorPrice = 0;
  let allListings = [];
  let editingListingId = null;
  let bulkValidatedRows = [];

  if (mutStatsList) {
    mutStatsList.innerHTML = '';
    STATS_MUTADOS.forEach(stat => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <input type="checkbox" id="pub-chk-mut-${stat.key}" class="stat-checkbox">
        <label for="pub-chk-mut-${stat.key}">${stat.label}</label>
        <input type="number" id="pub-val-mut-${stat.key}" class="stat-input" value="0" min="0">
        <span class="stat-badge ${stat.type}">${stat.type.toUpperCase()}</span>
      `;
      mutStatsList.appendChild(row);
      row.querySelector('.stat-checkbox').addEventListener('change', recalcularPiso);
      row.querySelector('.stat-input').addEventListener('input', recalcularPiso);
    });
  }

  if (baseStatsGridModal) {
    baseStatsGridModal.innerHTML = '';
    STATS_BASE.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'stat-card-input';
      card.innerHTML = `
        <label for="pub-val-base-${stat.key}">${stat.label}</label>
        <input type="number" id="pub-val-base-${stat.key}" class="stat-input" value="0" min="0">
      `;
      baseStatsGridModal.appendChild(card);
      card.querySelector('input').addEventListener('input', recalcularPiso);
    });
  }

  if (mutCastradoChk) mutCastradoChk.addEventListener('change', recalcularPiso);

  function obtenerCatalogoActual() {
    const cat = catSelect.value;
    if (cat === 'mutated') return Object.keys(MUTATED_DINOS || {}).sort();
    if (cat === 'base') return Object.keys(BASE_DINOS || {}).sort();
    return Array.from(new Set([...Object.keys(MUTATED_DINOS || {}), ...Object.keys(BASE_DINOS || {})])).sort();
  }

  function configurarSubcategoriasBp(catPrincipal) {
    if (!bpSubcatSelect) return;
    bpSubcatSelect.innerHTML = '';

    const claves = catPrincipal === 'bp_arma' 
      ? ['BP_ARMA_755', 'BP_ARMA_325', 'ARMA_755', 'ARMA_325']
      : ['BP_MONTURA', 'MONTURA'];

    claves.forEach(k => {
      if (BP_CATEGORIES[k]) {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = BP_CATEGORIES[k].label;
        bpSubcatSelect.appendChild(opt);
      }
    });

    actualizarItemsBp();
  }

  function actualizarItemsBp() {
    const subcatKey = bpSubcatSelect.value;
    const catData = BP_CATEGORIES[subcatKey];
    if (!catData) return;

    if (bpLabelStat) bpLabelStat.textContent = `Indicar ${catData.statLabel} (Máx ${catData.maxStat})`;
    const items = Object.keys(catData.items).sort();
    if (bpItemInput) bpItemInput.value = items[0] || '';
    if (bpStatInput) bpStatInput.value = catData.ranges[0] || 100;

    setupAutocomplete(bpItemInput, bpItemDropdown, items, (seleccionado) => {
      bpItemInput.value = seleccionado;
      recalcularPiso();
    });

    recalcularPiso();
  }

  if (bpSubcatSelect) bpSubcatSelect.addEventListener('change', actualizarItemsBp);
  if (bpStatInput) bpStatInput.addEventListener('input', recalcularPiso);

  if (catSelect) {
    catSelect.addEventListener('change', () => {
      const cat = catSelect.value;
      const isFixedItem = (cat === 'gacha' || cat === 'mek' || cat === 'bp_arma' || cat === 'bp_montura');
      const isBp = (cat === 'bp_arma' || cat === 'bp_montura');

      if (dinoGroup) dinoGroup.classList.toggle('hidden', isFixedItem);
      if (groupStatsMutated) groupStatsMutated.classList.toggle('hidden', cat !== 'mutated');
      if (groupStatsBase) groupStatsBase.classList.toggle('hidden', cat !== 'base');
      if (gachaGroup) gachaGroup.classList.toggle('hidden', cat !== 'gacha');
      if (mekGroup) mekGroup.classList.toggle('hidden', cat !== 'mek');
      if (bpGroup) bpGroup.classList.toggle('hidden', !isBp);

      if (isBp) {
        configurarSubcategoriasBp(cat);
      }

      recalcularPiso();
    });
  }

  if (dinoInput && dinoDropdown) {
    dinoInput.addEventListener('input', () => {
      const val = dinoInput.value.trim().toLowerCase();
      dinoDropdown.innerHTML = '';

      if (!val) {
        dinoDropdown.classList.add('hidden');
        if (tierBadge) tierBadge.textContent = '';
        recalcularPiso();
        return;
      }

      const catalog = obtenerCatalogoActual();
      const matches = catalog.filter(d => d.toLowerCase().includes(val));

      if (matches.length > 0) {
        matches.slice(0, 5).forEach(match => {
          const li = document.createElement('li');
          li.textContent = match;
          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            dinoInput.value = match;
            dinoDropdown.classList.add('hidden');
            verificarDino(match);
          });
          dinoDropdown.appendChild(li);
        });
        dinoDropdown.classList.remove('hidden');
      } else {
        dinoDropdown.classList.add('hidden');
        if (tierBadge) tierBadge.textContent = 'Criatura personalizada / No listada';
        recalcularPiso();
      }
    });

    dinoInput.addEventListener('blur', () => {
      setTimeout(() => dinoDropdown.classList.add('hidden'), 200);
    });
  }

  function verificarDino(nombre) {
    const cat = catSelect.value;
    if (cat === 'base') {
      const tier = BASE_DINOS[nombre];
      if (tierBadge) tierBadge.textContent = tier ? `Oficial: Tier ${tier}` : '';
    } else if (cat === 'mutated') {
      const base = MUTATED_DINOS[nombre];
      if (tierBadge) tierBadge.textContent = base ? `Precio Base: ${base.toLocaleString()} DDC` : '';
    }
    recalcularPiso();
  }

  function recalcularPiso() {
    if (!catSelect || !calculatedFloorSpan || !floorLegend) return;
    const cat = catSelect.value;
    activeFloorPrice = 0;
    floorLegend.textContent = "Calculado según stats oficiales";

    if (cat === 'mutated') {
      const dino = dinoInput ? dinoInput.value.trim() : '';
      const basePrice = MUTATED_DINOS[dino] || 0;

      if (basePrice > 0) {
        const fPrin = ((basePrice / 4) * 1.5) / 254;
        const fSecH = ((basePrice / 4) / 2) / 254;
        const fSecI = ((basePrice / 4) * 1.25) / 254;

        const chkVida = document.getElementById('pub-chk-mut-vida')?.checked;
        const chkDano = document.getElementById('pub-chk-mut-dano')?.checked;
        const hasPrin = chkVida || chkDano;

        let total = 0;
        if (chkVida) total += Number(document.getElementById('pub-val-mut-vida')?.value || 0) * fPrin;
        if (chkDano) total += Number(document.getElementById('pub-val-mut-dano')?.value || 0) * fPrin;

        const secKeys = ['peso', 'energia', 'comida', 'oxigeno', 'velocidad'];
        let countSec = 0;

        secKeys.forEach(k => {
          if (document.getElementById(`pub-chk-mut-${k}`)?.checked) {
            const val = Number(document.getElementById(`pub-val-mut-${k}`)?.value || 0);
            if (hasPrin) total += val * fSecH;
            else total += (countSec === 0) ? (val * fSecI) : (val * fSecH);
            countSec++;
          }
        });

        if (mutCastradoChk?.checked) total *= 0.75;
        activeFloorPrice = Math.round(total);
        floorLegend.textContent = mutCastradoChk?.checked ? 'Piso oficial (Castrado)' : 'Piso oficial (Sin castrar)';
      } else {
        activeFloorPrice = 1000;
        floorLegend.textContent = 'Dino sin tasa base fija';
      }
    } else if (cat === 'base') {
      const dino = dinoInput ? dinoInput.value.trim() : '';
      const tier = BASE_DINOS[dino] ?? 4;
      const rates = BASE_TIER_RATES[tier] || BASE_TIER_RATES[4];

      let totalPrice = 0;
      let totalLvl = 1;

      STATS_BASE.forEach(stat => {
        const val = Number(document.getElementById(`pub-val-base-${stat.key}`)?.value || 0);
        totalLvl += val;
        if (stat.type === 'hp_dmg') totalPrice += val * rates.hp_dmg;
        else if (stat.type === 'eng_wgt') totalPrice += val * rates.eng_wgt;
        else totalPrice += val * rates.other;
      });

      if (baseLvlCountEl) baseLvlCountEl.textContent = totalLvl.toString();
      activeFloorPrice = Math.round(totalPrice);
      floorLegend.textContent = `Piso oficial Tier ${tier} (${totalLvl} Lvl)`;
    } else if (cat === 'gacha') {
      const rec = gachaSelect ? gachaSelect.value : "ELEMENTO";
      activeFloorPrice = GACHA_PRECIOS[rec] || 4000;
      floorLegend.textContent = `Piso oficial Gacha ${rec}`;
    } else if (cat === 'mek') {
      const lvl = Math.min(540, Math.max(150, Number(mekLvlInput?.value || 150)));
      let tipo = 'fab';
      if (mekTypeRadios) {
        for (const r of mekTypeRadios) if (r.checked) tipo = r.value;
      }

      if (tipo === 'bp') {
        activeFloorPrice = (lvl <= 250) ? 6000 + (lvl - 150) * 125 : 18500 + (lvl - 250) * 230;
        floorLegend.textContent = `Piso oficial MEK BP (Lvl ${lvl})`;
      } else {
        if (lvl <= 250) activeFloorPrice = 5000 + (lvl - 150) * 70;
        else if (lvl <= 300) activeFloorPrice = 12000 + (lvl - 250) * 100;
        else activeFloorPrice = 17000 + (lvl - 300) * 137.5;
        floorLegend.textContent = `Piso oficial MEK Fab (Lvl ${lvl})`;
      }
      activeFloorPrice = Math.round(activeFloorPrice);
    } else if (cat === 'bp_arma' || cat === 'bp_montura') {
      const subcatKey = bpSubcatSelect ? bpSubcatSelect.value : '';
      const catData = BP_CATEGORIES[subcatKey];
      const itemNombre = bpItemInput ? bpItemInput.value.trim() : '';

      if (catData && catData.items[itemNombre]) {
        const f3Price = catData.items[itemNombre] || 0;
        if (bpF3PriceEl) bpF3PriceEl.textContent = `${f3Price.toLocaleString()} DDC`;

        const stat = Math.max(0, Number(bpStatInput?.value || 0));
        const ranges = catData.ranges;
        const mults = catData.mults;
        const prices = mults.map(m => f3Price * m);

        let baseR = ranges[0];
        if (stat > ranges[0]) {
          const valid = ranges.filter(r => r <= stat);
          baseR = valid[valid.length - 1];
        }

        const idx = ranges.indexOf(baseR);
        const diff = Math.max(0, stat - baseR);
        const basePrice = prices[idx];

        let total = basePrice;
        if (idx < ranges.length - 1) {
          const nextR = ranges[idx + 1];
          const nextPrice = prices[idx + 1];
          const ratePerUnit = (nextPrice - basePrice) / (nextR - baseR);
          total = basePrice + (diff * ratePerUnit);
        }

        activeFloorPrice = Math.round(total);
        floorLegend.textContent = `Piso oficial (${catData.statLabel}: ${stat})`;
      } else {
        activeFloorPrice = 0;
        if (bpF3PriceEl) bpF3PriceEl.textContent = `0 DDC`;
        floorLegend.textContent = 'Selecciona un ítem de la lista';
      }
    } else {
      activeFloorPrice = 0;
      floorLegend.textContent = "Libre fijación de precio";
    }

    calculatedFloorSpan.textContent = `${activeFloorPrice.toLocaleString()} DDC`;
    validarPrecioFinal();
  }

  function validarPrecioFinal() {
    if (!sellPriceInput || !priceError) return true;
    const sellP = Number(sellPriceInput.value || 0);
    if (sellP > 0 && sellP < activeFloorPrice) {
      priceError.style.display = 'block';
      return false;
    }
    priceError.style.display = 'none';
    return true;
  }

  if (sellPriceInput) sellPriceInput.addEventListener('input', validarPrecioFinal);
  if (gachaSelect) gachaSelect.addEventListener('change', recalcularPiso);
  if (mekLvlInput) mekLvlInput.addEventListener('input', recalcularPiso);
  if (mekTypeRadios) mekTypeRadios.forEach(r => r.addEventListener('change', recalcularPiso));

  // --- PARSER RÁPIDO / ARK SMART BREEDING ---
  if (btnQuick && quickInput) {
    btnQuick.addEventListener('click', () => {
      const raw = quickInput.value.trim();
      if (!raw) return;

      if (raw.startsWith('{') && raw.endsWith('}')) {
        try {
          const asb = JSON.parse(raw);
          const species = asb.species || asb.name || '';
          if (species) {
            catSelect.value = 'mutated';
            catSelect.dispatchEvent(new Event('change'));
            dinoInput.value = species;

            const levels = asb.levelsWild || asb.levelsMutated || {};
            if (levels[0]) { document.getElementById('pub-chk-mut-vida').checked = true; document.getElementById('pub-val-mut-vida').value = levels[0]; }
            if (levels[3]) { document.getElementById('pub-chk-mut-dano').checked = true; document.getElementById('pub-val-mut-dano').value = levels[3]; }
            if (levels[1]) { document.getElementById('pub-chk-mut-energia').checked = true; document.getElementById('pub-val-mut-energia').value = levels[1]; }
            if (levels[2]) { document.getElementById('pub-chk-mut-oxigeno').checked = true; document.getElementById('pub-val-mut-oxigeno').value = levels[2]; }
            if (levels[4]) { document.getElementById('pub-chk-mut-comida').checked = true; document.getElementById('pub-val-mut-comida').value = levels[4]; }
            if (levels[5]) { document.getElementById('pub-chk-mut-peso').checked = true; document.getElementById('pub-val-mut-peso').value = levels[5]; }

            recalcularPiso();
            alert('¡Criatura importada con éxito desde Ark Smart Breeding!');
            quickInput.value = '';
            return;
          }
        } catch (e) {
          console.log("No es JSON válido de ASB, parseando como texto...");
        }
      }

      const texto = raw.toLowerCase();
      const todosLosDinos = obtenerCatalogoActual();
      const dinoEncontrado = todosLosDinos.find(d => texto.includes(d.toLowerCase()));
      if (dinoEncontrado) dinoInput.value = dinoEncontrado;

      const mVida = texto.match(/(?:vida|hp)\s*[:=]?\s*(\d+)/i);
      const mDano = texto.match(/(?:daño|dmg|dano)\s*[:=]?\s*(\d+)/i);
      const mPeso = texto.match(/(?:peso|weight)\s*[:=]?\s*(\d+)/i);
      const mPrecio = texto.match(/(?:precio|ddc|\$)\s*[:=]?\s*(\d+)/i);

      if (mVida) { document.getElementById('pub-chk-mut-vida').checked = true; document.getElementById('pub-val-mut-vida').value = mVida[1]; }
      if (mDano) { document.getElementById('pub-chk-mut-dano').checked = true; document.getElementById('pub-val-mut-dano').value = mDano[1]; }
      if (mPeso) { document.getElementById('pub-chk-mut-peso').checked = true; document.getElementById('pub-val-mut-peso').value = mPeso[1]; }
      if (mPrecio) sellPriceInput.value = mPrecio[1];

      recalcularPiso();
      quickInput.value = '';
    });
  }

  // --- CARGA MASIVA EXCEL (.XLSX) ---
  if (btnOpenBulk) {
    btnOpenBulk.addEventListener('click', () => {
      if (!currentUser) {
        alert('Debes iniciar sesión con Discord para usar la carga masiva.');
        return;
      }
      bulkStatusEl.innerHTML = '';
      if (bulkFileInput) bulkFileInput.value = '';
      if (btnProcessBulk) btnProcessBulk.disabled = true;
      modalBulk.classList.remove('hidden');
    });
  }

  if (btnCloseBulk) {
    btnCloseBulk.addEventListener('click', () => modalBulk.classList.add('hidden'));
  }

  if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener('click', () => {
      const plantillaData = [
        {
          "CATEGORIA (mutated/base/mek/gacha/bp_arma/bp_montura/otro)": "mutated",
          "NOMBRE": "Rex",
          "SUBTIPO_O_RECURSO": "",
          "VIDA": 54,
          "DANO": 60,
          "ENERGIA": 0,
          "PESO": 40,
          "CASTRADO (SI/NO)": "NO",
          "STAT_ARMOR_O_LVL": 0,
          "PRECIO_VENTA_DDC": 180000,
          "URL_IMAGEN": "https://i.imgur.com/ejemplo.jpg",
          "NOTAS": "Color cian mutado, obelisco verde"
        },
        {
          "CATEGORIA (mutated/base/mek/gacha/bp_arma/bp_montura/otro)": "bp_arma",
          "NOMBRE": "ESCOPETA CORREDERA",
          "SUBTIPO_O_RECURSO": "BP_ARMA_755",
          "VIDA": 0,
          "DANO": 0,
          "ENERGIA": 0,
          "PESO": 0,
          "CASTRADO (SI/NO)": "NO",
          "STAT_ARMOR_O_LVL": 720,
          "PRECIO_VENTA_DDC": 120000,
          "URL_IMAGEN": "",
          "NOTAS": "Entrega inmediata"
        }
      ];

      const ws = XLSX.utils.json_to_sheet(plantillaData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Plantilla_WildDodo");
      XLSX.writeFile(wb, "plantilla_carga_masiva_wilddodo.xlsx");
    });
  }

  if (bulkFileInput) {
    bulkFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

          if (rows.length === 0) {
            bulkStatusEl.innerHTML = '<span style="color:#ef4444;">El archivo está vacío.</span>';
            btnProcessBulk.disabled = true;
            return;
          }

          bulkValidatedRows = [];
          let auditErrors = [];

          rows.forEach((r, idx) => {
            const cat = String(r["CATEGORIA (mutated/base/mek/gacha/bp_arma/bp_montura/otro)"] || '').trim().toLowerCase();
            const nom = String(r["NOMBRE"] || '').trim();
            const sellPrice = Number(r["PRECIO_VENTA_DDC"] || 0);
            const notas = String(r["NOTAS"] || '').trim();
            const imgUrl = String(r["URL_IMAGEN"] || '').trim();
            const statVal = Number(r["STAT_ARMOR_O_LVL"] || 0);
            const subcat = String(r["SUBTIPO_O_RECURSO"] || '').trim();

            if (!nom) return;

            let floor = 0;
            let descParts = [];

            if (cat === 'mutated') {
              const base = MUTATED_DINOS[nom] || 0;
              const fPrin = ((base / 4) * 1.5) / 254;
              const fSecH = ((base / 4) / 2) / 254;

              const v = Number(r["VIDA"] || 0);
              const d = Number(r["DANO"] || 0);
              const p = Number(r["PESO"] || 0);
              const en = Number(r["ENERGIA"] || 0);

              let t = (v * fPrin) + (d * fPrin) + (p * fSecH) + (en * fSecH);
              const castrado = String(r["CASTRADO (SI/NO)"] || '').toUpperCase().includes('SI');
              if (castrado) t *= 0.75;
              floor = Math.round(t) || 1000;

              if (v) descParts.push(`VIDA: ${v}`);
              if (d) descParts.push(`DAÑO: ${d}`);
              if (p) descParts.push(`PESO: ${p}`);
              if (castrado) descParts.push('(Castrado)');
            } else if (cat === 'gacha') {
              floor = GACHA_PRECIOS[subcat] || 4000;
              descParts.push(`Recurso: ${subcat}`);
            } else if (cat === 'bp_arma' || cat === 'bp_montura') {
              const catData = BP_CATEGORIES[subcat];
              if (catData && catData.items[nom]) {
                const f3Price = catData.items[nom] || 0;
                const ranges = catData.ranges;
                const mults = catData.mults;
                const prices = mults.map(m => f3Price * m);
                let baseR = ranges[0];
                if (statVal > ranges[0]) {
                  const valid = ranges.filter(rg => rg <= statVal);
                  baseR = valid[valid.length - 1];
                }
                const idxR = ranges.indexOf(baseR);
                const diff = Math.max(0, statVal - baseR);
                let totalBp = prices[idxR];
                if (idxR < ranges.length - 1) {
                  const ratePerUnit = (prices[idxR + 1] - totalBp) / (ranges[idxR + 1] - baseR);
                  totalBp += diff * ratePerUnit;
                }
                floor = Math.round(totalBp);
              }
              descParts.push(`Stat: ${statVal}`);
            } else {
              floor = 0;
            }

            if (sellPrice < floor) {
              auditErrors.push(`Fila ${idx + 2} (${nom}): Precio ${sellPrice.toLocaleString()} DDC es inferior al piso de ${floor.toLocaleString()} DDC.`);
            } else {
              if (notas) descParts.push(notas);
              bulkValidatedRows.push({
                user_id: currentUser.id,
                discord_username: getActiveDisplayName(),
                discord_avatar: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || 'https://cdn.discordapp.com/embed/avatars/0.png',
                dino_name: nom,
                category: cat || 'otro',
                details: {
                  desc: descParts.join(' · '),
                  discord_id: currentUser.user_metadata?.provider_id || currentUser.user_metadata?.sub || '',
                  allow_discord: true,
                  image_url: imgUrl
                },
                min_price: floor,
                selling_price: sellPrice,
                status: 'active'
              });
            }
          });

          if (auditErrors.length > 0) {
            bulkStatusEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">Se detectaron infracciones de precio:</span><br><div style="max-height:100px; overflow-y:auto; font-size:0.75rem; color:#fca5a5; margin-top:4px;">${auditErrors.join('<br>')}</div>`;
            btnProcessBulk.disabled = true;
          } else {
            bulkStatusEl.innerHTML = `<span style="color:#4ade80; font-weight:700;">✔ ${bulkValidatedRows.length} ítems validados correctamente y listos para publicar.</span>`;
            btnProcessBulk.disabled = false;
          }
        } catch (err) {
          bulkStatusEl.innerHTML = `<span style="color:#ef4444;">Error al procesar el archivo Excel: ${err.message}</span>`;
          btnProcessBulk.disabled = true;
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  if (btnProcessBulk) {
    btnProcessBulk.addEventListener('click', async () => {
      if (bulkValidatedRows.length === 0) return;
      btnProcessBulk.disabled = true;
      btnProcessBulk.textContent = 'Subiendo publicaciones...';

      const { error } = await supabaseClient.from('market_listings').insert(bulkValidatedRows);
      if (error) {
        alert('Error al publicar lote masivo: ' + error.message);
        btnProcessBulk.disabled = false;
        btnProcessBulk.textContent = 'Procesar y Publicar Lote';
      } else {
        alert(`¡Éxito! Se publicaron ${bulkValidatedRows.length} ítems en el mercado.`);
        modalBulk.classList.add('hidden');
        cargarPublicaciones();
      }
    });
  }

  if (btnOpenPublish) {
    btnOpenPublish.addEventListener('click', () => {
      if (!currentUser) {
        alert('Debes iniciar sesión con Discord para publicar en el mercado.');
        return;
      }
      editingListingId = null;
      const title = document.querySelector('#modal-publish .side-card-title');
      if (title) title.textContent = "PUBLICAR EN EL MERCADO";
      if (btnSubmitListing) {
        btnSubmitListing.textContent = "Confirmar y Publicar";
        btnSubmitListing.disabled = false;
      }

      formPublish.reset();
      if (previewBox) previewBox.classList.add('hidden');
      modalPublish.classList.remove('hidden');
      recalcularPiso();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => modalPublish.classList.add('hidden'));
  }

  function abrirEdicion(item) {
    editingListingId = item.id;
    const title = document.querySelector('#modal-publish .side-card-title');
    if (title) title.textContent = "EDITAR PUBLICACIÓN";
    if (btnSubmitListing) {
      btnSubmitListing.textContent = "Guardar Cambios";
      btnSubmitListing.disabled = false;
    }

    catSelect.value = item.category || 'otro';
    catSelect.dispatchEvent(new Event('change'));

    if (item.category === 'bp_arma' || item.category === 'bp_montura') {
      configurarSubcategoriasBp(item.category);
    }

    if (dinoInput) dinoInput.value = item.dino_name || '';
    if (sellPriceInput) sellPriceInput.value = item.selling_price;
    activeFloorPrice = item.min_price || 0;
    if (calculatedFloorSpan) calculatedFloorSpan.textContent = `${activeFloorPrice.toLocaleString()} DDC`;

    const descInput = document.getElementById('pub-details');
    if (descInput) descInput.value = item.details?.desc || '';

    if (inputImageUrl) {
      inputImageUrl.value = item.details?.image_url || '';
      if (item.details?.image_url && previewBox && previewImg) {
        previewImg.src = item.details.image_url;
        previewBox.classList.remove('hidden');
      } else if (previewBox) {
        previewBox.classList.add('hidden');
      }
    }

    const allowDiscordChk = document.getElementById('pub-allow-discord');
    if (allowDiscordChk) {
      allowDiscordChk.checked = item.details?.allow_discord !== false;
    }

    modalPublish.classList.remove('hidden');
    validarPrecioFinal();
  }

  if (formPublish) {
    formPublish.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!currentUser) {
        alert('Debes iniciar sesión con Discord para publicar en el mercado.');
        return;
      }

      const cat = catSelect.value;
      const isDinoCat = (cat === 'mutated' || cat === 'base' || cat === 'otro');
      
      if (isDinoCat && (!dinoInput || !dinoInput.value.trim())) {
        alert('Por favor, indica el nombre de la criatura u objeto.');
        if (dinoInput) dinoInput.focus();
        return;
      }

      const sellP = Number(sellPriceInput?.value || 0);
      if (!sellP || sellP <= 0) {
        alert('Por favor, indica un precio de venta válido.');
        if (sellPriceInput) sellPriceInput.focus();
        return;
      }

      if (sellP < activeFloorPrice) {
        alert(`Error: El precio no puede ser inferior al precio piso oficial (${activeFloorPrice.toLocaleString()} DDC).`);
        return;
      }

      if (btnSubmitListing) {
        btnSubmitListing.disabled = true;
        btnSubmitListing.textContent = "Procesando publicación...";
      }

      try {
        let dinoName = '';
        let statsSummary = [];

        if (cat === 'mutated') {
          dinoName = dinoInput ? dinoInput.value.trim() : 'Dino Mutado';
          STATS_MUTADOS.forEach(s => {
            if (document.getElementById(`pub-chk-mut-${s.key}`)?.checked) {
              const val = document.getElementById(`pub-val-mut-${s.key}`)?.value || 0;
              statsSummary.push(`${s.label}: ${val}`);
            }
          });
          if (mutCastradoChk?.checked) statsSummary.push('(Castrado)');
        } else if (cat === 'base') {
          dinoName = dinoInput ? dinoInput.value.trim() : 'Dino Base';
          STATS_BASE.forEach(s => {
            const val = Number(document.getElementById(`pub-val-base-${s.key}`)?.value || 0);
            if (val > 0) statsSummary.push(`${s.label}: ${val}`);
          });
        } else if (cat === 'gacha') {
          dinoName = `Gacha (${gachaSelect.value})`;
        } else if (cat === 'mek') {
          let tipo = 'Fabricado';
          for (const r of mekTypeRadios) if (r.checked && r.value === 'bp') tipo = 'BP';
          dinoName = `MEK Lvl ${mekLvlInput.value} (${tipo})`;
        } else if (cat === 'bp_arma' || cat === 'bp_montura') {
          const subcatKey = bpSubcatSelect?.value || '';
          const catData = BP_CATEGORIES[subcatKey];
          const itemNom = bpItemInput?.value.trim() || 'Ítem';
          const statVal = bpStatInput?.value || 0;
          dinoName = `${itemNom} [${catData?.statLabel || 'Stat'}: ${statVal}]`;
          if (catData?.label) statsSummary.push(catData.label);
        } else {
          dinoName = dinoInput ? dinoInput.value.trim() : 'Objeto / Criatura';
        }

        const allowDiscord = document.getElementById('pub-allow-discord')?.checked ?? true;
        const sellerDisplayName = getActiveDisplayName();
        const discordId = allowDiscord ? (currentUser.user_metadata?.provider_id || currentUser.user_metadata?.sub || '') : '';

        const meta = currentUser.user_metadata || {};
        const avatar = meta.avatar_url || meta.picture || 'https://cdn.discordapp.com/embed/avatars/0.png';
        const userDesc = document.getElementById('pub-details')?.value.trim() || '';
        const imageUrl = inputImageUrl ? inputImageUrl.value.trim() : '';

        const fullDesc = [statsSummary.join(' · '), userDesc].filter(Boolean).join(' | ');

        const payload = {
          user_id: currentUser.id,
          discord_username: sellerDisplayName,
          discord_avatar: avatar,
          dino_name: dinoName,
          category: cat,
          details: { 
            desc: fullDesc,
            discord_id: discordId,
            allow_discord: allowDiscord,
            image_url: imageUrl
          },
          min_price: activeFloorPrice,
          selling_price: sellP,
          status: 'active'
        };

        // Si estamos editando
        if (editingListingId) {
          const { error } = await supabaseClient
            .from('market_listings')
            .update({
              selling_price: sellP,
              details: payload.details
            })
            .eq('id', editingListingId);

          if (error) throw error;

          editingListingId = null;
          formPublish.reset();
          if (previewBox) previewBox.classList.add('hidden');
          modalPublish.classList.add('hidden');
          cargarPublicaciones();
          alert('¡Publicación actualizada con éxito!');
          return;
        }

        // Si es una publicación nueva
        const { error } = await supabaseClient.from('market_listings').insert([payload]);
        if (error) throw error;

        // Generar formato Markdown para Discord
        const mentionDiscord = discordId ? `<@${discordId}>` : sellerDisplayName;
        const fotoTexto = imageUrl ? `\n🖼️ **Foto:** ${imageUrl}` : '';
        const textoDiscord = 
`🛒 **MERCADO WILD DODO**
🦖 **Ítem/Criatura:** ${dinoName}
📊 **Detalles:** ${fullDesc || 'Sin notas adicionales'}
💰 **Precio:** ${sellP.toLocaleString()} DDC *(Piso auditado: ${activeFloorPrice.toLocaleString()} DDC)*
👤 **Vendedor:** ${mentionDiscord}${fotoTexto}
🔗 *Publicado desde la Calculadora y Mercado Oficial*`;

        // Copiar con fallback seguro
        const copiadoOk = await copiarAlPortapapelesSeguro(textoDiscord);

        formPublish.reset();
        if (previewBox) previewBox.classList.add('hidden');
        modalPublish.classList.add('hidden');
        cargarPublicaciones();

        const msgTexto = copiadoOk 
          ? '¡Publicación creada con éxito!\n\n📋 Se copió automáticamente el formato listo para Discord al portapapeles.\n\n¿Quieres abrir el canal #mercado ahora para pegarlo con Ctrl + V?'
          : '¡Publicación creada con éxito!\n\n¿Quieres abrir el canal #mercado de Discord ahora?';

        const irADiscord = confirm(msgTexto);
        if (irADiscord) {
          window.open(DISCORD_MARKET_CHANNEL_URL, '_blank');
        }

      } catch (err) {
        console.error('Error durante la publicación:', err);
        alert('Hubo un problema al guardar la publicación:\n' + (err.message || err));
      } finally {
        if (btnSubmitListing) {
          btnSubmitListing.disabled = false;
          btnSubmitListing.textContent = "Confirmar y Publicar";
        }
      }
    });
  }

  async function cargarPublicaciones() {
    if (!supabaseClient || !gridListings) return;
    const { data, error } = await supabaseClient
      .from('market_listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      gridListings.innerHTML = '<div class="market-empty-state">Error al cargar publicaciones.</div>';
      return;
    }

    allListings = data || [];
    renderGrid(allListings);
  }

  function renderGrid(listings) {
    if (!gridListings) return;
    if (listings.length === 0) {
      gridListings.innerHTML = '<div class="market-empty-state">No hay publicaciones activas en este momento.</div>';
      return;
    }

    gridListings.innerHTML = '';
    listings.forEach(item => {
      const card = document.createElement('div');
      card.className = 'market-card';

      const isOwner = currentUser && currentUser.id === item.user_id;
      const isAdmin = isCurrentUserAdmin();

      const allowDiscord = item.details?.allow_discord !== false;
      const sellerName = item.discord_username;
      const sellerDiscordId = item.details?.discord_id || '';
      const imgUrl = item.details?.image_url;

      let actionsHtml = '';
      if (isOwner) {
        actionsHtml = `
          <div style="display: flex; gap: 6px;">
            <button class="btn-edit-item btn-copy-discord" data-id="${item.id}" style="flex: 1; padding: 6px 8px; font-size: 0.78rem;">✏ Editar</button>
            <button class="btn-clone-item btn-copy-discord" data-id="${item.id}" style="flex: 1; padding: 6px 8px; font-size: 0.78rem; border-color: var(--neon-cyan);">📋 Clonar</button>
            <button class="btn-delete-item" data-id="${item.id}" style="flex: 1; padding: 6px 8px; font-size: 0.78rem;">Retirar</button>
          </div>
        `;
      } else if (isAdmin) {
        actionsHtml = `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; gap: 6px;">
              ${allowDiscord 
                ? `<button class="btn-contact-seller btn-open-discord-app" data-id="${sellerDiscordId}" data-user="${sellerName}" data-item="${item.dino_name}" style="flex: 2;">
                     <span>Contactar por Discord</span>
                   </button>`
                : `<div class="btn-contact-seller" style="flex: 2; background: rgba(255,255,255,0.05); color: var(--text-muted); cursor: default;">In-Game</div>`
              }
              <a href="${DISCORD_MARKET_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="btn-copy-discord" title="Ir al canal #mercado" style="padding: 8px 12px; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                #mercado
              </a>
            </div>
            <button class="btn-delete-item btn-admin-delete" data-id="${item.id}" style="background: rgba(239, 68, 68, 0.25); border-color: #ef4444; color: #fff;">
              🛡️ Eliminar (Mod/Admin)
            </button>
          </div>
        `;
      } else {
        actionsHtml = `
          <div style="display: flex; gap: 6px;">
            ${allowDiscord
              ? `<button class="btn-contact-seller btn-open-discord-app" data-id="${sellerDiscordId}" data-user="${sellerName}" data-item="${item.dino_name}" style="flex: 2;">
                   <span>Contactar por Discord</span>
                 </button>`
              : `<div class="btn-contact-seller" style="flex: 2; background: rgba(255,255,255,0.05); color: var(--text-muted); cursor: default;">Contacto solo In-Game</div>`
            }
            <a href="${DISCORD_MARKET_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="btn-copy-discord" title="Ir al canal #mercado" style="padding: 8px 12px; text-decoration: none; display: flex; align-items: center; justify-content: center;">
              #mercado
            </a>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="market-card-seller">
            <img class="seller-avatar" src="${item.discord_avatar}" alt="Avatar">
            <span class="seller-name">${item.discord_username}</span>
            <span class="market-badge-cat" style="margin-left:auto;">${item.category}</span>
          </div>
          
          ${imgUrl ? `
            <div style="margin-top: 10px; border-radius: 8px; overflow: hidden; max-height: 160px; background: #000; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1);">
              <a href="${imgUrl}" target="_blank" rel="noopener noreferrer" title="Ver imagen completa">
                <img src="${imgUrl}" alt="${item.dino_name}" style="width: 100%; height: 100%; object-fit: cover; max-height: 160px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              </a>
            </div>
          ` : ''}

          <h4 class="market-card-dino" style="margin-top: 10px;">${item.dino_name}</h4>
          <p class="market-card-details">${item.details?.desc || ''}</p>
        </div>

        <div>
          <div class="market-card-price-box">
            <span style="font-size: 0.75rem; color: var(--text-muted);">PRECIO</span>
            <span class="market-card-price">${Number(item.selling_price).toLocaleString()} DDC</span>
          </div>

          <div style="margin-top: 10px;">
            ${actionsHtml}
          </div>
        </div>
      `;

      const btnEdit = card.querySelector('.btn-edit-item');
      if (btnEdit) {
        btnEdit.addEventListener('click', () => abrirEdicion(item));
      }

      const btnClone = card.querySelector('.btn-clone-item');
      if (btnClone) {
        btnClone.addEventListener('click', () => {
          abrirEdicion(item);
          editingListingId = null;
          const title = document.querySelector('#modal-publish .side-card-title');
          if (title) title.textContent = "CLONAR PUBLICACIÓN";
          if (btnSubmitListing) btnSubmitListing.textContent = "Confirmar y Publicar Copia";
        });
      }

      const btnDel = card.querySelector('.btn-delete-item');
      if (btnDel) {
        btnDel.addEventListener('click', async () => {
          const msg = isAdmin && !isOwner 
            ? '¿ADMIN: Deseas eliminar forzosamente esta publicación del mercado?' 
            : '¿Deseas retirar esta publicación del mercado?';

          if (confirm(msg)) {
            await supabaseClient.from('market_listings').delete().eq('id', item.id);
            cargarPublicaciones();
          }
        });
      }

      const btnContact = card.querySelector('.btn-open-discord-app');
      if (btnContact) {
        btnContact.addEventListener('click', () => {
          const userTarget = btnContact.getAttribute('data-user');
          const itemTarget = btnContact.getAttribute('data-item');
          const discordId = btnContact.getAttribute('data-id');

          const copyText = `Hola @${userTarget}! Te contacto desde Wild Dodo por tu publicación de: ${itemTarget}`;
          copiarAlPortapapelesSeguro(copyText);

          const originalHTML = btnContact.innerHTML;
          btnContact.innerHTML = `<span>¡Mensaje copiado! Abriendo...</span>`;
          setTimeout(() => { btnContact.innerHTML = originalHTML; }, 3000);

          if (discordId) {
            window.location.href = `discord://-/users/${discordId}`;
            setTimeout(() => {
              window.open(`https://discord.com/users/${discordId}`, '_blank');
            }, 600);
          } else {
            window.location.href = `discord://`;
          }
        });
      }

      gridListings.appendChild(card);
    });
  }

  function aplicarFiltros() {
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const cat = filterCat ? filterCat.value : 'all';

    const filtrados = allListings.filter(item => {
      const matchText = item.dino_name.toLowerCase().includes(q) || item.discord_username.toLowerCase().includes(q);
      const matchCat = cat === 'all' || item.category === cat;
      return matchText && matchCat;
    });
    renderGrid(filtrados);
  }

  if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
  if (filterCat) filterCat.addEventListener('change', aplicarFiltros);
  if (tabMarket) tabMarket.addEventListener('click', cargarPublicaciones);
}

// ==========================================
// 8. MODAL DE DONACIONES POR DEV
// ==========================================
function initDonateModal() {
  const btnOpen = document.getElementById('btn-open-donate');
  const btnClose = document.getElementById('btn-close-donate');
  const modal = document.getElementById('modal-donate');

  const btnCopyAlias = document.getElementById('btn-copy-alias');
  const aliasText = document.getElementById('donate-alias-text');

  const btnCopyTag = document.getElementById('btn-copy-lemontag');
  const tagText = document.getElementById('donate-lemontag-text');

  const btnCopyCrypto = document.getElementById('btn-copy-crypto');
  const cryptoText = document.getElementById('donate-crypto-address');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  function setupCopy(btn, targetEl) {
    if (!btn || !targetEl) return;
    btn.addEventListener('click', async () => {
      await copiarAlPortapapelesSeguro(targetEl.textContent.trim());
      const originalText = btn.textContent;
      btn.textContent = '¡Copiado!';
      setTimeout(() => { btn.textContent = originalText; }, 1800);
    });
  }

  setupCopy(btnCopyAlias, aliasText);
  setupCopy(btnCopyTag, tagText);
  setupCopy(btnCopyCrypto, cryptoText);
}

// Inicializaciones
initAuth();
initMarketplace();
initEspecialesBase();
initMutated();
initBase();
initRecursos();
initBP();
initDonateModal();
