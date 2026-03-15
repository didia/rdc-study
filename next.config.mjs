import {withSentryConfig} from '@sentry/nextjs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  sassOptions: {
    includePaths: [
      path.join(process.cwd(), 'src/assets/styles'),
      'node_modules',
    ],
    additionalData: '@import "shared.scss";',
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      {source: '/articles/2019-09-09-faites-gratuitement-votre-master-en-chine-grace-au-programme-des-bourses-schwarzman', destination: '/bourses/bourses-schwarzman-pour-poursuivre-un-master-en-chine', permanent: true},
      {source: '/articles/2019-10-02-bourses-de-master-de-l-universite-de-lausanne-en-suisse', destination: '/bourses/bourses-de-master-de-luniversite-de-lausanne-en-suisse', permanent: true},
      {source: '/articles/2019-08-29-faites-un-master-au-royaume-uni-grace-au-programme-des-bourses-d-etudes-gratuites-chevening', destination: '/bourses/bourses-chevening-pour-poursuivre-un-master-au-royaume-uni', permanent: true},
      {source: '/articles/2019-10-09-bourses-d-excellence-de-la-confederation-suisse-pour-chercheurs-et-artistes-etrangers-pour-l-annee-academique-2020-2021', destination: '/bourses/bourses-d-excellence-de-la-confederation-suisse-pour-chercheurs-et-artistes-etrangers-pour-lannee-academique-2020-2021', permanent: true},
      {source: '/articles/2019-09-23-programme-de-bourses-de-la-fondation-mastercard-a-l-universite-mcgill-au-canada', destination: '/bourses/bourses-de-la-fondation-mastercard-a-luniversite-mcgill-au-canada', permanent: true},
      {source: '/articles/2018-10-12-programme-ares-plusieurs-bourses-de-masters-et-stages-de-sp%C3%A9cialisation-en-belgique', destination: '/bourses/programme-ares-bourses-de-masters-et-stages-de-specialisation-en-belgique', permanent: true},
      {source: '/articles/2018-10-28-etudier-en-france-gr%C3%A2ce-au-programme-de-bourses-d-excellence-eiffel', destination: '/bourses/etudier-en-france-grace-au-programme-de-bourses-dexcellence-eiffel', permanent: true},
      {source: '/articles/2019-09-09-poursuivez-vos-etudes-superieures-gratuitement-aux-usa-grace-au-programme-fullbright', destination: '/bourses/programme-fulbright-bourses-detudes-superieures-aux-etats-unis', permanent: true},
      {source: '/articles/2019-08-18-bourse-d-etudes-du-president-de-l-universite-de-winnipeg-pour-etudiants-etrangers', destination: '/bourses/bourse-du-president-pour-etudiants-etrangers-de-luniversite-de-winnipeg-au-canada', permanent: true},
      {source: '/articles/2019-07-11-bourse-d-etudes-du-recteur-pour-etudiants-etrangers-a-l-universite-d-ottawa', destination: '/bourses/bourse-d-etudes-du-recteur-pour-etudiants-etrangers-a-l-universite-dottawa-au-canada', permanent: true},
      {source: '/articles/2019-06-07-bourses-postdoctorales-banting', destination: '/bourses/bourses-postdoctorales-banting-au-canada', permanent: true},
      {source: '/articles/2019-05-13-bourse-d-etude-au-japon', destination: '/bourses/programme-mext-bourse-detudes-du-gouvernement-du-japon', permanent: true},
      {source: '/articles/2018-08-01-etudier-gratuitement-au-br%C3%A9sil-c-est-possible', destination: '/bourses/bourses-detudes-pec-g-pour-etudier-gratuitement-au-bresil', permanent: true},
      {source: '/articles/2019-01-20-candidatures-ouvertes-pour-le-programme-de-bourses-d-etudes-2019-en-turquie', destination: '/bourses/candidatures-ouvertes-pour-le-programme-de-bourses-d-etudes-2019-en-turquie', permanent: true},
      {source: '/articles/2018-09-07-bourse-pour-%C3%A9tude-doctorale-au-canada', destination: '/bourses/bourses-dexoneration-des-frais-supplementaires-pour-etudes-doctorales-au-canada', permanent: true},
      {source: '/articles/2018-07-30-%C3%A9tudier-%C3%A0-co%C3%BBts-r%C3%A9duits-%C3%A0-l-universit%C3%A9-d-ottawa', destination: '/bourses/bourses-dexoneration-des-frais-de-scolarite-de-luniversite-dottawa-au-canada', permanent: true},
      {source: '/articles/2019-05-14-bourses-de-mobilite-formation-a-la-recherche-pour-jeunes-economistes-francophones-forje', destination: '/bourses/bourses-de-mobilite-formation-a-la-recherche-pour-jeunes-economistes-francophones-forje', permanent: true},
      {source: '/bourses/candidatures-ouvertes-pour-le-programme-de-bourses-d-etudes-2019-en-turquie', destination: '/bourses/candidatures-ouvertes-pour-le-programme-de-bourses-d-etudes-en-turquie', permanent: true},
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
