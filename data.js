// Base Tier Multipliers
export const BASE_TIER_RATES = {
  0: { hp_dmg: 54.0, eng_wgt: 38.0, other: 32.0 },
  1: { hp_dmg: 42.42857, eng_wgt: 29.85714, other: 25.14286 },
  2: { hp_dmg: 30.85714, eng_wgt: 21.71429, other: 18.28571 },
  3: { hp_dmg: 23.14286, eng_wgt: 16.28571, other: 13.71429 },
  4: { hp_dmg: 15.42857, eng_wgt: 10.85714, other: 9.14286 },
  5: { hp_dmg: 5.71429, eng_wgt: 5.42857, other: 4.57143 },
  6: { hp_dmg: 2.28571, eng_wgt: 2.17143, other: 1.82857 }
};

// Packed Dinosaurs Data
const _D_NAMES = [
  "Abeja Gigante","Achatina","Alosaurio","Amargasaurio","Amonites","Andrewsarchus",
  "Anguila Electrica","Anquilosaurio","Araneo","Argentavis","Arqueoptérix","Arthropluera",
  "Asolador","Astrocetus","Astrodelphis","Ave del Terror","Baryonyx","Basilisk",
  "Basilosaurio","Beelzebufo","Bloodstalker","Brontosaurio","Buho de las Nieves","Buitre",
  "Bulbdog","Calicotero","Calicotherium","Carbonemys","Carchandotosaurio","Carnotauro",
  "Castoroides","Celacanto","Cerdas Brillantes","Compy","Daeodon","Deinonico",
  "Deinosuchus","Desmodus","Diablo Espinoso","Dientes de Sable","Dilofosaurio","Dimetrodon",
  "Dimorphodon","Dinophitecus","Dinopithecus","Diplocaulus","Diplodocus","Dodo",
  "Doedicurus","Dunkleosteus","Ejecutor","Electroforo","Enforcer","Equus",
  "Escarabajo Pelotero","Escorpion","Espinosaurio","Estegosaurio","Fasolasuchus","Fenrir",
  "Ferox","Fjordhawk","Gacha","Gali","Gallimimo","Gasbag",
  "Gasbags","Giganotosaurio","Gigantopithecus","Grifo","Hesperornis","Hyaenodon",
  "Ichthyosaurus","Ictiornis","Iguanodon","Jerboa","Kairuku","Kaprosuchus",
  "Karkinos","Kentrosaurio","Lacerador","Liopleurodon","Listrosaurio","Lobo Gigante",
  "Lobo Terrible","Lumigeco","Lutrea","Lymantria","Lystrosaurus","Maewing",
  "Magmasaurio","Mamut","Managarmr","Manta","Mantis","Megachelon",
  "Megalania","Megaloceros","Megalodon","Megalodón","Megalosaurio","Megatherium",
  "Mesopithecus","Microraptor","Morellatops","Mosasaurio","Moschops","Noglin",
  "Nutria","Oasisaur","Onychonycteris","Onyc","Oso Gigante","Oviraptor",
  "Ovis","Pachy","Pachyrhinosaurus","Paquicefalosaurio","Paracer","Paraceraterio",
  "Parasaurio","Pegomastax","Pelagornis","Pez Abisal","Phiomia","Phoenix",
  "Plesiosaurio","Pluminoso","Polilla","Procoptodon","Pteranodon","Pulmonoscorpio",
  "Pulmonoscorpius","Purlovia","Quetzal","Raptor","Rata Gigante","Ravager",
  "Reaper","Rex","Rhyniognatha","Rinoceronte Lanudo","Rock Drake","Rock Elemental",
  "Rock Golem","Roll Rat","Sarcosuchus","Scout","Segador","Shadowmane",
  "Shinehorn","Sinomacrops","Stryder","Tapejara","Tericinosaurio","Thylacoleo",
  "Titanoboa","Titanosaurio","Torito","Tortuga marina","Triceratops","Trilobites",
  "Troodon","Trophegnatus","Tropegnathus","Tropeognathus","Tusoteuthis","Unicornio",
  "Velona","Velonasaurio","Víbora","Wyvern","Wyvern Tek","Wyvern de Cristal Ambar",
  "Wyvern de Cristal Sangriento","Wyvern de Cristal Tropical","Wyvern de Fuego","Wyvern de Hielo","Wyvern de Rayo","Wyvern de Veneno",
  "Yutirano","Yutyrannus"
];

