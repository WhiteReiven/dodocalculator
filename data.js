// Multiplicadores por Tier para Dinos Base (obtenidos de PRECIOS DINOS BASE.xlsx)
export const BASE_TIER_RATES = {
  0: { hp_dmg: 54.0, eng_wgt: 38.0, other: 32.0 },
  1: { hp_dmg: 42.42857, eng_wgt: 29.85714, other: 25.14286 },
  2: { hp_dmg: 30.85714, eng_wgt: 21.71429, other: 18.28571 },
  3: { hp_dmg: 23.14286, eng_wgt: 16.28571, other: 13.71429 },
  4: { hp_dmg: 15.42857, eng_wgt: 10.85714, other: 9.14286 },
  5: { hp_dmg: 5.71429, eng_wgt: 5.42857, other: 4.57143 },
  6: { hp_dmg: 2.28571, eng_wgt: 2.17143, other: 1.82857 }
};

// Dinos Base con su respectivo Tier
export const BASE_DINOS = {
  "Abeja Gigante": 6, "Achatina": 5, "Alosaurio": 4, "Amargasaurio": 3, "Amonites": 6,
  "Andrewsarchus": 4, "Anguila Electrica": 5, "Anquilosaurio": 4, "Archa": 6, "Argentavis": 4,
  "Arthropluera": 5, "Astrodelphis": 4, "Astrocetus": 0, "Baryonyx": 4, "Basilosaurio": 3,
  "Beelzebufo": 5, "Bloodstalker": 4, "Brontosaurio": 2, "Buho de las Nieves": 4, "Carcharodontosaurio": 0,
  "Carnotauro": 5, "Castoroides": 4, "Celacanto": 6, "Ceratosaurio": 3, "Chalicotherium": 5,
  "Compy": 6, "Daeodon": 4, "Deinonychus": 4, "Deinosuchus": 2, "Dilofosaurio": 6,
  "Dimetrodon": 6, "Dimorphodon": 6, "Diplocaulus": 6, "Diplodocus": 4, "Direbear": 4,
  "Direwolf": 5, "Dodo": 6, "Doedicurus": 4, "Dunkleosteus": 4, "Enforcer": 4,
  "Equus": 5, "Escarabajo": 6, "Espinosaúrio": 2, "Fasolasuchus": 1, "Featherlight": 5,
  "Ferox": 3, "Gacha": 4, "Gallimimo": 5, "Giganotosaurio": 0, "Gigantopithecus": 5,
  "Glowtail": 5, "Hesperornis": 6, "Hiena": 6, "Iguanodon": 5, "Kairuku": 6,
  "Kaprosuchus": 5, "Karkinos": 3, "Kentrosaurio": 5, "Lacerador": 3, "Lestrosaurio": 6,
  "Liopleurodon": 4, "Lobo Terrible": 5, "Lutrea": 5, "Magmasaurio": 1, "Mamut": 4,
  "Managarmr": 2, "Manta": 5, "Mantis": 4, "Megachelon": 2, "Megalania": 5,
  "Megaloceros": 5, "Megalodon": 4, "Megatherium": 4, "Microraptor": 6, "Morellatops": 5,
  "Moschops": 5, "Mosasaurio": 1, "Noglin": 0, "Oasisaur": 1, "Onychonycteris": 5,
  "Otter": 5, "Oviraptor": 6, "Ovis": 5, "Paquicefalosaurio": 6, "Paraceraterio": 3,
  "Parasaurio": 6, "Pegomastax": 6, "Pelagornis": 6, "Plesiosaurio": 2, "Procoptodon": 4,
  "Pteranodon": 5, "Pulmonoscorpius": 6, "Purlovia": 5, "Quetzal": 2, "Raptor": 5,
  "Ravager": 5, "Reaper": 1, "Rex": 2, "Rhyniognatha": 0, "Rock Drake": 1,
  "Rock Golem": 2, "Sarcosuchus": 5, "Shadowmane": 1, "Sinomacrops": 5, "Spino": 2,
  "Stegosaurio": 3, "Tapejara": 4, "Terror Bird": 6, "Therizinosaurio": 2, "Thylacoleo": 3,
  "Titanoboa": 6, "Titanosaurio": 0, "Triceratops": 5, "Troodon": 6, "Tropeognathus": 2,
  "Tusoteuthis": 1, "Velonasaurio": 3, "Woolly Rhino": 3, "Wyvern": 1, "Yutyrannus": 2
};

