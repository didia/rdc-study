import * as React from "react";
import Header from "../Header";
import { Footer } from "../Footer";
import SEO from "../Seo";
import { IntlProvider } from "react-intl";
import messages from '../../locales/fr.json'

const Layout = ({ pageTitle, children }) => {
  return (
      <IntlProvider locale="fr" messages={messages}>
        <SEO title={pageTitle} />
        <Header />
        <main>{children}</main>
        <Footer />
      </IntlProvider>
  );
};

export default Layout;