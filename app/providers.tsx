'use client';

import {IntlProvider} from 'react-intl';
import messages from '../src/locales/fr.json';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider locale="fr" messages={messages}>
      {children}
    </IntlProvider>
  );
}
