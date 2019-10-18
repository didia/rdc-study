// Vendor
import React from 'react';
import T from 'prop-types';

import GenericPage from '../GenericPage';
import ScholarshipList from '../../../components/ScholarshipList';

const page = {
  description: "Découvrez les bourses d'études disponibles répertoriées pour vous.",
  title: "Bourses d'études en cours",
  path: '/bourses'
};

const ScholarshipPage = ({scholarships}) => {
  return (
    <GenericPage page={page}>
      <ScholarshipList scholarships={scholarships} />
    </GenericPage>
  );
};

ScholarshipPage.propTypes = {
  scholarships: T.arrayOf(T.object)
};

export default ScholarshipPage;