// Base Dinos Tier Index (0 a 6)
const _T_MAP = {
  "Abeja Gigante":6,"Achatina":5,"Alosaurio":4,"Amargasaurio":3,"Amonites":6,"Andrewsarchus":4,
  "Anguila Electrica":5,"Anquilosaurio":4,"Araneo":5,"Argentavis":3,"Arqueoptérix":5,"Arthropluera":4,
  "Asolador":3,"Astrocetus":2,"Astrodelphis":3,"Ave del Terror":5,"Baryonyx":4,"Basilisk":3,
  "Basilosaurio":2,"Beelzebufo":5,"Bloodstalker":3,"Brontosaurio":0,"Buho de las Nieves":3,"Buitre":5,
  "Bulbdog":5,"Calicotero":4,"Calicotherium":4,"Carbonemys":5,"Carchandotosaurio":0,"Carnotauro":4,
  "Castoroides":5,"Celacanto":6,"Cerdas Brillantes":5,"Compy":6,"Daeodon":4,"Deinonico":4,
  "Deinosuchus":2,"Desmodus":3,"Diablo Espinoso":4,"Dientes de Sable":4,"Dilofosaurio":6,"Dimetrodon":4,
  "Dimorphodon":5,"Dinophitecus":3,"Dinopithecus":3,"Diplocaulus":5,"Diplodocus":2,"Dodo":6,
  "Doedicurus":3,"Dunkleosteus":3,"Ejecutor":3,"Electroforo":5,"Enforcer":3,"Equus":4,
  "Escarabajo Pelotero":6,"Escorpion":5,"Espinosaurio":2,"Estegosaurio":3,"Fasolasuchus":1,"Fenrir":3,
  "Ferox":2,"Fjordhawk":4,"Gacha":3,"Gali":5,"Gallimimo":5,"Gasbag":3,
  "Gasbags":3,"Giganotosaurio":0,"Gigantopithecus":3,"Grifo":3,"Hesperornis":4,"Hyaenodon":5,
  "Ichthyosaurus":6,"Ictiornis":5,"Iguanodon":4,"Jerboa":5,"Kairuku":6,"Kaprosuchus":4,
  "Karkinos":2,"Kentrosaurio":4,"Lacerador":3,"Liopleurodon":4,"Listrosaurio":6,"Lobo Gigante":4,
  "Lobo Terrible":4,"Lumigeco":5,"Lutrea":4,"Lymantria":5,"Lystrosaurus":6,"Maewing":3,
  "Magmasaurio":3,"Mamut":3,"Managarmr":1,"Manta":5,"Mantis":3,"Megachelon":2,
  "Megalania":4,"Megaloceros":4,"Megalodon":4,"Megalodón":4,"Megalosaurio":3,"Megatherium":2,
  "Mesopithecus":5,"Microraptor":5,"Morellatops":5,"Mosasaurio":0,"Moschops":4,"Noglin":3,
  "Nutria":4,"Oasisaur":1,"Onychonycteris":5,"Onyc":5,"Oso Gigante":3,"Oviraptor":6,
  "Ovis":5,"Pachy":5,"Pachyrhinosaurus":4,"Paquicefalosaurio":6,"Paracer":3,"Paraceraterio":2,
  "Parasaurio":4,"Pegomastax":6,"Pelagornis":5,"Pez Abisal":4,"Phiomia":4,"Phoenix":1,
  "Plesiosaurio":3,"Pluminoso":5,"Polilla":5,"Procoptodon":4,"Pteranodon":3,"Pulmonoscorpio":5,
  "Pulmonoscorpius":5,"Purlovia":4,"Quetzal":2,"Raptor":4,"Rata Gigante":4,"Ravager":3,
  "Reaper":1,"Rex":1,"Rhyniognatha":0,"Rinoceronte Lanudo":3,"Rock Drake":2,"Rock Elemental":2,
  "Rock Golem":2,"Roll Rat":3,"Sarcosuchus":3,"Scout":6,"Segador":1,"Shadowmane":1,
  "Shinehorn":5,"Sinomacrops":4,"Stryder":0,"Tapejara":4,"Tericinosaurio":2,"Thylacoleo":3,
  "Titanoboa":5,"Titanosaurio":1,"Torito":5,"Tortuga marina":2,"Triceratops":5,"Trilobites":0,
  "Troodon":6,"Trophegnatus":3,"Tropegnathus":3,"Tropeognathus":3,"Tusoteuthis":0,"Unicornio":3,
  "Velona":3,"Velonasaurio":3,"Víbora":5,"Wyvern":1,"Wyvern Tek":2,"Wyvern de Cristal Ambar":2,
  "Wyvern de Cristal Sangriento":2,"Wyvern de Cristal Tropical":2,"Wyvern de Fuego":2,"Wyvern de Hielo":2,"Wyvern de Rayo":2,"Wyvern de Veneno":2,
  "Yutirano":1,"Yutyrannus":2
};

