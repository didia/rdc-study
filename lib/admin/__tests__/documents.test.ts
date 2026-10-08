import {describe, expect, it} from 'vitest';

import {documentPath, safeFileName, validateUpload} from '../documents';

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
