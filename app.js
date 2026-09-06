import { BASE_TIER_RATES, BASE_DINOS, MUTATED_DINOS, RECURSOS_DATA, BP_CATEGORIES } from './data.js';

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

  const chkVida = document.getElementById('chk-mut-vida').checked;
  const chkDano = document.getElementById('chk-mut-dano').checked;
  const hasPrin = chkVida || chkDano;

  let total = 0;
  if (chkVida) total += Number(document.getElementById('val-mut-vida').value || 0) * fPrin;
  if (chkDano) total += Number(document.getElementById('val-mut-dano').value || 0) * fPrin;

  const secKeys = ['peso', 'energia', 'comida', 'oxigeno', 'velocidad'];
  let countSec = 0;

  secKeys.forEach(k => {
    if (document.getElementById(`chk-mut-${k}`).checked) {
      const val = Number(document.getElementById(`val-mut-${k}`).value || 0);
      if (hasPrin) {
        total += val * fSecH;
      } else {
        total += (countSec === 0) ? (val * fSecI) : (val * fSecH);
      }
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
    const val = Number(document.getElementById(`val-base-${stat.key}`).value || 0);
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
  bpF3PriceEl.textContent = `${f3Price.toLocaleString()} DodoCoins`;

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

    if (lvl <= 250) {
      bp = 6000 + (lvl - 150) * 125;
    } else {
      bp = 18500 + (lvl - 250) * 230;
    }

    if (lvl <= 250) {
      fab = 5000 + (lvl - 150) * 70;
    } else if (lvl <= 300) {
      fab = 12000 + (lvl - 250) * 100;
    } else {
      fab = 17000 + (lvl - 300) * 137.5;
    }

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
// 6. SUPABASE AUTH & MARKETPLACE
// ==========================================
const SUPABASE_URL = "https://wuxsgpbynwrubemamfzb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZKrh4YjvMrl8yiWLTwLYcQ_6pYn2Rdx";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let currentUser = null;

async function initAuth() {
  if (!supabaseClient) return;

  const btnLogin = document.getElementById('btn-login-discord');
  const btnLogout = document.getElementById('btn-logout');
  const userBadge = document.getElementById('user-profile-badge');
  const avatarImg = document.getElementById('user-discord-avatar');
  const nameSpan = document.getElementById('user-discord-name');

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
      const username = meta.full_name || meta.custom_claims?.global_name || meta.name || 'Sobreviviente';
      const avatar = meta.avatar_url || meta.picture || 'https://cdn.discordapp.com/embed/avatars/0.png';

      if (nameSpan) nameSpan.textContent = username;
      if (avatarImg) avatarImg.src = avatar;
    } else {
      if (btnLogin) btnLogin.classList.remove('hidden');
      if (userBadge) userBadge.classList.add('hidden');
    }
  }
}

function initMarketplace() {
  const tabMarket = document.getElementById('tab-marketplace');
  const btnOpenPublish = document.getElementById('btn-open-publish');
  const modalPublish = document.getElementById('modal-publish');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formPublish = document.getElementById('form-publish-listing');
  const gridListings = document.getElementById('market-listings-grid');
  const searchInput = document.getElementById('market-search-input');
  const filterCat = document.getElementById('market-filter-cat');

  const catSelect = document.getElementById('pub-category');
  const dinoInput = document.getElementById('pub-dino-name');
  const dinoDropdown = document.getElementById('dropdown-pub-dino');
  const tierBadge = document.getElementById('pub-tier-badge');
  const gachaGroup = document.getElementById('group-pub-gacha');
  const gachaSelect = document.getElementById('pub-gacha-res');
  const mekGroup = document.getElementById('group-pub-mek');
  const mekLvlInput = document.getElementById('pub-mek-lvl');
  const mekTypeRadios = document.getElementsByName('mek-type');

  const calculatedFloorSpan = document.getElementById('pub-calculated-floor');
  const floorLegend = document.getElementById('pub-floor-legend');
  const sellPriceInput = document.getElementById('pub-selling-price');
  const priceError = document.getElementById('pub-price-error');

  let activeFloorPrice = 0;
  let allListings = [];

  // Obtener lista completa unificada de criaturas desde data.js
  const officialDinos = Array.from(new Set([
    ...Object.keys(MUTATED_DINOS || {}),
    ...Object.keys(BASE_DINOS || {})
  ])).sort();

  if (tabMarket) {
    tabMarket.addEventListener('click', () => {
      cargarPublicaciones();
    });
  }

  if (btnOpenPublish) {
    btnOpenPublish.addEventListener('click', () => {
      if (!currentUser) {
        alert('Debes iniciar sesión con Discord para publicar en el mercado.');
        return;
      }
      modalPublish.classList.remove('hidden');
      recalcularPiso();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => modalPublish.classList.add('hidden'));
  }

  if (catSelect) {
    catSelect.addEventListener('change', () => {
      const val = catSelect.value;
      const groupDino = document.getElementById('group-pub-dino');
      if (groupDino) groupDino.classList.toggle('hidden', val === 'gacha');
      if (gachaGroup) gachaGroup.classList.toggle('hidden', val !== 'gacha');
      if (mekGroup) mekGroup.classList.toggle('hidden', val !== 'mek');

      if (dinoInput) {
        if (val === 'gacha') {
          dinoInput.removeAttribute('required');
        } else {
          dinoInput.setAttribute('required', 'true');
        }
      }
      recalcularPiso();
    });
  }

  // Autocompletado del modal
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

      const matches = officialDinos.filter(d => d.toLowerCase().includes(val));

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
    const tier = BASE_DINOS[nombre];
    if (tierBadge) {
      tierBadge.textContent = tier ? `Oficial: Tier ${tier}` : 'Criatura oficial reconocida';
    }
    recalcularPiso();
  }

  function recalcularPiso() {
    if (!catSelect || !calculatedFloorSpan || !floorLegend) return;
    const cat = catSelect.value;
    activeFloorPrice = 0;
    floorLegend.textContent = "Sin precio piso obligatorio";

    if (cat === 'gacha') {
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
        floorLegend.textContent = `Piso oficial MEK Fabricado (Lvl ${lvl})`;
      }
    } else if (cat === 'base' || cat === 'mutated') {
      const dino = dinoInput?.value.trim() || '';
      const tier = BASE_DINOS[dino];
      const mutBasePrice = MUTATED_DINOS[dino];

      if (cat === 'mutated' && mutBasePrice) {
        activeFloorPrice = Math.round(mutBasePrice * 0.75); // Precio mínimo base castrado
        floorLegend.textContent = `Piso oficial base mutado (${dino})`;
      } else if (tier) {
        activeFloorPrice = (tier === 6) ? 1000 : (tier === 5 ? 2500 : 5000);
        floorLegend.textContent = `Piso base Tier ${tier}`;
      } else {
        activeFloorPrice = 1000;
        floorLegend.textContent = "Piso mínimo por defecto";
      }
    }

    activeFloorPrice = Math.round(activeFloorPrice);
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

  // Enviar a Supabase
  if (formPublish) {
    formPublish.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const sellP = Number(sellPriceInput.value);
      if (sellP < activeFloorPrice) {
        alert(`Tu precio (${sellP.toLocaleString()} DDC) es inferior al mínimo oficial permitido (${activeFloorPrice.toLocaleString()} DDC).`);
        return;
      }

      const cat = catSelect.value;
      const dinoName = (cat === 'gacha') ? `Gacha de ${gachaSelect.value}` : dinoInput.value.trim();

      const meta = currentUser.user_metadata || {};
      const username = meta.full_name || meta.custom_claims?.global_name || meta.name || 'Sobreviviente';
      const avatar = meta.avatar_url || meta.picture || 'https://cdn.discordapp.com/embed/avatars/0.png';

      const payload = {
        user_id: currentUser.id,
        discord_username: username,
        discord_avatar: avatar,
        dino_name: dinoName,
        category: cat,
        details: { desc: document.getElementById('pub-details')?.value.trim() || '' },
        min_price: activeFloorPrice,
        selling_price: sellP,
        status: 'active'
      };

      const { error } = await supabaseClient.from('market_listings').insert([payload]);

      if (error) {
        alert('Error al publicar: ' + error.message);
      } else {
        formPublish.reset();
        modalPublish.classList.add('hidden');
        cargarPublicaciones();
      }
    });
  }

  // Cargar publicaciones
  async function cargarPublicaciones() {
    if (!supabaseClient || !gridListings) return;
    const { data, error } = await supabaseClient
      .from('market_listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      gridListings.innerHTML = '<div class="market-empty-state">Error al conectar con el mercado.</div>';
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

      card.innerHTML = `
        <div>
          <div class="market-card-seller">
            <img class="seller-avatar" src="${item.discord_avatar}" alt="Avatar">
            <span class="seller-name">${item.discord_username}</span>
            <span class="market-badge-cat" style="margin-left:auto;">${item.category}</span>
          </div>
          <h4 class="market-card-dino" style="margin-top: 10px;">${item.dino_name}</h4>
          <p class="market-card-details">${item.details?.desc || ''}</p>
        </div>

        <div>
          <div class="market-card-price-box">
            <span style="font-size: 0.75rem; color: var(--text-muted);">PRECIO</span>
            <span class="market-card-price">${Number(item.selling_price).toLocaleString()} DDC</span>
          </div>

          <div style="margin-top: 10px;">
            ${isOwner 
              ? `<button class="btn-delete-item" data-id="${item.id}">Marcar Vendido / Retirar</button>`
              : `<div class="btn-contact-seller">Vendedor: ${item.discord_username}</div>`
            }
          </div>
        </div>
      `;

      if (isOwner) {
        card.querySelector('.btn-delete-item').addEventListener('click', async () => {
          if (confirm('¿Deseas retirar esta publicación del mercado?')) {
            await supabaseClient.from('market_listings').delete().eq('id', item.id);
            cargarPublicaciones();
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
}

// Inicialización de la aplicación
initAuth();
initMarketplace();
initEspecialesBase();
initMutated();
initBase();
initRecursos();
initBP();