// Mutated Prices Map
const _M_MAP = {
  "Alosaurio":100000,"Amargasaurio":100000,"Andrewsarchus":80000,"Anguila Electrica":60000,"Anquilosaurio":70000,"Araneo":70000,
  "Argentavis":80000,"Arqueoptérix":60000,"Arthropluera":70000,"Asolador":80000,"Astrocetus":140000,"Astrodelphis":70000,
  "Ave del Terror":60000,"Baryonyx":80000,"Basilisk":100000,"Basilosaurio":100000,"Beelzebufo":70000,"Bloodstalker":70000,
  "Brontosaurio":140000,"Buho de las Nieves":80000,"Buitre":60000,"Bulbdog":60000,"Calicotherium":70000,"Carbonemys":60000,
  "Carchandotosaurio":140000,"Carnotauro":70000,"Castoroides":60000,"Cerdas Brillantes":60000,"Compy":60000,"Daeodon":70000,
  "Deinonico":70000,"Desmodus":80000,"Diablo Espinoso":70000,"Dientes de Sable":70000,"Dilofosaurio":60000,"Dimetrodon":60000,
  "Dimorphodon":60000,"Dinopithecus":80000,"Diplocaulus":60000,"Diplodocus":80000,"Dodo":60000,"Doedicurus":80000,
  "Dunkleosteus":80000,"Ejecutor":70000,"Electroforo":60000,"Equus":70000,"Escarabajo Pelotero":60000,"Escorpion":70000,
  "Espinosaurio":120000,"Estegosaurio":80000,"Fenrir":100000,"Fjordhawk":80000,"Gacha":100000,"Gali":60000,
  "Gallimimo":60000,"Gasbag":80000,"Giganotosaurio":140000,"Gigantopithecus":70000,"Grifo":80000,"Hesperornis":60000,
  "Hyaenodon":60000,"Ichthyosaurus":60000,"Ictiornis":60000,"Iguanodon":70000,"Jerboa":60000,"Kairuku":60000,
  "Kaprosuchus":80000,"Karkinos":100000,"Kentrosaurio":70000,"Lacerador":100000,"Liopleurodon":70000,"Listrosaurio":60000,
  "Lobo Gigante":70000,"Lobo Terrible":70000,"Lumigeco":60000,"Lutrea":70000,"Lymantria":60000,"Lystrosaurus":60000,
  "Maewing":100000,"Magmasaurio":120000,"Mamut":80000,"Managarmr":120000,"Manta":70000,"Mantis":70000,
  "Megachelon":140000,"Megalania":70000,"Megaloceros":70000,"Megalodon":80000,"Megalodón":80000,"Megalosaurio":100000,
  "Megatherium":70000,"Mesopithecus":60000,"Microraptor":60000,"Morellatops":60000,"Mosasaurio":140000,"Moschops":80000,
  "Noglin":80000,"Nutria":70000,"Oasisaur":140000,"Onychonycteris":70000,"Onyc":60000,"Oso Gigante":70000,
  "Oviraptor":60000,"Ovis":60000,"Pachy":60000,"Pachyrhinosaurus":70000,"Paquicefalosaurio":60000,"Paracer":100000,
  "Paraceraterio":100000,"Parasaurio":70000,"Pegomastax":60000,"Pelagornis":60000,"Pez Abisal":60000,"Phiomia":60000,
  "Phoenix":120000,"Plesiosaurio":100000,"Pluminoso":60000,"Polilla":70000,"Procoptodon":70000,"Pteranodon":70000,
  "Pulmonoscorpio":60000,"Pulmonoscorpius":60000,"Purlovia":70000,"Quetzal":120000,"Raptor":70000,"Rata Gigante":70000,
  "Ravager":70000,"Reaper":120000,"Rex":120000,"Rhyniognatha":140000,"Rinoceronte Lanudo":70000,"Rock Drake":120000,
  "Rock Elemental":100000,"Rock Golem":120000,"Roll Rat":80000,"Sarcosuchus":70000,"Scout":60000,"Segador":120000,
  "Shadowmane":140000,"Shinehorn":60000,"Sinomacrops":60000,"Stryder":160000,"Tapejara":80000,"Tericinosaurio":100000,
  "Thylacoleo":80000,"Titanoboa":70000,"Titanosaurio":160000,"Torito":60000,"Tortuga marina":140000,"Triceratops":70000,
  "Troodon":60000,"Tropegnathus":100000,"Tropeognathus":120000,"Tusoteuthis":140000,"Unicornio":100000,"Velona":80000,
  "Velonasaurio":100000,"Víbora":60000,"Wyvern":140000,"Wyvern Tek":140000,"Wyvern de Cristal Ambar":120000,
  "Wyvern de Cristal Sangriento":120000,"Wyvern de Cristal Tropical":120000,"Wyvern de Fuego":120000,"Wyvern de Hielo":120000,
  "Wyvern de Rayo":120000,"Wyvern de Veneno":120000,"Yutirano":100000,"Yutyrannus":120000
};

