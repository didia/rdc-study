export default {
  contact: {
    address: {
      country: 'Canada',
      locality: 'Québec, QC, G1X 1R4',
      name: 'RDC-Etudes',
      streetAddress: '3214, Chemin Sainte-Foy'
    },
    email: {
      label: 'salut@rdcetudes.com',
      link: 'mailto:salut@rdcetudes.com'
    },
    facebook: {
      label: 'facebook.com/rdcetudes',
      link: 'https://facebook.com/rdcetudes'
    },
    phone: {
      label: '+1 (581) 9318-0180',
      link: 'tel:+1-581-318-0180'
    }
  },
  contactFormEndpoint: `${process.env.GATSBY_API_ENDPOINT}/contact-form`,
  newsletterEndpoint: `${process.env.GATSBY_API_ENDPOINT}/newsletter`,
  shareThisProperty: '5d96bedd2303400012f930c1',
  siteCountries: [
    'Bénin',
    'Burkina Faso',
    'Burundi',
    'Cameroun',
    'Comores',
    "Côte d'Ivoire",
    'Djibouti',
    'Gabon',
    'Guinée',
    'Guinée équatoriale',
    'Madagascar',
    'Mali',
    'Niger',
    'République centrafricaine',
    'République démocratique du Congo',
    'République du Congo',
    'Rwanda',
    'Sénégal',
    'Seychelles',
    'Tchad',
    'Togo'
  ],
  siteDescription:
    'Accédez à nos guides gratuits sur la préparation d’un projet d’études à l’étranger pour étudiants congolais.',
  siteFBAppID: '192570431528735',
  siteKeywords:
    'etudier à l’étranger, étudier au Canada, étudier en France, étudier aux États—Unis, étudier en Belgique',
  siteLogo: '/logo.png',
  siteImage: '/sharable-image.jpg',
  siteTitle: 'RDC Etudes - Votre source d’informations sur les études à l’étranger!',
  siteURL: process.env.GATSBY_SITE_URL || 'https://www.rdcetudes.com'
};
