// Normalize a brand string to a comparable key that is resilient to
// accents, punctuation, common suffixes, and spacing.
const normalizeBrand = (value: string): string => {
  return (
    value
      .toLowerCase()
      // remove diacritics (accents)
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      // remove common suffixes/words
      .replace(/\bmutuelle\b/g, '')
      .replace(/\bassurances\b/g, '')
      .replace(/\bassurance\b/g, '')
      // remove all non-alphanumerics
      .replace(/[^a-z0-9]/g, '')
      // collapse spaces (after punctuation removal none should remain)
      .trim()
  );
};

// Map of canonical keys to logo paths
const canonicalKeyToLogoPath: Record<string, string> = {
  // Existing brands
  axa: '/insurances/axa.png',
  maif: '/insurances/maif.png',
  macif: '/insurances/macif.png',
  groupama: '/insurances/groupama.png',
  generali: '/insurances/generali.png',
  allianz: '/insurances/allianz.png',
  direct: '/insurances/direct.png',
  kenko: '/insurances/kenko.png',
  lcl: '/insurances/lcl.png',
  camca: '/insurances/camca.jpeg',
  sg: '/insurances/sg.png',
  societegenerale: '/insurances/sg.png',
  sgassurance: '/insurances/sg.png',
  harmonie: '/insurances/maif.png', // fallback for Harmonie Mutuelle

  // New brands from plan
  abeille: '/insurances/abeille.png',
  acomepasure: '/insurances/acomassure.png', // guard in case of typos
  acomepassure: '/insurances/acomassure.png',
  acommeassure: '/insurances/acomassure.png',
  acomassure: '/insurances/acomassure.png',
  acommpasure: '/insurances/acomassure.png',
  acommpassur: '/insurances/acomassure.png',
  acomassures: '/insurances/acomassure.png',
  acomepassur: '/insurances/acomassure.png',
  acomepass: '/insurances/acomassure.png',
  acommpass: '/insurances/acomassure.png',
  acomepassureassurances: '/insurances/acomassure.png',
  acommeassureassurances: '/insurances/acomassure.png',
  acheel: '/insurances/acheel.png',
  active: '/insurances/active.jpeg',
  amf: '/insurances/amf-assurances.png',
  aon: '/insurances/aon.png',
  april: '/insurances/april.png',
  areas: '/insurances/areas-assurances.png',
  assurbonplan: '/insurances/assur-bon-plan.png',
  assureo: '/insurances/assureo.png',
  assuronline: '/insurances/assuronline.png',
  autofirst: '/insurances/autofirst.png',
  banquepopulaire: '/insurances/banque-populaire-assurances.png',
  bnpparibascardif: '/insurances/bnp-paribas-cardif.png',
  bnp: '/insurances/bnp-paribas-cardif.png',
  cardif: '/insurances/bnp-paribas-cardif.png', // BNP entity general brand
  caisseepargne: '/insurances/caisse-depargne-assurances.png',
  cardifiard: '/insurances/cardif-iard.png',
  creditagricole: '/insurances/camca.jpeg',
  caassurances: '/insurances/camca.jpeg',
  creditmutuel: '/insurances/credit-mutuel-assurance.png',
};

// Aliases that should point to a canonical key above
const aliasToCanonicalKey: Record<string, string> = {
  // Existing variations
  societegenerale: 'sg',
  sgassurance: 'sg',

  // New brand variations and common forms
  abeilleassurances: 'abeille',
  abeilleassurance: 'abeille',
  acompassure: 'acomassure', // resilience to spelling
  acommeassure: 'acomassure',
  acommeassur: 'acomassure',
  acommeassures: 'acomassure',
  areasassurances: 'areas',
  areassurance: 'areas',
  banquepopulaireassurances: 'banquepopulaire',
  bnpparibas: 'bnpparibascardif',
  bnpcardif: 'bnpparibascardif',
  cardifiardassurances: 'cardifiard',
  caisseepargneassurances: 'caisseepargne',
  caisseepargneassurance: 'caisseepargne',
  cadepargne: 'caisseepargne',
  caassurance: 'caassurances',
  creditagricoleassurances: 'camca',
  creditmutuelassurance: 'creditmutuel',
};

export const getInsurerLogo = (insurer: string | undefined): string | undefined => {
  if (!insurer) return undefined;
  const normalized = normalizeBrand(insurer);

  // Resolve alias to canonical key if present
  const canonicalKey = aliasToCanonicalKey[normalized] ?? normalized;

  // Direct match
  if (canonicalKeyToLogoPath[canonicalKey]) {
    return canonicalKeyToLogoPath[canonicalKey];
  }

  // Contains-based heuristics as fallback (keep minimal for safety)
  if (normalized.includes('axa')) return '/insurances/axa.png';
  if (normalized.includes('maif')) return '/insurances/maif.png';
  if (normalized.includes('macif')) return '/insurances/macif.png';
  if (normalized.includes('groupama')) return '/insurances/groupama.png';
  if (normalized.includes('generali')) return '/insurances/generali.png';
  if (normalized.includes('allianz')) return '/insurances/allianz.png';
  if (normalized.includes('direct')) return '/insurances/direct.png';
  if (normalized.includes('kenko')) return '/insurances/kenko.png';
  if (normalized.includes('lcl')) return '/insurances/lcl.png';
  if (normalized.includes('camca')) return '/insurances/camca.jpeg';
  if (normalized.includes('sg') || normalized.includes('sgassurance') || normalized.includes('societegenerale')) return '/insurances/sg.png';
  if (normalized.includes('harmonie')) return '/insurances/maif.png';

  return undefined;
};