// Dinos Mutados con Precio Base (4 stats) (obtenidos de PRECIO DINOS MUTADOS.xlsx)
export const MUTATED_DINOS = {
  "Alosaurio": 100000, "Amargasaurio": 100000, "Andrewsarchus": 80000, "Asolador": 80000,
  "Anguila Electrica": 60000, "Anquilosaurio": 70000, "Araneo": 70000, "Argentavis": 80000,
  "Arqueoptérix": 60000, "Arthropluera": 70000, "Astrodelphis": 70000, "Ave del Terror": 60000,
  "Baryonyx": 80000, "Basilisk": 100000, "Basilosaurio": 100000, "Beelzebufo": 70000,
  "Bloodstalker": 70000, "Brontosaurio": 140000, "Buho de las Nieves": 80000, "Buitre": 60000,
  "Bulbdog": 60000, "Calicotherium": 70000, "Carcharodontosaurio": 250000, "Carnotauro": 70000,
  "Castoroides": 70000, "Ceratosaurio": 120000, "Compy": 60000, "Daeodon": 80000,
  "Deinonychus": 70000, "Deinosuchus": 140000, "Desmodus": 70000, "Dilofosaurio": 60000,
  "Dimetrodon": 60000, "Dimorphodon": 60000, "Diplocaulus": 60000, "Diplodocus": 80000,
  "Direwolf": 70000, "Dodo": 60000, "Doedicurus": 70000, "Dunkleosteus": 80000,
  "Enforcer": 70000, "Equus": 70000, "Escarabajo Pelotero": 60000, "Espinosaúrio": 120000,
  "Fasolasuchus": 180000, "Featherlight": 70000, "Ferox": 100000, "Gacha": 80000,
  "Gallimimo": 60000, "Giganotosaurio": 250000, "Gigantopithecus": 70000, "Glowtail": 70000,
  "Hesperornis": 60000, "Hiena": 60000, "Iguanodon": 60000, "Kairuku": 60000,
  "Kaprosuchus": 70000, "Karkinos": 100000, "Kentrosaurio": 70000, "Lacerador": 100000,
  "Lestrosaurio": 60000, "Liopleurodon": 70000, "Lobo Terrible": 70000, "Lutrea": 70000,
  "Magmasaurio": 180000, "Mamut": 80000, "Managarmr": 120000, "Manta": 70000,
  "Mantis": 80000, "Megachelon": 120000, "Megalania": 70000, "Megaloceros": 70000,
  "Megalodon": 80000, "Megatherium": 80000, "Microraptor": 60000, "Morellatops": 70000,
  "Moschops": 70000, "Mosasaurio": 180000, "Noglin": 250000, "Oasisaur": 180000,
  "Onychonycteris": 70000, "Oviraptor": 60000, "Ovis": 70000, "Paquicefalosaurio": 60000,
  "Paraceraterio": 100000, "Parasaurio": 60000, "Pegomastax": 60000, "Pelagornis": 60000,
  "Plesiosaurio": 120000, "Procoptodon": 80000, "Pteranodon": 70000, "Pulmonoscorpius": 60000,
  "Purlovia": 70000, "Quetzal": 120000, "Raptor": 60000, "Ravager": 70000,
  "Reaper": 180000, "Rex": 120000, "Rhyniognatha": 250000, "Rock Drake": 180000,
  "Rock Golem": 120000, "Sarcosuchus": 70000, "Shadowmane": 180000, "Sinomacrops": 70000,
  "Spino": 120000, "Stegosaurio": 100000, "Tapejara": 80000, "Terror Bird": 60000,
  "Therizinosaurio": 120000, "Thylacoleo": 100000, "Titanoboa": 60000, "Titanosaurio": 250000,
  "Triceratops": 70000, "Troodon": 60000, "Tropeognathus": 120000, "Tusoteuthis": 180000,
  "Velonasaurio": 100000, "Woolly Rhino": 100000, "Wyvern": 180000, "Yutyrannus": 120000
};