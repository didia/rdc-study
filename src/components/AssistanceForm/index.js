// Vendor
import React from 'react';

// Components
import AboutCandidateStep from './AboutCandidateStep';
import DestinationCountryStep from './DestinationCountryStep';

const MasterForm = () => {
  return (
    <div>
      <AboutCandidateStep />
      <DestinationCountryStep />
    </div>
  );
};

export default MasterForm;
