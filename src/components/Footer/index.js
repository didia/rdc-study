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
          <div className="grid grid-cols-12 md:w-full">
            <div className="hidden md:flex col-span-2"></div>

            <div className="col-span-10 md:col-span-6">
              <span className="text-red-900 font-extrabold text-xl md:text-3xl">
                Avez-vous des questions ?
                <p className="hidden md:block text-base">
                  Consulter notre foire aux questions
                </p>
              </span>
            </div>
            <div className="col-span-2 md:col-span-2">
              <button className="md:hidden bg-sky-600 text-sm rounded-lg px-2 py-2">
                Faq
              </button>

              <button className="hidden md:flex bg-sky-600 text-xl px-8 py-2">
                Faq
              </button>
            </div>

            <div className="hidden md:flex col-span-2"></div>
          </div>
        </div>

        <div className="md:hidden mx-6 py-10 text-center md:text-left">
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
                <p className="mb-5 mt-5" style={{ fontSize: "20px" }}>
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

        <div className="hidden md:block mx-10 py-10 text-center">
          <div className="grid gap-8 grid-cols-4">
            <div>
              <div className="mb-4 flex items-center justify-center font-semibold uppercase">
                <StaticImage alt="logo" src="../../images/Logo_white.png" />
              </div>
              <p className="text-lg">
                Réussir vous apporte toutes les nouveautés sur les bourses et
                l’éducation de qualité directement dans votre boîte email.
              </p>

              <div className="hero bg-gredient-dark h-400px flex flex-col px-2">
                <p className="mb-5 mt-5 text-xl font-bold">
                  Abonnez-vous à notre newsLetter
                </p>
                <div className="search-box mx-auto my-auto w-full">
                  <form className="flex flex-row">
                    <input
                      className="h-16 text-grey-darker text-grey-darkest border border-gray-100 font-bold w-full py-1 outline-none text-lg text-gray-600"
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
            <div className="py-8">
              <h2 className="mb-4 text-2xl font-bold uppercase text-start">
                CONTACTS
              </h2>
              <p className="mb-6 text-start">
                <a href="#!" className="text-white text-2xl">
                  <FontAwesomeIcon icon={faPhone} />
                  &nbsp;&nbsp; +243 99 994 9712
                </a>
              </p>
              <p className="mb-6 text-start">
                <a href="#!" className="text-white text-2xl">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                  &nbsp;&nbsp; +1 (581) 318-0180
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="#!" className="text-white text-2xl">
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp;&nbsp; rdcetudes@gmail.com
                </a>
              </p>
              <p className="mb-6 text-start">
                <a href="#!" className="text-white text-2xl">
                  <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                  &nbsp;&nbsp; N°283 Tabora Gombe
                </a>
              </p>
            </div>

            <div className="py-8">
              <h2 className="mb-4 text-2xl font-bold uppercase text-start">
                Pages
              </h2>

              <p className="mb-6 text-start">
                <a href="/" className="text-white text-2xl">
                  Acceuil
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/bourse" className="text-white text-2xl">
                  Bourses
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/aboutUs" className="text-white text-2xl">
                  Qui sommes-nous ?
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/faq" className="text-white text-2xl">
                  Questions populaires
                </a>
              </p>
            </div>

            <div className="py-8">
              <h2 className="mb-4 text-2xl font-bold uppercase text-start">
                Pages
              </h2>

              <p className="mb-6 text-start">
                <a href="/healthcare" className="text-white text-2xl">
                  Examens médicaux
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/privacy" className="text-white text-2xl">
                  Politiques de confidentialité
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/help" className="text-white text-2xl">
                  Besoin d'aide ?
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/partenership" className="text-white text-2xl">
                  Nos Partenaires
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-sky-600 p-6 text-center">
          <span className="text-xl">
            © 2023 RDC Etudes. Tous droits réservés
          </span>
        </div>
      </footer>
    </div>
  );
};
