const DestinationCountries = {
  BELGIUM: {
    labelKey: 'shared.countries.be',
    value: 'belgique'
  },
  CANADA: {
    labelKey: 'shared.countries.ca',
    value: 'canada'
  },
  FRANCE: {
    labelKey: 'shared.countries.fr',
    value: 'france'
  },
  INDIA: {
    labelKey: 'shared.countries.in',
    value: 'inde'
  },
  NORTH_CYPRUS: {
    labelKey: 'shared.countries.cytr',
    value: 'chypre-du-nord'
  },
  USA: {
    labelKey: 'shared.countries.us',
    value: 'usa'
  }
};

export const destinationCountrySlugs = Object.keys(DestinationCountries).map(key => DestinationCountries[key].value)

export default DestinationCountries;
