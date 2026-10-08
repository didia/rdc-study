import {PDFDocument, StandardFonts, rgb, type PDFFont} from 'pdf-lib';

import {formatCents} from './money';
import {fillTemplate} from './templates';

// Standard PDF fonts only cover WinAnsi: map the typographic characters French text uses, drop the rest.
export function sanitizeForPdf(text: string): string {
  return text
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[  ]/g, ' ')
    .replace(/[^\x09\x0a\x0d\x20-\x7e¡-ÿ€]/g, '');
}

export type ContractData = {
  clientName: string;
  clientAddress?: string | null;
  packageLabel: string;
  reference: string;
  priceCents: number;
  currency: string;
  depositShare: number;
  paymentInstructions: string;
  date: string;
};

export type ReceiptData = {
  clientName: string;
  packageLabel: string;
  reference: string;
  amountCents: number;
  currency: string;
  kindLabel: string;
  methodLabel: string;
  externalRef?: string | null;
  paidDate: string;
  date: string;
};

export function contractVariables(d: ContractData): Record<string, string> {
  const deposit = Math.round(d.priceCents * d.depositShare);
  return {
    client_name: d.clientName,
    client_address: d.clientAddress ? `, domicilié(e) à ${d.clientAddress}` : '',
    package: d.packageLabel,
    reference: d.reference,
    price: formatCents(d.priceCents, d.currency),
    deposit: formatCents(deposit, d.currency),
    balance: formatCents(d.priceCents - deposit, d.currency),
    payment_instructions: d.paymentInstructions,
    date: d.date,
  };
}

export function receiptVariables(d: ReceiptData): Record<string, string> {
  return {
    client_name: d.clientName,
    package: d.packageLabel,
    reference: d.reference,
    amount: formatCents(d.amountCents, d.currency),
    kind: d.kindLabel.toLowerCase(),
    method: d.methodLabel,
    external_ref: d.externalRef ? ` (réf. ${d.externalRef})` : '',
    paid_date: d.paidDate,
    date: d.date,
  };
}

/** Paragraphs of the final text (placeholders filled). Exposed so the content can be tested without parsing a PDF. */
export function documentParagraphs(body: string, vars: Record<string, string>): string[] {
  return fillTemplate(body, vars)
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of sanitizeForPdf(text).split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** A4 PDF: title, reference line, wrapped paragraphs (multi-page). */
export async function renderPdf(args: {title: string; subtitle: string; paragraphs: string[]; footer: string}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const [width, height] = [595.28, 841.89];
  const margin = 56;
  const textWidth = width - margin * 2;
  const size = 11;
  const lineHeight = 16;

  let page = pdf.addPage([width, height]);
  let y = height - margin;
  const ensureRoom = (needed: number) => {
    if (y - needed < margin + 24) {
      page = pdf.addPage([width, height]);
      y = height - margin;
    }
  };

  page.drawText('RDC ETUDES', {x: margin, y, size: 9, font: bold, color: rgb(0.18, 0.19, 0.25)});
  y -= 30;
  for (const line of wrap(args.title, bold, 18, textWidth)) {
    page.drawText(line, {x: margin, y, size: 18, font: bold, color: rgb(0.12, 0.14, 0.19)});
    y -= 24;
  }
  page.drawText(sanitizeForPdf(args.subtitle), {x: margin, y, size: 10, font, color: rgb(0.4, 0.44, 0.52)});
  y -= 30;

  for (const paragraph of args.paragraphs) {
    const lines = wrap(paragraph, font, size, textWidth);
    ensureRoom(lines.length * lineHeight);
    for (const line of lines) {
      page.drawText(line, {x: margin, y, size, font, color: rgb(0.12, 0.14, 0.19)});
      y -= lineHeight;
    }
    y -= 8;
  }

  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(sanitizeForPdf(`${args.footer} - page ${i + 1}/${pages.length}`), {x: margin, y: 28, size: 8, font, color: rgb(0.5, 0.53, 0.6)});
  });
  return pdf.save({useObjectStreams: false});
}
