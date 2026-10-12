import {z} from 'zod';

import {destinationFromSlug, normalizeCountry, normalizePhone, ORIGIN_COUNTRIES, SERVICE_TYPES} from './vocab';

const SERVICE_CODES = SERVICE_TYPES.map((s) => s.code) as [string, ...string[]];

const answerValue = z.union([z.boolean(), z.string().max(200), z.number()]);

// Body of POST /api/requests (the structured version of what the assistance form used to flatten into a sentence).
export const intakeSchema = z.object({
  idempotencyKey: z.string().min(8).max(100),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  originCountry: z.string().trim().min(1).max(80),
  destinationCountry: z.string().trim().max(60).optional().or(z.literal('')),
  packageSlug: z.string().trim().max(80).optional().or(z.literal('')),
  serviceType: z.enum(SERVICE_CODES),
  formAnswers: z.record(z.string().max(60), answerValue).refine((o) => Object.keys(o).length <= 30).default({}),
  message: z.string().max(2000).default(''),
  sourceUrl: z.string().max(500).optional().or(z.literal('')),
  displayedPriceCents: z.number().int().min(0).max(10_000_000).optional(),
  website: z.string().max(200).optional(), // honeypot: real visitors leave it empty
  turnstileToken: z.string().max(4000).optional(),
});

export type IntakeBody = z.infer<typeof intakeSchema>;

export type IntakeIssue = {field: string; message: string};

/**
 * Checks the body against the catalogue (package slugs come from data/assistance-packages) and builds the
 * payload for the SQL function `submit_service_request`.
 */
export function buildSubmission(
  body: IntakeBody,
  knownPackageSlugs: string[],
): {payload: Record<string, unknown>} | {issues: IntakeIssue[]} {
  const issues: IntakeIssue[] = [];
  const packageSlug = body.packageSlug || null;

  if (packageSlug && !knownPackageSlugs.includes(packageSlug)) {
    issues.push({field: 'packageSlug', message: 'Unknown package'});
  }
  if (body.serviceType === 'assistance' && !packageSlug) {
    issues.push({field: 'packageSlug', message: 'A package is required for assistance'});
  }
  if (issues.length) return {issues};

  const phone = body.phone || null;
  return {
    payload: {
      idempotencyKey: body.idempotencyKey,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone,
      phoneE164: normalizePhone(phone),
      originCountry: normalizeCountry(body.originCountry, ORIGIN_COUNTRIES) ?? body.originCountry,
      destinationCountry: destinationFromSlug(body.destinationCountry) ?? (body.destinationCountry || null),
      packageSlug,
      serviceType: body.serviceType,
      formAnswers: body.formAnswers,
      message: body.message,
      sourceUrl: body.sourceUrl || null,
      displayedPriceCents: body.displayedPriceCents,
    },
  };
}
