import {describe, expect, it} from 'vitest';

import {contractVariables, documentParagraphs, receiptVariables, renderPdf, sanitizeForPdf} from '../pdf';

const body =
  'Entre RDC Études et {{client_name}}{{client_address}}.\n\nDossier : {{package}} ({{reference}}). Prix : {{price}}, acompte {{deposit}}, solde {{balance}}.';

describe('contract content', () => {
  const data = {
    clientName: 'Amani Mbuyi',
    clientAddress: 'Kinshasa, Gombe',
    packageLabel: 'Canada – Visa / permis d’études',
    reference: 'RDC-2026-0002',
    priceCents: 60000,
    currency: 'USD',
    depositShare: 0.5,
    paymentInstructions: 'au bureau.',
    date: '8 octobre 2026',
  };

  it('contains the client, package, reference and the tranche schedule', () => {
    const text = documentParagraphs(body, contractVariables(data)).join('\n').replace(/[\u00a0\u202f]/g, ' ');
    expect(text).toContain('Amani Mbuyi, domicilié(e) à Kinshasa, Gombe');
    expect(text).toContain('Canada – Visa / permis d’études (RDC-2026-0002)');
    expect(text).toMatch(/Prix : 600,00 \$ US, acompte 300,00 \$ US, solde 300,00 \$ US/);
  });

  it('leaves no placeholder behind when all variables are known, and keeps unknown ones visible', () => {
    expect(documentParagraphs(body, contractVariables(data)).join(' ')).not.toContain('{{');
    expect(documentParagraphs('Bonjour {{inconnu}}', {})[0]).toBe('Bonjour {{inconnu}}');
  });

  it('omits the address cleanly when there is none', () => {
    const text = documentParagraphs(body, contractVariables({...data, clientAddress: null}))[0];
    expect(text).toBe('Entre RDC Études et Amani Mbuyi.');
  });
});

describe('receipt content', () => {
  it('states amount, kind, method and reference', () => {
    const vars = receiptVariables({
      clientName: 'Grace K',
      packageLabel: 'Belgique – Admission',
      reference: 'RDC-2026-0003',
      amountCents: 20000,
      currency: 'USD',
      kindLabel: 'Acompte',
      methodLabel: 'Mobile Money',
      externalRef: 'MM123',
      paidDate: '5 mars 2026',
      date: '8 octobre 2026',
    });
    const [raw] = documentParagraphs('{{client_name}} : {{amount}} ({{kind}}) par {{method}}{{external_ref}} le {{paid_date}}', vars);
    const text = raw.replace(/[\u00a0\u202f]/g, ' ');
    expect(text).toMatch(/Grace K : 200,00 \$ US \(acompte\) par Mobile Money \(réf\. MM123\) le 5 mars 2026/);
  });
});

describe('renderPdf', () => {
  it('produces a valid multi-page PDF', async () => {
    const long = Array.from({length: 60}, (_, i) => `Paragraphe ${i} ` + 'texte '.repeat(40));
    const bytes = await renderPdf({title: 'Contrat de service', subtitle: 'RDC-2026-0002', paragraphs: long, footer: 'RDC Études'});
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe('%PDF-');
    expect(Buffer.from(bytes).toString('latin1')).toMatch(/\/Count [2-9]/);
  });

  it('survives characters the standard fonts cannot draw', () => {
    expect(sanitizeForPdf('« Été » – 😀 ’ …')).toBe("« Été » -  ' ...");
  });
});
