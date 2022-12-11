import React from 'react';
import { graphql } from 'gatsby'
import T from 'prop-types';
import GenericPage from '../GenericPage';
import PartnerList from './PartnerList';

const page = {
  title: 'Nos Partenaires',
  path: '/nos-partenaires'
};


const PartenairesPage = ({partners}) => {
  
  return (
    <GenericPage page={page}> 
      <div>
        <section>
          <PartnerList id="partenaires" className={""} partners={partners} />
        </section>
        
      </div>
    </GenericPage>
  );
};

PartenairesPage.propTypes = {
  partners: T.array.isRequired
};

export default PartenairesPage;


