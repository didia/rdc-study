import fs from 'fs';
import os from 'os';
import path from 'path';
import {describe, expect, it} from 'vitest';

import {readContentIndex} from '../content-index';

describe('readContentIndex', () => {
  it('uses the front-matter date, never the file mtime', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-'));
    fs.mkdirSync(path.join(root, 'articles'));
    fs.mkdirSync(path.join(root, 'guides/usa'), {recursive: true});
    fs.writeFileSync(path.join(root, 'articles/a.md'), '---\ndate: "2018-06-30"\ntitle: A\ndraft: true\n---\n');
    fs.writeFileSync(path.join(root, 'guides/usa/visa.md'), '---\ntitle: Visa\n---\n');
    const entries = readContentIndex(root);
    expect(entries.find((e) => e.slug === 'a')).toMatchObject({date: '2018-06-30T00:00:00.000Z', draft: true});
    expect(entries.find((e) => e.slug === 'usa/visa')?.date).toBeNull();
  });
});
