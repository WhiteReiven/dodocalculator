import { BASE_TIER_RATES, BASE_DINOS, MUTATED_DINOS, RECURSOS_DATA, BP_CATEGORIES } from './data.js';

// --- PESTAÑAS ---
const tabs = {
  mutated: { btn: document.getElementById('tab-mutated'), sec: document.getElementById('section-mutated') },
  base: { btn: document.getElementById('tab-base'), sec: document.getElementById('section-base') },
  recursos: { btn: document.getElementById('tab-recursos'), sec: document.getElementById('section-recursos') },
  bp: { btn: document.getElementById('tab-bp'), sec: document.getElementById('section-bp') }
};

Object.keys(tabs).forEach(k => {
  tabs[k].btn.addEventListener('click', () => {
    Object.keys(tabs).forEach(other => {
      tabs[other].btn.classList.remove('active');
      tabs[other].sec.classList.add('hidden');
    });
    tabs[k].btn.classList.add('active');
    tabs[k].sec.classList.remove('hidden');
  });
});

// Helper genérico para autocompletado interactivo
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

  // Fórmula oficial de la planilla: Cantidad / (cant / ddc) = (Cantidad * ddc) / cant
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

  // Precios base por tramo de acuerdo al multiplicador de la planilla
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

// Inicialización general
initMutated();
initBase();
initRecursos();
initBP();