export const BASE_DINOS = _T_MAP;
export const MUTATED_DINOS = _M_MAP;

// Recursos
export const RECURSOS_DATA = {
  "ACEITE": { ddc: 1, cant: 200 }, "AMBERGRIS": { ddc: 1, cant: 2 }, "ARCILLA": { ddc: 1, cant: 200 },
  "ARENA": { ddc: 1, cant: 500 }, "AZUFRE": { ddc: 1, cant: 50 }, "BAYAS": { ddc: 1, cant: 1000 },
  "BAYAS NARCOTICAS": { ddc: 1, cant: 150 }, "BILIS DE AMONITA": { ddc: 1, cant: 4 }, "BIOTOXINA": { ddc: 1, cant: 4 },
  "BOLA DE GAS CONGELADO": { ddc: 1, cant: 2 }, "CARBON VEGETAL": { ddc: 1, cant: 800 }, "CARNDE CORDERO": { ddc: 1, cant: 500 },
  "CARNE": { ddc: 1, cant: 500 }, "CARNE DE PESCADO": { ddc: 1, cant: 500 }, "CARNE PODRIDA": { ddc: 1, cant: 500 },
  "CARNE PRIME": { ddc: 1, cant: 500 }, "CARNE SECA": { ddc: 1, cant: 1 }, "CEMENTO": { ddc: 1, cant: 200 },
  "COMBUSTIBLE": { ddc: 1, cant: 75 }, "CORAZON CORRUPTO": { ddc: 10, cant: 1 }, "CRISTAL": { ddc: 1, cant: 50 },
  "ELECTRONICO": { ddc: 1, cant: 10 }, "ELEMENTO": { ddc: 8, cant: 1 }, "ESTIMULANTE": { ddc: 1, cant: 55 },
  "FERTILIZANTE": { ddc: 1, cant: 1 }, "FIBRA": { ddc: 1, cant: 2000 }, "FLOR RARA": { ddc: 1, cant: 60 },
  "FOSFORO": { ddc: 1, cant: 800 }, "FRUTAS Y VEGETALES": { ddc: 1, cant: 50 }, "GAS CONDENSADO": { ddc: 1, cant: 2 },
  "GASOLINA": { ddc: 1, cant: 50 }, "GEMA AZUL/ SAVIA AZUL": { ddc: 1, cant: 35 }, "GEMA ROJA/ SAVIA ROJA": { ddc: 1, cant: 35 },
  "GEMA VERDE": { ddc: 1, cant: 35 }, "GEZ DE PEZ ABISAL": { ddc: 1, cant: 10 }, "HONGOS ACUATICOS": { ddc: 1, cant: 250 },
  "KIBLE EXTRAORDINARIO": { ddc: 20, cant: 1 }, "LINGOTE DE METAL": { ddc: 1, cant: 35 }, "MADERA": { ddc: 1, cant: 1200 },
  "MADERA FUNGICA": { ddc: 1, cant: 600 }, "METAL": { ddc: 1, cant: 75 }, "MIEL": { ddc: 5, cant: 1 },
  "MUTAGEL": { ddc: 1, cant: 30 }, "MUTAGENO": { ddc: 30, cant: 1 }, "NARCOTICOS": { ddc: 1, cant: 55 },
  "NODULO CORRUPTO": { ddc: 1, cant: 30 }, "OBSIDIANA": { ddc: 1, cant: 40 }, "PAJA": { ddc: 1, cant: 2000 },
  "PELAJE": { ddc: 1, cant: 1000 }, "PERLA BLANCA": { ddc: 1, cant: 55 }, "PERLA NEGRA": { ddc: 1, cant: 5 },
  "PESCAO PRIME": { ddc: 1, cant: 500 }, "PIEDRA": { ddc: 1, cant: 1200 }, "PIEL": { ddc: 1, cant: 700 },
  "POLIMERO ORGANICO": { ddc: 1, cant: 30 }, "POLIMERO SOLIDO": { ddc: 1, cant: 20 }, "POLVORA": { ddc: 1, cant: 400 },
  "PRIME SECA": { ddc: 1, cant: 1 }, "QUERATINA": { ddc: 1, cant: 500 }, "QUITINA": { ddc: 1, cant: 500 },
  "SAL CRUDA": { ddc: 1, cant: 500 }, "SANGRE DE SANGUIJUELA": { ddc: 1, cant: 60 }, "SAVIA": { ddc: 1, cant: 50 },
  "SAVIA DE CACTUS": { ddc: 1, cant: 100 }, "SEDA": { ddc: 1, cant: 500 }, "SETA AGRIA": { ddc: 1, cant: 250 },
  "SETA ASPERA": { ddc: 1, cant: 250 }, "SETA AUREA": { ddc: 1, cant: 250 }, "SETA RARA": { ddc: 1, cant: 60 },
  "SILEX": { ddc: 1, cant: 1200 }, "SUSTRATO ABSORBENTE": { ddc: 1, cant: 1 }, "TROZO DE CAPARAZON": { ddc: 1, cant: 7 }
};

