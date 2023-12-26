import React, { useEffect, useRef, useState } from "react";
import * as styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faLinkedin,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import NavLink from "./Link";
import { StaticImage } from "gatsby-plugin-image";

const Header = () => {
  const humbugerRef = useRef();
  const navBarRef = useRef();
  const [toggleNav, setToggleNav] = useState(false);
  useEffect(() => {
    
    if(toggleNav) {
      navBarRef.current.classList.remove("hidden");
      navBarRef.current.classList.add("visible");
    }
    else{
      navBarRef.current.classList.remove("visible");
      navBarRef.current.classList.add("hidden");
    }
  }, [toggleNav]);

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="mx-auto px-4 md:px-28">
          <div className="flex justify-between">
            <div className="flex space-x-20">
              <div>
                <a href="/" className="flex items-center py-4 px-2">
                  <StaticImage
                    src="../../images/logo.png"
                    alt="Logo"
                    className="h-14 w-14 mr-2 md:h-20 md:w-20"
                  />
                </a>
              </div>

              <div className="hidden md:flex md:space-x-3 items-center uppercase">
                <NavLink title={"bourses d'études"} url={"/bourse"} />
                <NavLink title={"examens médicaux"} url={"/healthcare"} />
                <NavLink
                  title={"Politique de Confidentialité"}
                  url={"/privacy"}
                />
                <NavLink title={"à propos"} url={"/aboutUs"} />
                <NavLink title={"aide"} url={"/help"} />
                <NavLink title={"faq"} url={"/faq"} />
                <NavLink title={"nous contacter"} url={"/contactUs"} />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3 ">
              <a
                href="#"
                className="py-2 px-2 font-medium text-sky-600 rounded hover:bg-sky-600 hover:text-white transition duration-300"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  style={{ fontSize: "35px" }}
                />
              </a>

              <a
                href="#"
                className="py-2 px-2 font-medium text-sky-600 rounded hover:bg-sky-600 hover:text-white transition duration-300"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  style={{ fontSize: "35px" }}
                />
              </a>

              <a
                href="#"
                className="py-2 px-2 font-medium text-sky-600 rounded hover:bg-sky-600 hover:text-white transition duration-300"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  style={{ fontSize: "35px" }}
                />
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                className="outline-none flex"
                id="humburgerBtn"
                aria-label="humburgerBtn"
                ref={humbugerRef}
                onClick={(e) => setToggleNav(!toggleNav)}
              >
                {toggleNav ? (
                  <FontAwesomeIcon
                    className="text-4xl text-cyan-500"
                    icon={faXmark}
                  />
                ) : (
                  <svg
                    className="w-10 h-10 text-cyan-500"
                    x-show="!showMenu"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={
              "hidden z-30 absolute w-full left-0 text-center text-white uppercase text-xs " +
              styles.navbar__container
            }
            ref={navBarRef}
          >
            <ul className="w-full">
              <NavLink title={"accueil"} url={"/"} />
              <NavLink title={"bourses d'études"} url={"/bourse"} />
              <NavLink title={"examens médicaux"} url={"/healthcare"} />
              <NavLink
                title={"Politique de Confidentialité"}
                url={"/privacy"}
              />
              <NavLink title={"à propos"} url={"/aboutUs"} />
              <NavLink title={"aide"} url={"/help"} />
              <NavLink title={"faq"} url={"/faq"} />
              <NavLink title={"nous contacter"} url={"/contactUs"} />
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
