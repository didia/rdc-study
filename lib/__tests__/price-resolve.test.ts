import {describe, expect, it} from 'vitest';

import {AssistanceTypes} from '../../src/constants/assistance';
import {DEFAULT_PRICES} from '../default-prices';
import {lowestPrice, priceFor, type PriceRow} from '../price-resolve';

describe('priceFor (mirrors resolve_price in SQL)', () => {
  it('uses the visa price for visa packages and the default elsewhere', () => {
    expect(priceFor(DEFAULT_PRICES, 'assistance', 'canada/visa')).toBe(60000);
    expect(priceFor(DEFAULT_PRICES, 'assistance', 'canada/admission')).toBe(40000);
    expect(priceFor(DEFAULT_PRICES, 'assistance', 'canada/caq')).toBe(40000);
    expect(priceFor(DEFAULT_PRICES, 'assistance', 'belgique/equivalence')).toBe(40000);
  });

  it('lets a package exception beat the kind price, for that package only', () => {
    const prices: PriceRow[] = [...DEFAULT_PRICES, {service_type: 'assistance', scope: 'pkg:canada/visa', amount_cents: 70000}];
    expect(priceFor(prices, 'assistance', 'canada/visa')).toBe(70000);
    expect(priceFor(prices, 'assistance', 'france/visa')).toBe(60000);
  });

  it('falls back to the default when there is no package', () => {
    expect(priceFor(DEFAULT_PRICES, 'consultation')).toBe(3000);
    expect(priceFor(DEFAULT_PRICES, 'assistance', null)).toBe(40000);
  });

  it('returns null for an unknown service', () => {
    expect(priceFor(DEFAULT_PRICES, 'nope', 'canada/visa')).toBeNull();
  });

  it('has a fallback price for every service type the form can offer', () => {
    for (const type of Object.values(AssistanceTypes)) {
      expect(priceFor(DEFAULT_PRICES, type, 'canada/admission'), type).not.toBeNull();
    }
  });
});

describe('lowestPrice', () => {
  it('reports the cheapest price and whether prices vary (À partir de)', () => {
    expect(lowestPrice(DEFAULT_PRICES, 'assistance')).toEqual({cents: 40000, varies: true});
    expect(lowestPrice(DEFAULT_PRICES, 'consultation')).toEqual({cents: 3000, varies: false});
    expect(lowestPrice(DEFAULT_PRICES, 'unknown')).toBeNull();
  });
});
