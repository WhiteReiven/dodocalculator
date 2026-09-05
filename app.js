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

// Elementos DOM
const tabMutated = document.getElementById('tab-mutated');
const tabBase = document.getElementById('tab-base');
const secMutated = document.getElementById('section-mutated');
const secBase = document.getElementById('section-base');

const selectMutated = document.getElementById('select-mutated-dino');
const mutatedStatsList = document.getElementById('mutated-stats-list');
const mutatedBasePriceEl = document.getElementById('mutated-base-price');
const priceUncasteredEl = document.getElementById('price-uncastered');
const priceCasteredEl = document.getElementById('price-castered');

const selectBase = document.getElementById('select-base-dino');
const baseStatsGrid = document.getElementById('base-stats-grid');
const baseDinoTierEl = document.getElementById('base-dino-tier');
const baseTotalLvlEl = document.getElementById('base-total-lvl');
const basePriceTotalEl = document.getElementById('base-price-total');

// Cambiar de Pestaña
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

// Inicializar Dinos Mutados
function initMutated() {
  Object.keys(MUTATED_DINOS).sort().forEach(dino => {
    const opt = document.createElement('option');
    opt.value = dino;
    opt.textContent = dino;
    selectMutated.appendChild(opt);
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

  selectMutated.addEventListener('change', calculateMutated);
  calculateMutated();
}

function calculateMutated() {
  const dinoName = selectMutated.value;
  const basePrice = MUTATED_DINOS[dinoName] || 0;
  mutatedBasePriceEl.textContent = `${basePrice.toLocaleString()} DodoCoins`;

  // Factores según fórmula Excel:
  // G4 = ((G2 / 4) * 1.5) / 254
  // H4 = ((G2 / 4) / 2) / 254
  // I4 = ((G2 / 4) * 1.25) / 254
  const factorPrincipal = ((basePrice / 4) * 1.5) / 254;
  const factorSecundariaH = ((basePrice / 4) / 2) / 254;
  const factorSecundariaI = ((basePrice / 4) * 1.25) / 254;

  const chkVida = document.getElementById('chk-mut-vida').checked;
  const chkDano = document.getElementById('chk-mut-dano').checked;
  const hasAnyPrincipal = chkVida || chkDano;

  let totalSinCastrar = 0;

  // Cálculo de estadísticas principales
  if (chkVida) totalSinCastrar += Number(document.getElementById('val-mut-vida').value || 0) * factorPrincipal;
  if (chkDano) totalSinCastrar += Number(document.getElementById('val-mut-dano').value || 0) * factorPrincipal;

  // Cálculo de estadísticas secundarias según reglas de exclusión mutua de la planilla
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

// Inicializar Dinos Base
function initBase() {
  Object.keys(BASE_DINOS).sort().forEach(dino => {
    const opt = document.createElement('option');
    opt.value = dino;
    opt.textContent = dino;
    selectBase.appendChild(opt);
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

  selectBase.addEventListener('change', calculateBase);
  calculateBase();
}

function calculateBase() {
  const dinoName = selectBase.value;
  const tier = BASE_DINOS[dinoName] ?? 4;
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

// Arranque
initMutated();
initBase();