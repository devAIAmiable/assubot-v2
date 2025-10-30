import { describe, expect, it } from 'vitest';
import { getInsurerLogo } from './insurerLogo';

describe('getInsurerLogo', () => {
  it('returns undefined for empty input', () => {
    expect(getInsurerLogo(undefined)).toBeUndefined();
    // @ts-expect-error testing runtime guard
    expect(getInsurerLogo('')).toBeUndefined();
  });

  it('resolves existing known brands (contains-based)', () => {
    expect(getInsurerLogo('AXA Assurances')).toBe('/insurances/axa.png');
    expect(getInsurerLogo('MAIF')).toBe('/insurances/maif.png');
    expect(getInsurerLogo('Société Générale Assurances')).toBe('/insurances/sg.png');
  });

  it('normalizes diacritics and suffixes', () => {
    expect(getInsurerLogo('Aréas Assurances')).toBe('/insurances/areas-assurances.png');
    expect(getInsurerLogo('Caisse d’Épargne Assurance')).toBe('/insurances/caisse-depargne-assurances.png');
  });

  it('maps newly added brands (exact and variants)', () => {
    expect(getInsurerLogo('Abeille Assurances')).toBe('/insurances/abeille-assurances.png');
    expect(getInsurerLogo('AcommeAssure')).toBe('/insurances/acompassure.png');
    expect(getInsurerLogo('Acheel')).toBe('/insurances/acheel.png');
    expect(getInsurerLogo('Active Assurances')).toBe('/insurances/active-assurances.png');
    expect(getInsurerLogo('AMF Assurances')).toBe('/insurances/amf-assurances.png');
    expect(getInsurerLogo('Aon')).toBe('/insurances/aon.png');
    expect(getInsurerLogo('April')).toBe('/insurances/april.png');
    expect(getInsurerLogo('Assur Bon Plan')).toBe('/insurances/assur-bon-plan.png');
    expect(getInsurerLogo('Assuréo')).toBe('/insurances/assureo.png');
    expect(getInsurerLogo('AssurOnline')).toBe('/insurances/assuronline.png');
    expect(getInsurerLogo('AutoFirst')).toBe('/insurances/autofirst.png');
    expect(getInsurerLogo('Banque Populaire Assurances')).toBe('/insurances/banque-populaire-assurances.png');
    expect(getInsurerLogo('BNP Paribas Cardif')).toBe('/insurances/bnp-paribas-cardif.png');
    expect(getInsurerLogo('Cardif IARD')).toBe('/insurances/cardif-iard.png');
    expect(getInsurerLogo('Crédit Agricole Assurances')).toBe('/insurances/credit-agricole-assurances.png');
    expect(getInsurerLogo('Crédit Mutuel Assurance')).toBe('/insurances/credit-mutuel-assurance.png');
  });
});
