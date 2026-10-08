// CSV for Excel (UTF-8 BOM, ; is NOT used: comma + quotes per RFC 4180). Cells that a spreadsheet could read as a
// formula are neutralised (CSV injection): a leading = + - @ tab or CR gets a single quote.
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  return '﻿' + [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
