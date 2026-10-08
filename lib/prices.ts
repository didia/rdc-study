import 'server-only';
import {unstable_cache} from 'next/cache';

import {createSupabaseServiceClient} from './admin/db/server';
import {isAdminConfigured} from './admin/env';
import {DEFAULT_PRICES} from './default-prices';
import type {PriceRow} from './price-resolve';

export const PRICES_TAG = 'service-prices';

const readPrices = unstable_cache(
  async (): Promise<PriceRow[]> => {
    const {data, error} = await createSupabaseServiceClient()
      .from('service_prices')
      .select('service_type, scope, amount_cents');
    // Throwing keeps a failed read out of the cache; the caller falls back below.
    if (error || !data || data.length === 0) throw new Error('Could not read service prices');
    return data;
  },
  ['service-prices'],
  {tags: [PRICES_TAG], revalidate: 3600},
);

/** Editable prices (cached, invalidated from /admin/tarifs). Never throws: falls back to the seed values. */
export async function getServicePrices(): Promise<PriceRow[]> {
  if (!isAdminConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return DEFAULT_PRICES;
  try {
    return await readPrices();
  } catch {
    return DEFAULT_PRICES;
  }
}
