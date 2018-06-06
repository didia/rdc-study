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
      label: '+1 (581) 998-8051',
      link: 'tel:+1-581-998-8051'
    }
  },
  contactFormEndpoint: process.env.GATSBY_CONTACT_FORM_ENDPOINT,
  siteDescription: 'Guide gratuit pour la préparation d’un projet d’études à l’étranger pour étudiants congolais.',
  siteFBAppID: '192570431528735',
  siteKeywords: 'etudier à l’étranger, étudier au Canada, étudier en France, étudier aux États—Unis',
  siteLogo: '/logo.png',
  siteImage: '/sharable-image.jpg',
  siteTitle: 'RDC Etudes - Votre guide gratuit sur les études à l’étranger!',
  siteURL: process.env.GATSBY_SITE_URL || 'https://www.rdcetudes.com'
};
