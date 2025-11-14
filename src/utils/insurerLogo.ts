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
  abeille: '/insurances/abeille.png',
  acheel: '/insurances/acheel.png',
  acommeassure: '/insurances/acommeassure.png',
  active: '/insurances/active.jpeg',
  aema: '/insurances/aema.png',
  aesio: '/insurances/aesio.png',
  ag2r: '/insurances/ag2r.png',
  alan: '/insurances/alan.png',
  allianz: '/insurances/allianz.png',
  almerys: '/insurances/almerys.png',
  alptis: '/insurances/alptis.png',
  amf: '/insurances/amf.png',
  amv: '/insurances/amv.png',
  aon: '/insurances/aon.png',
  apicil: '/insurances/apicil.png',
  apivia: '/insurances/apivia.png',
  april: '/insurances/april.png',
  areas: '/insurances/areas.png',
  assurbonplan: '/insurances/assurbonplan.png',
  assureo: '/insurances/assureo.png',
  assurone: '/insurances/assurone.png',
  assuronline: '/insurances/assuronline.png',
  assurpeople: '/insurances/assurpeople.png',
  avenir: '/insurances/avenir.png',
  axa: '/insurances/axa.png',
  banquepalatine: '/insurances/banquepalatine.png',
  banquepopulaire: '/insurances/banquepopulaire.png',
  bforbank: '/insurances/bforbank.png',
  bnp: '/insurances/bnp.png',
  boursorama: '/insurances/boursorama.png',
  caisseepargne: '/insurances/caisseepargne.png',
  carrefour: '/insurances/carrefour.png',
  cegema: '/insurances/cegema.png',
  chubb: '/insurances/chubb.png',
  cic: '/insurances/cic.png',
  cnp: '/insurances/cnp.png',
  coface: '/insurances/coface.png',
  covea: '/insurances/covea.png',
  creditagricole: '/insurances/creditagricole.png',
  creditcooperatif: '/insurances/creditcooperatif.png',
  creditmutuel: '/insurances/creditmutuel.png',
  directassurance: '/insurances/directassurance.png',
  eca: '/insurances/eca.png',
  euroassurance: '/insurances/euroassurance.png',
  eurofil: '/insurances/eurofil.png',
  europassistance: '/insurances/europassistance.png',
  fortuneo: '/insurances/fortuneo.png',
  generali: '/insurances/generali.png',
  gmf: '/insurances/gmf.png',
  groupama: '/insurances/groupama.png',
  harmonie: '/insurances/harmonie.png',
  hdi: '/insurances/hdi.png',
  hellobank: '/insurances/hellobank.png',
  henner: '/insurances/henner.png',
  heyme: '/insurances/heyme.png',
  hsbc: '/insurances/hsbc.png',
  kenko: '/insurances/kenko.png',
  klesia: '/insurances/klesia.png',
  lbp: '/insurances/lbp.png',
  lcl: '/insurances/lcl.png',
  lemonade: '/insurances/lemonade.png',
  leocare: '/insurances/leocare.png',
  lmde: '/insurances/lmde.png',
  lolivier: '/insurances/lolivier.png',
  luko: '/insurances/luko.png',
  maaf: '/insurances/maaf.png',
  macif: '/insurances/macif.png',
  macsf: '/insurances/macsf.png',
  mae: '/insurances/mae.png',
  maif: '/insurances/maif.png',
  malakoff: '/insurances/malakoff.png',
  mfif: '/insurances/mfif.png',
  mgas: '/insurances/mgas.png',
  mgc: '/insurances/mgc.png',
  mgefi: '/insurances/mgefi.png',
  mgen: '/insurances/mgen.png',
  mgps: '/insurances/mgps.png',
  mielmut: '/insurances/mielmut.png',
  mma: '/insurances/mma.png',
  mmc: '/insurances/mmc.png',
  mnh: '/insurances/mnh.png',
  mnt: '/insurances/mnt.png',
  monabanq: '/insurances/monabanq.png',
  mutualia: '/insurances/mutualia.png',
  mutuelledesmotards: '/insurances/mutuelledesmotards.png',
  mutuelle403: '/insurances/mutuelle403.png',
  mutuelledefranceunie: '/insurances/mutuelledefranceunie.png',
  poitiers: '/insurances/poitiers.png',
  mutuellefamiliale: '/insurances/mutuellefamiliale.png',
  lamutuellegenerale: '/insurances/lamutuellegenerale.png',
  mgp: '/insurances/mgp.png',
  mget: '/insurances/mget.png',
  mutuelleinteriale: '/insurances/mutuelleinteriale.png',
  mutuellejust: '/insurances/mutuellejust.png',
  mutuellesaintchristophe: '/insurances/mutuellesaintchristophe.png',
  lamutuelleverte: '/insurances/lamutuelleverte.png',
  probtp: '/insurances/probtp.png',
  scor: '/insurances/scor.png',
  smabtp: '/insurances/smabtp.png',
  smeno: '/insurances/smeno.png',
  smi: '/insurances/smi.png',
  sg: '/insurances/sg.png',
  sollyazar: '/insurances/sollyazar.png',
  swisslife: '/insurances/swisslife.png',
  thelem: '/insurances/thelem.png',
  umc: '/insurances/umc.png',
  verlingue: '/insurances/verlingue.png',
  wakam: '/insurances/wakam.png',
  zurichinsurance: '/insurances/zurichinsurance.png',
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