// BP & Items
export const BP_CATEGORIES = {
  "BP_ARMA_755": {
    label: "BP Arma (hasta 755% daño)",
    statLabel: "Daño (%)",
    maxStat: 755,
    ranges: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
    mults: [0.02, 0.05, 0.08, 0.20, 0.40, 0.50, 0.60, 0.66, 0.72, 0.78, 0.84, 0.90],
    items: {
      "ARCO COMPUESTO": 15000, "ARCO TEK": 400000, "BALLESTA": 50000, "ESCOPETA CORREDERA": 125000,
      "ESPADA DE METAL": 20000, "LANZALLAMAS": 50000, "LANZARPONES": 24000, "PICO METAL": 18000,
      "HACHA METAL": 18000, "LATIGO": 16000, "RIFLE DE CAÑON LARGO": 60000, "RIIFLE FRANCONTIRADOR": 50000,
      "SIERRA": 40000
    }
  },
  "BP_ARMA_325": {
    label: "BP Arma TEK / 325% daño",
    statLabel: "Daño (%)",
    maxStat: 325,
    ranges: [100, 125, 150, 175, 200, 225, 250, 275, 300, 325],
    mults: [0.02, 0.035, 0.10, 0.20, 0.32, 0.50, 0.70, 0.80, 0.90, 0.90],
    items: {
      "ESPADA TEK": 150000, "PISTOLA DE FASE": 125000, "RIFLE TEK": 125000, "TALADRO": 240000, "GARRA TEK": 150000
    }
  },
  "ARMA_755": {
    label: "Arma Fabricada (hasta 755% daño)",
    statLabel: "Daño (%)",
    maxStat: 755,
    ranges: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
    mults: [0.02, 0.05, 0.10, 0.24, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.90],
    items: {
      "ARCO COMPUESTO": 15000, "ARCO TEK": 300000, "BALLESTA": 10000, "ESCOPETA CORREDERA": 60000,
      "ESPADA DE METAL": 5000, "LANZALLAMAS": 10000, "LANZARPONES": 8000, "LATIGO": 4000,
      "RIFLE DE CAÑON LARGO": 15000, "RIFLE FRANCOTIRADOR": 8000, "PICO METAL": 6000, "HACHA METAL": 6000,
      "SIERRA": 10000
    }
  },
  "ARMA_325": {
    label: "Arma Fabricada TEK / 325% daño",
    statLabel: "Daño (%)",
    maxStat: 325,
    ranges: [100, 125, 150, 175, 200, 225, 250, 275, 300, 325],
    mults: [0.02, 0.035, 0.10, 0.20, 0.32, 0.50, 0.70, 0.80, 0.90, 0.90],
    items: {
      "ESPADA TEK": 80000, "PISTOLA DE FASE": 60000, "RIFLE TEK": 60000, "TALADRO": 120000, "GARRA TEK": 80000
    }
  },
  "BP_MONTURA": {
    label: "BP Montura (hasta 353 armor)",
    statLabel: "Armadura / Armor",
    maxStat: 353,
    ranges: [50, 100, 150, 200, 250, 300, 325, 350],
    mults: [0.03, 0.05, 0.11, 0.22, 0.31, 0.51, 0.71, 0.90],
    items: {
      "ALLOSAURIO": 70000, "BASILOSAURIO": 100000, "BEELZEBUFO": 45000, "BUHO DE LAS NIEVES": 120000,
      "CARCHA": 180000, "DAEDON": 70000, "DEINONICO": 120000, "DESMODUS": 180000,
      "DIPLODOCUS": 65000, "DIREBEAR": 70000, "EQUUS": 35000, "ESPINO": 120000,
      "ESTEGO": 65000, "GIGANOTO": 120000, "KARKINOS": 100000, "MAEWING": 110000,
      "MAGMASAURIO": 100000, "MANAGARM": 70000, "MANTIS": 80000, "MEGALODON": 80000,
      "MEGALODON TEK": 100000, "MEGALOSAURIO": 80000, "MEGATHERIUM": 110000, "MOSASAURIO": 120000,
      "MOSASAURIO TEK": 180000, "PARASAURIO": 45000, "PTERANODON": 45000, "PULMONOSCORPIO": 65000,
      "RAPTOR": 70000, "REX": 120000, "REX TEK": 180000, "RINOCERONTE": 65000,
      "ROCKDRAKE TEK": 180000, "TERICINO": 120000, "THYLACOLEO": 80000, "TUSOTUETHIS": 140000,
      "VELONA": 140000, "YUTIRANUS": 70000
    }
  },
  "MONTURA": {
    "label": "Montura Fabricada (hasta 353 armor)",
    statLabel: "Armadura / Armor",
    maxStat: 353,
    ranges: [50, 100, 150, 200, 250, 300, 325, 350],
    mults: [0.05, 0.10, 0.20, 0.30, 0.50, 0.70, 0.78, 0.90],
    items: {
      "ALLOSAURIO": 15000, "CARCHA": 30000, "DEINONICO": 20000, "DESMODUS": 40000,
      "ESPINO": 20000, "GIGANOTO": 20000, "MAGMASAURIO": 20000, "MANAGARM": 15000,
      "RAPTOR": 15000, "REX": 20000, "TUSOTUETHIS": 30000, "VELONA": 30000,
      "MANTIS": 18000, "MEGATHERIO": 20000, "TERICINO": 20000, "THYLACOLEO": 10000
    }
  }
};
