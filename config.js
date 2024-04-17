export default {
    contact: {
      address: {
        country: 'R.D. Congo',
        locality: 'Kinshasa',
        name: 'Local 1M3, Nouvelles Galeries Présidentielles',
        streetAddress: 'Boulevard du 30 Juin'
      },
      email: {
        label: 'salut@rdcetudes.com',
        link: 'mailto:salut@rdcetudes.com'
      },
      facebook: {
        label: 'facebook.com/rdcetudes',
        link: 'https://facebook.com/rdcetudes'
      },
      phones: [
        {
          countryFlag: '🇨🇩',
          label: '+243 99 994 9712',
          link: 'tel:+243999949712'
        },
        {
          countryFlag: '🌏',
          label: '+1 (581) 318-0180 (WhatsApp)',
          link: 'tel:+1-581-318-0180'
        }
      ]
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
    siteDescription: "Nous accompagnons les étudiants d'Afrique francophone dans leurs projets d'études.",
    siteFBAppID: '192570431528735',
    siteKeywords:
      'etudier à l’étranger, étudier au Canada, étudier en France, étudier aux États—Unis, étudier en Belgique, bourses d‘études gratuites, projet d‘études, carrières',
    siteLogo: '/logo.png',
    siteImage: '/sharable-image.jpg',
    siteTitle: 'RDC Etudes - Votre source d’informations sur les études à l’étranger!',
    siteURL: process.env.GATSBY_SITE_URL || 'https://www.rdcetudes.com'
}