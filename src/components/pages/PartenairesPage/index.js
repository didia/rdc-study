import { Link } from 'gatsby';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import GenericPage from '../GenericPage';
import chypre from '../../../../static/images/uploads/eul.jpg'
import turkish from '../../../../static/images/uploads/medipol.jpg'
import france from '../../../../static/images/uploads/excelia-1.jpg'
import tunisia from '../../../../static/images/uploads/iahf.png'
import atua_junior from '../../../../static/images/uploads/whatsapp-image-2021-06-27-at-15.07.10.jpeg'


// Styles
import styles from './styles.module.scss';


const page = {
  title: 'Nos Partenaires',
  path: '/nos-partenaires'
};

const PARTNER_LINK = [
  {
    labelKey: 'partner.chypre',
    to: '/articles/2022-07-27-optez-pour-luniversite-europeenne-de-lfeke-en-chypre-du-nord',
    img: chypre
  },
  {
    labelKey: 'partner.turkish',
    to: '/articles/2022-06-23-choisissez-medipol-university-pour-une-education-de-qualite-en-turquie',
    img: turkish
  },
  {
    labelKey: 'partner.france',
    to: '/articles/2022-06-07-faites-une-formation-professionnelle-de-qualite-chez-excelia',
    img: france
  },
  {
    labelKey: 'partner.tunisia',
    to: '/articles/2022-05-30-faire-une-formation-professionnelle-institut-a-linstitut-africain-de-haute-formation',
    img: tunisia
  },
  {
    labelKey: 'partner.atua-junior',
    to: '/articles/2021-08-01-groupe-atua-junior',
    img: atua_junior
  },

];

const PartenairesPage = () => {
  return (
    <GenericPage page={page}>
      <div>

        {PARTNER_LINK.map((item, index) => (

          <section>
            { }
            <FormattedMessage id={item.labelKey}>

              {(text) =>

                <Link to={item.to}>
                  <div className={styles.card_image}>
                    <img src={item.img} alt={item.labelKey} />
                  </div>
                  <div className={styles.card_title}>
                   {text}
                  </div>
                  
                </Link>}
            </FormattedMessage>

          </section>
        ))}
      </div>
    </GenericPage>
  );
};

export default PartenairesPage;
