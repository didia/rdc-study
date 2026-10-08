// Price resolution shared by the public form (browser) and the console. It mirrors the SQL function
// `resolve_price(service_type, package_slug)`: the most specific scope wins —
// 'pkg:<package_slug>' -> 'kind:<last slug segment>' -> '*'.

export type PriceRow = {service_type: string; scope: string; amount_cents: number};

export function priceFor(prices: PriceRow[], serviceType: string, packageSlug?: string | null): number | null {
  const forService = prices.filter((p) => p.service_type === serviceType);
  const kind = packageSlug ? packageSlug.split('/').pop() : undefined;
  const scopes = [packageSlug ? `pkg:${packageSlug}` : null, kind ? `kind:${kind}` : null, '*'];
  for (const scope of scopes) {
    if (!scope) continue;
    const match = forService.find((p) => p.scope === scope);
    if (match) return match.amount_cents;
  }
  return null;
}

/** Cheapest price of a service across all its scopes, and whether prices differ (for "À partir de"). */
export function lowestPrice(prices: PriceRow[], serviceType: string): {cents: number; varies: boolean} | null {
  const amounts = prices.filter((p) => p.service_type === serviceType).map((p) => p.amount_cents);
  if (amounts.length === 0) return null;
  const cents = Math.min(...amounts);
  return {cents, varies: amounts.some((a) => a !== cents)};
}
