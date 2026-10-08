import type {PriceRow} from './price-resolve';

// Seed values (same as the first migration). Used only as an outage fallback when the database
// cannot be read at render time — the database is the source of truth.
export const DEFAULT_PRICES: PriceRow[] = [
  {service_type: 'information', scope: '*', amount_cents: 0},
  {service_type: 'consultation', scope: '*', amount_cents: 3000},
  {service_type: 'verification', scope: '*', amount_cents: 15000},
  {service_type: 'verification-et-lettre', scope: '*', amount_cents: 20000},
  {service_type: 'guides-de-demarche', scope: '*', amount_cents: 0},
  {service_type: 'assistance', scope: '*', amount_cents: 40000},
  {service_type: 'assistance', scope: 'kind:visa', amount_cents: 60000},
];
