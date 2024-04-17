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
          <div className="flex justify-between md:w-full md:text-center md:ml-60">
            <div className="">
              <span className="text-red-900 text-lg md:text-3xl font-['roboto']">
                Avez-vous des questions ?
                <p className="hidden md:block text-base font-['roboto']">
                  Consulter notre foire aux questions
                </p>
              </span>
            </div>
            <div className="ml-5">
              <a
                href="/faq"
                className="bg-sky-600 text-sm md:text-xl md:px-8 md:py-2 rounded-lg px-2 py-2"
              >
                Faq
              </a>
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
              <p className="mx-10 font-['roboto']">
                RDC ETUDES vous apporte toutes les nouveautés sur les bourses et
                l’éducation de qualité directement dans votre boîte email.
              </p>
            </div>
            <div>
              <h2
                className="mb-4 flex text-xl justify-center font-bold uppercase md:justify-start font-['roboto-bold']"
              >
                CONTACTS
              </h2>
              <p className="mb-4 justify-center">
                <a href="#!" className="text-white text-base font-['roboto']">
                  <FontAwesomeIcon icon={faPhone} />
                  &nbsp;&nbsp; +243 99 994 9712
                </a>
              </p>
              <p className="mb-4 justify-center">
                <a href="#!" className="text-white text-base font-['roboto']">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                  &nbsp;&nbsp; +1 (581) 318-0180
                </a>
              </p>

              <p className="mb-4">
                <a href="#!" className="text-white text-base font-['roboto']">
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp;&nbsp; salut@rdcetudes.com
                </a>
              </p>
              <p className="mb-4">
                <a href="#!" className="text-white text-lg font-['roboto']">
                  <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                  &nbsp;&nbsp; Local 1m3 de la nouvelle galerie présidentielle,
                  Kinshasa, Gombe
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
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Acceuil
              </a>

              <a
                href="/bourse"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Bourses
              </a>
              <a
                href="/aboutUs"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Qui sommes-nous ?
              </a>
              <a
                href="/faq"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Questions populaires
              </a>
              <a
                href="/healthcare"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Examens médicaux
              </a>
              <a
                href="/privacy"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Politiques de confidentialité
              </a>
              <a
                href="/help"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Besoin d'aide ?
              </a>
              <a
                href="/partenership"
                className="mb-4 flex justify-center uppercase md:justify-start font-['roboto']"
              >
                Nos Partenaires
              </a>

              <div className="hero bg-gredient-dark h-400px flex flex-col px-2">
                <p
                  className="mb-5 mt-5 font-['roboto'] text-lg font-semibold"
                >
                  Abonnez-vous à notre newsLetter
                </p>
                <div className="search-box mx-auto my-auto w-full sm:w-full md:w-full lg:w-3/4 xl:w-3/4">
                  <form className="flex flex-row">
                    <input
                      className="h-16 text-grey-darker text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-base text-gray-600 font-['roboto']"
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
                        className="border-2 border-sky-600 hover:bg-gredient-light text-lg text-sky-600 font-bold py-3 px-6 rounded font-['roboto-bold']"
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
          <div className="grid gap-20 grid-cols-12">
            <div className="col-span-4">
              <div className="mb-4 flex items-center justify-center font-semibold uppercase">
                <StaticImage alt="logo" src="../../images/Logo_white.png" />
              </div>
              <p className="text-lg font-['roboto']">
                Réussir vous apporte toutes les nouveautés sur les bourses et
                l’éducation de qualité directement dans votre boîte email.
              </p>

              <div className="hero bg-gredient-dark h-400px flex flex-col px-2">
                <p className="mb-5 mt-5 text-xl font-['roboto-bold']">
                  Abonnez-vous à notre newsLetter
                </p>
                <div className="search-box mx-auto my-auto w-full">
                  <form className="flex flex-row">
                    <input
                      className="h-16 text-grey-darker text-grey-darkest border border-gray-100 font-bold w-full py-1 outline-none text-base text-gray-600"
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
            <div className=" col-span-8 grid grid-cols-3">
            <div className="py-8 font-['roboto']">
              <h2 className="mb-4 text-xl font-bold uppercase text-start font-['roboto-bold']">
                CONTACTS
              </h2>
              <p className="mb-6 text-start">
                <p className="text-white text-lg">
                  <FontAwesomeIcon icon={faPhone} />
                  &nbsp;&nbsp; +243 99 994 9712
                </p>
              </p>
              <p className="mb-6 text-start">
                <a href="https://api.whatsapp.com/send?phone=+1(581)318-0180&text=Laissez-nous%20un%20message" className="text-white text-lg">
                  <FontAwesomeIcon icon={faWhatsapp} />
                  &nbsp;&nbsp; +1 (581) 318-0180
                </a>
              </p>

              <p className="mb-6 text-start">
                <p className="text-white text-lg">
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp;&nbsp; salut@rdcetudes.com
                </p>
              </p>
              <p className="mb-6 text-start">
                <p  className="text-white text-lg">
                  <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                  &nbsp;&nbsp; Local 1m3 de la nouvelle galerie présidentielle,
                  Kinshasa, Gombe
                </p>
              </p>
            </div>

            <div className="py-8 font-['roboto']">
              <h2 className="mb-4 text-xl font-bold uppercase text-start font-['roboto-bold']">
                Pages
              </h2>

              <p className="mb-6 text-start">
                <a href="/" className="text-white text-lg">
                  Acceuil
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/bourse" className="text-white text-lg">
                  Bourses
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/article" className="text-white text-lg">
                  Articles
                </a>
              </p>
              
              <p className="mb-6 text-start">
                <a href="/aboutUs" className="text-white text-lg">
                  Qui sommes-nous ?
                </a>
              </p>
            </div>

            <div className="py-8 font-['roboto']">
              <h2 className="mb-4 text-xl font-bold uppercase text-start font-['roboto-bold']">
                Autres Pages
              </h2>

              <p className="mb-6 text-start">
                <a href="/healthcare" className="text-white text-lg">
                  Examens médicaux
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/privacy" className="text-white text-lg">
                  Politiques de confidentialité
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/help" className="text-white text-lg">
                  Besoin d'aide ?
                </a>
              </p>

              <p className="mb-6 text-start">
                <a href="/faq" className="text-white text-lg">
                  Questions populaires
                </a>
              </p>
            </div>
            </div>
          </div>
        </div>

        <div className="bg-sky-600 p-6 text-center">
          <span className="text-lg font-['roboto']">
            © 2023 RDC Etudes. Tous droits réservés
          </span>
        </div>
      </footer>
    </div>
  );
};
