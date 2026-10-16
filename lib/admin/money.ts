// Money helpers. Amounts are integer cents; nothing here ever adds two different currencies.

export type PaymentRow = {
  id: string;
  kind: 'deposit' | 'balance' | 'full' | 'refund' | string;
  amount_cents: number;
  currency: string;
  voided_at: string | null;
};

export const CURRENCIES = ['USD', 'CDF', 'EUR'] as const;

export const PAYMENT_KINDS = [
  {code: 'deposit', label: 'Acompte'},
  {code: 'balance', label: 'Solde'},
  {code: 'full', label: 'Paiement total'},
  {code: 'refund', label: 'Remboursement'},
] as const;

export const PAYMENT_METHODS = [
  {code: 'mobile_money', label: 'Mobile Money'},
  {code: 'cash_office', label: 'Espèces au bureau'},
  {code: 'bank_transfer', label: 'Virement'},
  {code: 'other', label: 'Autre'},
] as const;

export const kindLabel = (code: string) => PAYMENT_KINDS.find((k) => k.code === code)?.label ?? code;
export const methodLabel = (code: string) => PAYMENT_METHODS.find((m) => m.code === code)?.label ?? code;

/** Net received per currency: refunds subtract, voided payments are ignored. */
export function netByCurrency(payments: PaymentRow[]): Record<string, number> {
  const net: Record<string, number> = {};
  for (const p of payments) {
    if (p.voided_at) continue;
    net[p.currency] = (net[p.currency] ?? 0) + (p.kind === 'refund' ? -p.amount_cents : p.amount_cents);
  }
  return net;
}

export const formatCents = (cents: number, currency = 'USD') =>
  new Intl.NumberFormat('fr-CA', {style: 'currency', currency, maximumFractionDigits: 2}).format(cents / 100);

/** Price the client owes: the agreed price once set, otherwise the price quoted at submission. */
export function effectivePrice(request: {agreed_price_cents: number | null; quoted_price_cents: number | null}): number | null {
  return request.agreed_price_cents ?? request.quoted_price_cents;
}

export type PaymentSuggestion = {status: 'deposit_paid' | 'paid'; paid: number; threshold: number} | null;

/**
 * One-click status suggestions (never applied silently): `paid` once the price is covered, `deposit_paid` once the
 * deposit share is. Only for the request's own currency, only for open or won requests, and only moving forward:
 * "forward" is judged on the statuses' sort order (an admin-editable table), not on a list of codes.
 */
export function paymentSuggestion(args: {
  status: string;
  stage: string | undefined;
  /** sort_order of every status code */
  order: Record<string, number>;
  price: number | null;
  currency: string;
  net: Record<string, number>;
  depositShare: number;
}): PaymentSuggestion {
  const {status, stage, order, price, currency, net, depositShare} = args;
  if (!price || price <= 0 || stage === 'lost') return null;
  const here = order[status];
  const paidAt = order.paid;
  const depositAt = order.deposit_paid;
  if (here === undefined || paidAt === undefined || depositAt === undefined) return null;
  const paid = net[currency] ?? 0;
  if (here >= paidAt) return null;
  if (paid >= price) return {status: 'paid', paid, threshold: price};
  const deposit = Math.round(price * depositShare);
  if (here < depositAt && deposit > 0 && paid >= deposit) return {status: 'deposit_paid', paid, threshold: deposit};
  return null;
}
