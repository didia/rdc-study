import DestinationCountries from '../../AssistanceForm/destination-countries';

export const options = {
  [DestinationCountries.BELGIUM.value]: [
    {
      labelKey: 'shared.options.equivalence',
      value: 'equiv-dipl'
    },
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    {
      labelKey: 'shared.options.motivation',
      value: 'mitv-letr'
    },
    {
      labelKey: 'shared.options.formfill',
      value: 'fill-form'
    },
    {
      labelKey: 'shared.options.visa',
      value: 'visa'
    },
    {
      labelKey: 'shared.options.consult',
      value: 'doc-constit'
    },
    {
      labelKey: 'shared.options.meet-embassy',
      value: 'rdv-embassy'
    },
    {
      labelKey: 'shared.options.interview',
      value: 'embassy-interview'
    },
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    }
  ],
  [DestinationCountries.CANADA.value]: [
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'Admission'
    },
    {
      labelKey: 'shared.options.caq',
      value: 'CAQ'
    },
    {
      labelKey: 'shared.options.study-permit',
      value: 'study-permit'
    },
    {
      labelKey: 'shared.options.formfill',
      value: 'fill-form'
    },
    {
      labelKey: 'shared.options.motivation',
      value: 'mitv-letr'
    },
    {
      labelKey: 'shared.options.expl-letr',
      value: 'expl-letr'
    },
    {
      labelKey: 'shared.options.engagement-letr',
      value: 'engagement-letr'
    },
    {
      labelKey: 'shared.options.admission-rejected',
      value: 'admission-rejected'
    },
    {
      labelKey: 'shared.options.visa-refused',
      value: 'visa-refused'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    },
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    }
  ],
  [DestinationCountries.NORTH_CYPRUS.value]: [
    {
      labelKey: 'shared.options.translate-doc',
      value: 'translate-doc'
    },
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    {
      labelKey: 'shared.options.first-payment',
      value: 'first-payment'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    },
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    }
  ],
  [DestinationCountries.FRANCE.value]: [
    {
      labelKey: 'shared.options.french-campus',
      value: 'french-campus'
    },
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    
    {
      labelKey: 'shared.options.study-project',
      value: 'study-project'
    },
    {
      labelKey: 'shared.options.cvec',
      value: 'cvec'
    },
    {
      labelKey: 'shared.options.visa',
      value: 'visa'
    },
    {
      labelKey: 'shared.options.interview',
      value: 'interview'
    },
    ,
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    }
  ],
  [DestinationCountries.INDIA.value]: [
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    {
      labelKey: 'shared.options.visa',
      value: 'visa'
    },
    ,
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    }
  ],
  [DestinationCountries.TUNISIE.value]: [
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    {
      labelKey: 'shared.options.visa',
      value: 'visa'
    },
    ,
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    }
  ],
  [DestinationCountries.TURQUIE.value]: [
    {
      labelKey: 'shared.options.translate-doc',
      value: 'translate-doc'
    },
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'admission'
    },
    {
      labelKey: 'shared.options.first-payment',
      value: 'first-payment'
    },
    {
      labelKey: 'shared.options.medical',
      value: 'medical'
    }
    ,
    {
      labelKey: 'shared.options.housing',
      value: 'housing'
    }
  ],
  [DestinationCountries.USA.value]: [
    {
      labelKey: 'shared.options.translate-doc',
      value: 'translate-doc'
    },
    {
      labelKey: 'shared.options.proposition',
      value: 'prop-univ'
    },
    {
      labelKey: 'shared.options.admission',
      value: 'Admission'
    },
    {
      labelKey: 'shared.options.formfill',
      value: 'fill-form'
    },
    {
      labelKey: 'shared.options.interview',
      value: 'interview'
    },
    {
      labelKey: 'shared.options.visa',
      value: 'visa'
    },
    {
      labelKey: 'shared.options.buyticket',
      value: 'buy-ticket'
    }
    ,
    {
      labelKey: 'shared.options.housing',
      value: 'Logement'
    }
  ],
}

export const getCountryOptions = (country) => {
  return options[country]
}