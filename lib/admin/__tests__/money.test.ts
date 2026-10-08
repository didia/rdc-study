import {describe, expect, it} from 'vitest';

import {effectivePrice, netByCurrency, paymentSuggestion, type PaymentRow} from '../money';

const pay = (kind: string, amount_cents: number, currency = 'USD', voided_at: string | null = null): PaymentRow => ({
  id: Math.random().toString(),
  kind,
  amount_cents,
  currency,
  voided_at,
});

describe('netByCurrency', () => {
  it('never mixes currencies, subtracts refunds and ignores voided payments', () => {
    const net = netByCurrency([
      pay('deposit', 30000),
      pay('balance', 5000),
      pay('refund', 2000),
      pay('balance', 10000, 'CDF'),
      pay('deposit', 99999, 'USD', '2026-01-01T00:00:00Z'),
    ]);
    expect(net).toEqual({USD: 33000, CDF: 10000});
  });
  it('is empty without payments', () => expect(netByCurrency([])).toEqual({}));
});

describe('effectivePrice', () => {
  it('prefers the agreed price, falls back to the quoted one', () => {
    expect(effectivePrice({agreed_price_cents: 35000, quoted_price_cents: 40000})).toBe(35000);
    expect(effectivePrice({agreed_price_cents: null, quoted_price_cents: 40000})).toBe(40000);
    expect(effectivePrice({agreed_price_cents: null, quoted_price_cents: null})).toBeNull();
  });
});

describe('paymentSuggestion', () => {
  const base = {price: 40000, currency: 'USD', depositShare: 0.5};
  it('suggests the deposit status at the deposit threshold', () => {
    expect(paymentSuggestion({...base, status: 'awaiting_payment', net: {USD: 20000}})).toEqual({status: 'deposit_paid', paid: 20000, threshold: 20000});
    expect(paymentSuggestion({...base, status: 'awaiting_payment', net: {USD: 19999}})).toBeNull();
  });
  it('suggests paid once the price is covered', () => {
    expect(paymentSuggestion({...base, status: 'deposit_paid', net: {USD: 40000}})?.status).toBe('paid');
  });
  it('does not suggest moving backwards or twice', () => {
    expect(paymentSuggestion({...base, status: 'deposit_paid', net: {USD: 20000}})).toBeNull();
    expect(paymentSuggestion({...base, status: 'in_progress', net: {USD: 40000}})).toBeNull();
  });
  it('ignores money in another currency and missing prices', () => {
    expect(paymentSuggestion({...base, status: 'awaiting_payment', net: {CDF: 99999999}})).toBeNull();
    expect(paymentSuggestion({...base, price: null, status: 'awaiting_payment', net: {USD: 1}})).toBeNull();
  });
});
