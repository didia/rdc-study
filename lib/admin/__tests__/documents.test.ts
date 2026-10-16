import {describe, expect, it} from 'vitest';

import {documentPath, receiptBlocker, registrationFileName, safeFileName, validateUpload} from '../documents';

describe('documents', () => {
  it('limits size and type', () => {
    expect(validateUpload({size: 11 * 1024 * 1024, type: 'application/pdf'})).toBe('too_large');
    expect(validateUpload({size: 1000, type: 'image/svg+xml'})).toBe('type');
    expect(validateUpload({size: 1000, type: 'text/html'})).toBe('type');
    expect(validateUpload({size: 1000, type: 'application/pdf'})).toBeNull();
  });

  it('makes file names safe for paths and headers', () => {
    expect(safeFileName('Relevé de notes (2025).pdf')).toBe('Releve-de-notes-2025-.pdf');
    expect(safeFileName('../../etc/passwd')).toBe('etc-passwd');
    expect(safeFileName('"; filename=evil')).toBe('filename-evil');
    expect(safeFileName('???')).toBe('document');
    expect(safeFileName('')).toBe('document');
  });

  it('follows the request/<id>/<uuid>-<name> convention', () => {
    expect(documentPath('abc', 'u1', 'Diplôme.pdf')).toBe('request/abc/u1-Diplome.pdf');
  });
});

describe('registration metadata', () => {
  it('keeps names within the registration limit, preserving the extension', () => {
    const long = `${'a'.repeat(240)}.pdf`;
    const name = registrationFileName(long);
    expect(name).toHaveLength(200);
    expect(name.endsWith('.pdf')).toBe(true);
    expect(registrationFileName('contrat.pdf')).toBe('contrat.pdf');
    expect(registrationFileName('   ')).toBe('document');
    expect(registrationFileName('b'.repeat(300))).toHaveLength(200);
  });
});

describe('receipt eligibility', () => {
  it('allows received money only: no receipt for voided payments or refunds', () => {
    expect(receiptBlocker({kind: 'deposit', voided_at: null})).toBeNull();
    expect(receiptBlocker({kind: 'balance'})).toBeNull();
    expect(receiptBlocker({kind: 'deposit', voided_at: '2026-10-01T00:00:00Z'})).toBe('voided');
    expect(receiptBlocker({kind: 'refund', voided_at: null})).toBe('refund');
  });
});
