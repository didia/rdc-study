import {describe, expect, it} from 'vitest';

import {safeAdminPath} from '../safe-redirect';

describe('safeAdminPath', () => {
  it('keeps admin paths, with query strings', () => {
    expect(safeAdminPath('/admin')).toBe('/admin');
    expect(safeAdminPath('/admin/demandes?status=new&page=2')).toBe('/admin/demandes?status=new&page=2');
  });

  it('falls back for empty values', () => {
    expect(safeAdminPath(undefined)).toBe('/admin');
    expect(safeAdminPath(null)).toBe('/admin');
    expect(safeAdminPath('')).toBe('/admin');
    expect(safeAdminPath('', '/admin/mot-de-passe')).toBe('/admin/mot-de-passe');
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '/admin\\..\\evil',
    '/administrator',
    '/adminx/page',
    '/other',
    'admin',
    '/admin/\nfoo',
  ])('rejects %j', (value) => {
    expect(safeAdminPath(value)).toBe('/admin');
  });
});
