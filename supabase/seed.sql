-- Synthetic local-development data only (never applied to hosted projects). All people are fictional.
insert into public.clients (id, first_name, last_name, email, phone, phone_e164, origin_country) values
  ('c0000000-0000-0000-0000-000000000001', 'Amani',  'Mbuyi',    'amani.mbuyi@example.test',  '+243 81 000 0001', '+243810000001', 'République Démocratique du Congo'),
  ('c0000000-0000-0000-0000-000000000002', 'Grace',  'Kabila',   'grace.k@example.test',      '+243 82 000 0002', '+243820000002', 'République Démocratique du Congo'),
  ('c0000000-0000-0000-0000-000000000003', 'Moussa', 'Diallo',   'moussa.d@example.test',     '+224 62 000 0003', '+224620000003', 'Guinée'),
  ('c0000000-0000-0000-0000-000000000004', 'Awa',    'Traoré',   'awa.t@example.test',        '0700000004',      null,            'Côte d''Ivoire'),
  ('c0000000-0000-0000-0000-000000000005', 'Jean',   'Ilunga',   'jean.i@example.test',       '+243 99 000 0005', '+243990000005', 'République Démocratique du Congo'),
  ('c0000000-0000-0000-0000-000000000006', 'Fatou',  'Ndiaye',   'fatou.n@example.test',      '+221 77 000 0006', '+221770000006', 'Sénégal');

insert into public.service_requests
  (client_id, service_type, destination_country, package_slug, status, source, original_message, form_answers, quoted_price_cents, submitted_at)
values
  ('c0000000-0000-0000-0000-000000000001', 'assistance', 'Canada',   'canada/admission',     'new',              'website_form', 'Je suis Amani Mbuyi, originaire de la RDC. Je veux une assistance pour admission au Canada.', '{"hasAdmission": false, "isGoingToQuebec": true}', 40000, now() - interval '1 day'),
  ('c0000000-0000-0000-0000-000000000002', 'assistance', 'Canada',   'canada/visa',          'contacted',        'website_form', 'Je suis Grace Kabila. Je veux une assistance pour le permis d''études au Canada.',          '{"hasAdmission": true,  "hasCAQ": true}',        60000, now() - interval '3 days'),
  ('c0000000-0000-0000-0000-000000000003', 'assistance', 'Belgique', 'belgique/equivalence', 'in_discussion',    'website_form', 'Je suis Moussa Diallo. Je veux une équivalence de diplôme pour la Belgique.',               '{"hasHighSchoolDiplomaEquivalence": false}',     40000, now() - interval '10 days'),
  ('c0000000-0000-0000-0000-000000000004', 'consultation', null,     null,                   'awaiting_payment', 'whatsapp',     null,                                                                                         '{}',                                             3000,  now() - interval '12 days'),
  ('c0000000-0000-0000-0000-000000000005', 'assistance', 'France',   'france/admission',     'deposit_paid',     'website_form', 'Je suis Jean Ilunga. Je veux une assistance pour admission en France.',                     '{"hasAdmission": false}',                        40000, now() - interval '20 days'),
  ('c0000000-0000-0000-0000-000000000006', 'verification', 'Canada', null,                   'lost_no_response', 'referral',     null,                                                                                         '{}',                                             15000, now() - interval '30 days'),
  ('c0000000-0000-0000-0000-000000000001', 'information', null,      null,                   'new',              'website_form', 'Je veux accéder au guide gratuit.',                                                          '{}',                                             0,     now() - interval '2 hours');
