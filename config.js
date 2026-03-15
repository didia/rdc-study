export default {
  /** When true, phone/WhatsApp is shown in footer, privacy policy, etc. When false, phone is only visible after form submission (accompagnement). Set NEXT_PUBLIC_SHOW_PHONE_ON_SITE=true to show everywhere. */
  showPhonePublicly: process.env.NEXT_PUBLIC_SHOW_PHONE_ON_SITE === 'true',
  contact: {
    address: {
      country: 'R.D. Congo',
      locality: 'Huilerie, Lingwala',
      name: 'RDC Etudes',
      streetAddress: 'av. Kitega n°147'
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
        countryFlag: '🌏',
        label: '+1 613 917-1416 (WhatsApp)',
        link: 'https://wa.me/16139171416'
      }
    ]
  },
  contactFormEndpoint: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/contact-form`,
  newsletterEndpoint: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/newsletter`,
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
    'etudier à l\'étranger, étudier au Canada, étudier en France, étudier aux États—Unis, étudier en Belgique, bourses d\'études gratuites, projet d\'études, carrières',
  siteLogo: '/logo.png',
  siteImage: '/sharable-image.jpg',
  siteTitle: 'RDC Etudes - Votre source d\'informations sur les études à l\'étranger!',
  siteURL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rdcetudes.com'
};
