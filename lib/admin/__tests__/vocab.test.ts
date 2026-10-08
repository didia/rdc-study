import {describe, expect, it} from 'vitest';

import {normalizeCountry, normalizePhone, ORIGIN_COUNTRIES, whatsappLink} from '../vocab';

describe('normalizeCountry', () => {
  it('maps messy spellings to the canonical label', () => {
    expect(normalizeCountry('congo-kinshasa', ['Congo-Kinshasa', 'Guinée'])).toBe('Congo-Kinshasa');
    expect(normalizeCountry('GUINEE', ['Congo-Kinshasa', 'Guinée'])).toBe('Guinée');
    expect(normalizeCountry('  guinée ', ['Guinée'])).toBe('Guinée');
  });

  it('returns null for unknown or empty values', () => {
    expect(normalizeCountry('Atlantis', ['Guinée'])).toBeNull();
    expect(normalizeCountry('', ['Guinée'])).toBeNull();
    expect(normalizeCountry(undefined, ['Guinée'])).toBeNull();
  });

  it('knows the form origin countries', () => {
    expect(ORIGIN_COUNTRIES).toContain('Autre');
    expect(normalizeCountry('république démocratique du congo', ORIGIN_COUNTRIES)).toBe('République Démocratique du Congo');
  });
});

describe('normalizePhone', () => {
  it('accepts international numbers', () => {
    expect(normalizePhone('+243 81 234 5678')).toBe('+243812345678');
    expect(normalizePhone('00243-81-234-5678')).toBe('+243812345678');
    expect(normalizePhone('+1 (581) 318-0180')).toBe('+15813180180');
  });

  it('drops a parenthesised trunk zero', () => {
    expect(normalizePhone('+243 (0) 81 234 5678')).toBe('+243812345678');
  });

  it('refuses what it cannot complete reliably', () => {
    expect(normalizePhone('081 234 5678')).toBeNull();
    expect(normalizePhone('+12')).toBeNull();
    expect(normalizePhone('+0123456789')).toBeNull();
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone(null)).toBeNull();
  });
});

describe('whatsappLink', () => {
  it('builds a wa.me link with encoded text', () => {
    expect(whatsappLink('+243812345678', 'Bonjour, ça va ?')).toBe(
      'https://wa.me/243812345678?text=Bonjour%2C%20%C3%A7a%20va%20%3F',
    );
    expect(whatsappLink(null)).toBeNull();
  });
});
