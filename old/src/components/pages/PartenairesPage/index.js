import {Link} from 'gatsby';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import GenericPage from '../GenericPage';

const page = {
  title: 'Nos Partenaires',
  path: '/nos-partenaires'
};

const PARTNER_LINK = [
  {
    labelKey: 'partner.chypre',
    to: '/articles/2022-07-27-optez-pour-luniversite-europeenne-de-lfeke-en-chypre-du-nord'
  },
  {
    labelKey: 'partner.turkish',
    to: '/articles/2022-06-23-choisissez-medipol-university-pour-une-education-de-qualite-en-turquie'
  },
  {
    labelKey: 'partner.france',
    to: '/articles/2022-06-07-faites-une-formation-professionnelle-de-qualite-chez-excelia'
  },
  {
    labelKey: 'partner.tunisia',
    to: '/articles/2022-05-30-faire-une-formation-professionnelle-institut-a-linstitut-africain-de-haute-formation'
  },
  {
    labelKey: 'partner.atua-junior',
    to: '/articles/2021-08-01-groupe-atua-junior'
  },

];

const PartenairesPage = () => {
  return (
    <GenericPage page={page}>
      <div>
        
        
        {PARTNER_LINK.map((item, index) => (
          
          <h2>
            <FormattedMessage id={item.labelKey}>{(text) => <Link to={item.to}>{text}</Link>}</FormattedMessage>
          </h2>
        ))}
      </div>
    </GenericPage>
  );
};

export default PartenairesPage;
