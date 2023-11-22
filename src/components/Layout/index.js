import * as React from "react";
import * as styles from "./styles.module.scss";
import Header from "../Header";
import Menu from "../Menu";
import { Footer } from "../Footer";

const Layout = ({ pageTitle, children }) => {
  return (
    <>
      <title>{pageTitle}</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="keywords" content="243 Technologies" />
      <meta name="description" content="" />
      <meta
        name="linkedIn:url"
        content="https://www.linkedin.com/company/243technologies/"
      />
      <meta
        name="facebook:url"
        content="https://web.facebook.com/profile.php?id=100083306892317"
      />
      <meta
        name="instagram:url"
        content="https://www.instagram.com/243_technologies/"
      />
        <Header />
        <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;