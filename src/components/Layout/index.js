import * as React from "react";
import Header from "../Header";
import { Footer } from "../Footer";
import SEO from "../Seo";

const Layout = ({ pageTitle, children }) => {
  return (
    <>
      <SEO title={pageTitle} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;