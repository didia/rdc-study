import {describe, expect, it} from 'vitest';

import {buildSubmission, intakeSchema} from '../intake';
import {dollarsToCents} from '../price-scopes';

const base = {
  idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Amani',
  lastName: 'Mbuyi',
  email: 'Amani@Example.TEST ',
  phone: '+243 81 000 0001',
  originCountry: 'république démocratique du congo',
  destinationCountry: 'usa',
  packageSlug: 'usa/visa',
  serviceType: 'assistance',
  formAnswers: {hasAdmission: true},
  message: 'Bonjour',
  sourceUrl: 'https://www.rdcetudes.com/assistance-process',
  displayedPriceCents: 60000,
};
const slugs = ['usa/visa', 'canada/admission'];

describe('intake', () => {
  it('normalises a valid body into the SQL payload', () => {
    const body = intakeSchema.parse(base);
    const built = buildSubmission(body, slugs);
    if (!('payload' in built)) throw new Error('expected a payload');
    expect(built.payload).toMatchObject({
      email: 'amani@example.test',
      phoneE164: '+243810000001',
      originCountry: 'République Démocratique du Congo',
      destinationCountry: 'États-Unis',
      packageSlug: 'usa/visa',
    });
  });

  it('rejects unknown packages and assistance without a package', () => {
    const unknown = buildSubmission(intakeSchema.parse({...base, packageSlug: 'mars/visa'}), slugs);
    expect('issues' in unknown && unknown.issues[0].field).toBe('packageSlug');
    const missing = buildSubmission(intakeSchema.parse({...base, packageSlug: ''}), slugs);
    expect('issues' in missing).toBe(true);
    const info = buildSubmission(intakeSchema.parse({...base, serviceType: 'information', packageSlug: ''}), slugs);
    expect('payload' in info).toBe(true);
  });

  it('refuses malformed bodies', () => {
    expect(intakeSchema.safeParse({...base, email: 'nope'}).success).toBe(false);
    expect(intakeSchema.safeParse({...base, serviceType: 'free-money'}).success).toBe(false);
    expect(intakeSchema.safeParse({...base, idempotencyKey: 'x'}).success).toBe(false);
    expect(intakeSchema.safeParse({...base, formAnswers: {a: {nested: 1}}}).success).toBe(false);
  });

  it('keeps unknown phone formats instead of failing', () => {
    const built = buildSubmission(intakeSchema.parse({...base, phone: '081 000 0001'}), slugs);
    if (!('payload' in built)) throw new Error('expected a payload');
    expect(built.payload.phone).toBe('081 000 0001');
    expect(built.payload.phoneE164).toBeNull();
  });
});

describe('dollarsToCents', () => {
  it.each([
    ['450', 45000],
    ['450,5', 45050],
    ['0', 0],
    [' 1 200.25 ', 120025],
  ])('parses %j', (input, cents) => expect(dollarsToCents(input as string)).toBe(cents));

  it.each(['', 'abc', '-5', '1.234', '99999999999'])('rejects %j', (input) => expect(dollarsToCents(input)).toBeNull());
});
