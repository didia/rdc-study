import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faLinkedin, faInstagram, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  return (
    <div>
      <footer className="bg-sky-600 text-center text-white lg:text-left">
        <div className="bg-white flex items-center justify-center border-t-2 border-sky-600 p-3 lg:justify-between">
          <div className="grid grid-cols-12">
            <div className="col-span-10">
              <span className="text-red-900 font-extrabold text-xl">
                Avez-vous des question ?
              </span>
            </div>
            <div className="col-span-2">
              <button className="bg-sky-600 text-sm rounded-lg px-2 py-2">
                Faq
              </button>
            </div>
          </div>
        </div>

        <div className="mx-6 py-10 text-center md:text-left">
          <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                <StaticImage alt="logo" src="../../images/Logo_white.png" />
              </div>
              <p className="mx-10">
                Réussir vous apporte toutes les nouveautés sur les bourses et
                l’éducation de qualité directement dans votre boîte email.
              </p>
            </div>
            <div>
              <h2
                style={{ fontSize: "25px" }}
                className="mb-4 flex justify-center font-bold uppercase md:justify-start"
              >
                CONTACTS
              </h2>
              <p className="mb-4 justify-center">
                <a href="#!" className="text-white text-xl">
                  <FontAwesomeIcon icon={faPhone} />
                  &nbsp;&nbsp; +243 99 994 9712
                </a>
              </p>
              <p className="mb-4 justify-center">
                <a href="#!" className="text-white text-xl">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                  &nbsp;&nbsp; +1 (581) 318-0180
                </a>
              </p>

              <p className="mb-4">
                <a href="#!" className="text-white text-xl">
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp;&nbsp; rdcetudes@gmail.com
                </a>
              </p>
              <p className="mb-4">
                <a href="#!" className="text-white text-xl">
                  <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                  &nbsp;&nbsp; N°283 Tabora Gombe
                </a>
              </p>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <FontAwesomeIcon
                    icon={faFacebook}
                    style={{ fontSize: "30px" }}
                  />
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    style={{ fontSize: "30px" }}
                  />
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    style={{ fontSize: "30px" }}
                  />
                </div>
                <div className="">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={{ fontSize: "30px" }}
                  />
                </div>
              </div>
            </div>
            <div>
              <a
                href="/"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Acceuil
              </a>

              <a
                href="/bourse"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Bourses
              </a>
              <a
                href="/aboutUs"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Qui sommes-nous ?
              </a>
              <a
                href="/faq"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Questions populaires
              </a>
              <a
                href="/healthcare"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Examens médicaux
              </a>
              <a
                href="/privacy"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Politiques de confidentialité
              </a>
              <a
                href="/help"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Besoin d'aide ?
              </a>
              <a
                href="/partenership"
                className="mb-4 flex justify-center uppercase md:justify-start"
              >
                Nos Partenaires
              </a>

              <div className="hero bg-gredient-dark h-400px flex flex-col px-2">
                <p
                  className="mb-5 mt-5"
                  style={{ fontSize: "20px" }}
                >
                  Abonnez-vous à notre newsLetter
                </p>
                <div className="search-box mx-auto my-auto w-full sm:w-full md:w-full lg:w-3/4 xl:w-3/4">
                  <form className="flex flex-row">
                    <input
                      className="h-16 text-grey-darker text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-gray-600"
                      type="text"
                      placeholder="Entrer votre email"
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "#D9D9D9",
                      }}
                    />
                    <span
                      style={{
                        borderRadius: "20px",
                        marginLeft: "-30px",
                        backgroundColor: "#D9D9D9",
                      }}
                      className="flex items-center bg-gray-100 rounded rounded-l-none border-0 px-1 font-bold text-grey-100"
                    >
                      <button
                        className="border-2 border-sky-600 hover:bg-gredient-light text-lg text-sky-600 font-bold py-3 px-6 rounded"
                        style={{
                          borderRadius: "10px",
                          backgroundColor: "#D9D9D9",
                        }}
                      >
                        Send
                      </button>
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-sky-600 p-6 text-center">
          <span className="text-xl">© 2023 RDC Etudes. Tous droits réservés</span>
        </div>
      </footer>
    </div>
  );
};
