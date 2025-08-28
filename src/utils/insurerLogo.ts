export const getInsurerLogo = (insurer: string): string | undefined => {
  const normalized = insurer
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // remove non-alphanum
    .replace('mutuelle', '') // remove 'mutuelle' for harmony
    .replace('assurances', '') // remove 'assurances'
    .replace('assurance', '') // remove 'assurance'
    .replace(' ', '');
  // Known mapping for some edge cases
  if (normalized.includes('axa')) return '/insurances/axa.png';
  if (normalized.includes('maif')) return '/insurances/maif.png';
  if (normalized.includes('macif')) return '/insurances/macif.png';
  if (normalized.includes('groupama')) return '/insurances/groupama.png';
  if (normalized.includes('generali')) return '/insurances/generali.png';
  if (normalized.includes('allianz')) return '/insurances/allianz.png';
  if (normalized.includes('direct')) return '/insurances/direct.png';
  if (normalized.includes('kenko')) return '/insurances/kenko.png';
  if (normalized.includes('harmonie')) return '/insurances/maif.png'; // fallback for Harmonie Mutuelle
  return undefined;
}; 