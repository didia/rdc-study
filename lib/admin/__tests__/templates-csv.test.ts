import {describe, expect, it} from 'vitest';

import {csvCell, toCsv} from '../csv';
import {renderTemplate} from '../templates';

const vars = {first_name: 'Grace', package: 'Canada – Visa', reference: 'RDC-2026-0002', staff_name: 'Agent'};

describe('renderTemplate', () => {
  it('fills known placeholders', () => {
    expect(renderTemplate('Bonjour {{first_name}}, {{reference}} ({{ package }})', vars)).toBe(
      'Bonjour Grace, RDC-2026-0002 (Canada – Visa)',
    );
  });
  it('leaves unknown or missing placeholders visible', () => {
    expect(renderTemplate('{{nope}} {{payment_instructions}}', vars)).toBe('{{nope}} {{payment_instructions}}');
  });
});

describe('csv', () => {
  it('quotes cells with commas, quotes and newlines', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('line\nbreak')).toBe('"line\nbreak"');
    expect(csvCell(null)).toBe('');
    expect(csvCell(12)).toBe('12');
  });
  it('neutralises spreadsheet formulas', () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe(`"'=HYPERLINK(""http://x"")"`);
    expect(csvCell('+1234')).toBe("'+1234");
    expect(csvCell('-5')).toBe("'-5");
    expect(csvCell('@cmd')).toBe("'@cmd");
  });
  it('starts with a BOM and uses CRLF', () => {
    expect(toCsv(['a', 'b'], [[1, 2]])).toBe('﻿a,b\r\n1,2\r\n');
  });
});
