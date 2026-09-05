import { BASE_TIER_RATES, BASE_DINOS, MUTATED_DINOS } from './data.js';

const STATS_MUTADOS = [
  { key: 'vida', label: 'VIDA', type: 'principal' },
  { key: 'dano', label: 'DAÑO', type: 'principal' },
  { key: 'peso', label: 'PESO', type: 'secundaria' },
  { key: 'energia', label: 'ENERGIA', type: 'secundaria' },
  { key: 'comida', label: 'COMIDA', type: 'secundaria' },
  { key: 'oxigeno', label: 'OXIGENO', type: 'secundaria' },
  { key: 'velocidad', label: 'VELOCIDAD', type: 'secundaria' }
];

const STATS_BASE = [
  { key: 'vida', label: 'VIDA', type: 'hp_dmg' },
  { key: 'dano', label: 'DAÑO', type: 'hp_dmg' },
  { key: 'energia', label: 'ENERGIA', type: 'eng_wgt' },
  { key: 'peso', label: 'PESO', type: 'eng_wgt' },
  { key: 'comida', label: 'COMIDA', type: 'other' },
  { key: 'oxigeno', label: 'OXIGENO', type: 'other' },
  { key: 'velocidad', label: 'VELOCIDAD', type: 'other' }
];

// Tabs
const tabMutated = document.getElementById('tab-mutated');
const tabBase = document.getElementById('tab-base');
const secMutated = document.getElementById('section-mutated');
const secBase = document.getElementById('section-base');

// Mutados DOM
const inputMutated = document.getElementById('search-mutated-dino');
const dropdownMutated = document.getElementById('dropdown-mutated-dino');
const mutatedStatsList = document.getElementById('mutated-stats-list');
const mutatedBasePriceEl = document.getElementById('mutated-base-price');
const priceUncasteredEl = document.getElementById('price-uncastered');
const priceCasteredEl = document.getElementById('price-castered');

// Base DOM
const inputBase = document.getElementById('search-base-dino');
const dropdownBase = document.getElementById('dropdown-base-dino');
const baseStatsGrid = document.getElementById('base-stats-grid');
const baseDinoTierEl = document.getElementById('base-dino-tier');
const baseTotalLvlEl = document.getElementById('base-total-lvl');
const basePriceTotalEl = document.getElementById('base-price-total');

// Estado de selección actual
let currentMutatedDino = Object.keys(MUTATED_DINOS)[0] || '';
let currentBaseDino = Object.keys(BASE_DINOS)[0] || '';

// Manejo de tabs
tabMutated.addEventListener('click', () => {
  tabMutated.classList.add('active');
  tabBase.classList.remove('active');
  secMutated.classList.remove('hidden');
  secBase.classList.add('hidden');
});

tabBase.addEventListener('click', () => {
  tabBase.classList.add('active');
  tabMutated.classList.remove('active');
  secBase.classList.remove('hidden');
  secMutated.classList.add('hidden');
});

// Helper genérico para autocompletado con búsqueda en tiempo real
function setupAutocomplete(inputEl, dropdownEl, listKeys, onSelect) {
  function renderList(query = '') {
    dropdownEl.innerHTML = '';
    const cleanQuery = query.toLowerCase().trim();
    const filtered = listKeys.filter(item => item.toLowerCase().includes(cleanQuery));

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'autocomplete-empty';
      emptyLi.textContent = 'No se encontraron coincidencias';
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

  inputEl.addEventListener('input', () => {
    renderList(inputEl.value);
  });

  inputEl.addEventListener('focus', () => {
    renderList(inputEl.value);
  });

  inputEl.addEventListener('blur', () => {
    setTimeout(() => dropdownEl.classList.add('hidden'), 150);
  });
}

// Inicialización de Dinos Mutados
function initMutated() {
  const dinosList = Object.keys(MUTATED_DINOS).sort();
  inputMutated.value = currentMutatedDino;

  setupAutocomplete(inputMutated, dropdownMutated, dinosList, (selected) => {
    currentMutatedDino = selected;
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
  const basePrice = MUTATED_DINOS[currentMutatedDino] || 0;
  mutatedBasePriceEl.textContent = `${basePrice.toLocaleString()} DodoCoins`;

  const factorPrincipal = ((basePrice / 4) * 1.5) / 254;
  const factorSecundariaH = ((basePrice / 4) / 2) / 254;
  const factorSecundariaI = ((basePrice / 4) * 1.25) / 254;

  const chkVida = document.getElementById('chk-mut-vida').checked;
  const chkDano = document.getElementById('chk-mut-dano').checked;
  const hasAnyPrincipal = chkVida || chkDano;

  let totalSinCastrar = 0;

  if (chkVida) totalSinCastrar += Number(document.getElementById('val-mut-vida').value || 0) * factorPrincipal;
  if (chkDano) totalSinCastrar += Number(document.getElementById('val-mut-dano').value || 0) * factorPrincipal;

  const secStats = ['peso', 'energia', 'comida', 'oxigeno', 'velocidad'];
  let activeSecBefore = 0;

  secStats.forEach(statKey => {
    const isChecked = document.getElementById(`chk-mut-${statKey}`).checked;
    const statVal = Number(document.getElementById(`val-mut-${statKey}`).value || 0);

    if (isChecked) {
      if (hasAnyPrincipal) {
        totalSinCastrar += statVal * factorSecundariaH;
      } else {
        if (activeSecBefore === 0) {
          totalSinCastrar += statVal * factorSecundariaI;
        } else {
          totalSinCastrar += statVal * factorSecundariaH;
        }
      }
      activeSecBefore++;
    }
  });

  const finalSinCastrar = Math.round(totalSinCastrar);
  const finalCastrado = Math.round(totalSinCastrar * 0.75);

  priceUncasteredEl.textContent = `${finalSinCastrar.toLocaleString()} DodoCoins`;
  priceCasteredEl.textContent = `${finalCastrado.toLocaleString()} DodoCoins`;
}

// Inicialización de Dinos Base
function initBase() {
  const dinosList = Object.keys(BASE_DINOS).sort();
  inputBase.value = currentBaseDino;

  setupAutocomplete(inputBase, dropdownBase, dinosList, (selected) => {
    currentBaseDino = selected;
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
  const tier = BASE_DINOS[currentBaseDino] ?? 4;
  baseDinoTierEl.textContent = `Tier ${tier}`;

  const rates = BASE_TIER_RATES[tier] || BASE_TIER_RATES[4];

  let totalPrice = 0;
  let totalLvl = 1;

  STATS_BASE.forEach(stat => {
    const val = Number(document.getElementById(`val-base-${stat.key}`).value || 0);
    totalLvl += val;

    if (stat.type === 'hp_dmg') {
      totalPrice += val * rates.hp_dmg;
    } else if (stat.type === 'eng_wgt') {
      totalPrice += val * rates.eng_wgt;
    } else {
      totalPrice += val * rates.other;
    }
  });

  baseTotalLvlEl.textContent = totalLvl.toString();
  basePriceTotalEl.textContent = `${Math.round(totalPrice).toLocaleString()} DodoCoins`;
}

initMutated();
initBase();
