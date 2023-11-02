import React from "react";
import logo from "../../images/Logo_white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faLinkedin, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  return (
    <div>
      <footer class="bg-sky-600 text-center text-white lg:text-left">
        <div class="bg-white flex items-center justify-center border-t-2 border-sky-600 p-6 lg:justify-between">
          <div class="flex justify-start">
            <span
              style={{ color: "#862304", fontWeight: "700", fontSize: "20px" }}
            >
              Avez-vous des question ?
            </span>
          </div>
        </div>

        <div class="mx-6 py-10 text-center md:text-left">
          <div class="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div class="">
              <h6 class="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                <img src={logo} />
              </h6>
              <p className="mx-10">
                Here you can use rows and columns to organize your footer
                content. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit.
              </p>
            </div>
            <div class="">
              <h2
                style={{ fontSize: "25px" }}
                class="mb-4 flex justify-center font-bold uppercase md:justify-start"
              >
                CONTACTS
              </h2>
              <p class="mb-4 justify-center">
                <a href="#!" class="text-white text-xl">
                  <FontAwesomeIcon icon={faPhone} />
                  &nbsp;&nbsp; +243 800 000 00
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-white text-xl">
                  <FontAwesomeIcon icon={faEnvelope} />
                  &nbsp;&nbsp; rdcetudes@gmail.com
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-white text-xl">
                  <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                  &nbsp;&nbsp; N°283 Tabora Gombe
                </a>
              </p>
            </div>

            <div class="mb-4 flex justify-center ml-16">
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
                <div className="">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={{ fontSize: "30px" }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Acceuil
              </h6>

              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Bourses
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Qui sommes-nous ?
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Questions populaires
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Limitations légales
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Politiques de confidentialité
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Besoin d'aide ?
              </h6>
              <h6 class="mb-4 flex justify-center uppercase md:justify-start">
                Nos Partenaires
              </h6>

              <div class="hero bg-gredient-dark h-400px flex flex-col px-2">
                <p className="mb-5 mt-5 font-semibold" style={{ fontSize: "20px" }}>
                  Abonnez-vous à notre newsLetter
                </p>
                <div class="search-box mx-auto my-auto w-full sm:w-full md:w-full lg:w-3/4 xl:w-3/4">
                  <form class="flex flex-row">
                    <input
                      class="h-16 text-grey-darker py-2 font-normal text-grey-darkest border border-gray-100 font-bold w-full py-1 px-2 outline-none text-lg text-gray-600"
                      type="text"
                      placeholder="Entrer votre adresse E-mail"
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
                      class="flex items-center bg-gray-100 rounded rounded-l-none border-0 px-1 font-bold text-grey-100"
                    >
                      <button
                        class="border-2 border-sky-600 hover:bg-gredient-light text-lg text-sky-600 font-bold py-3 px-6 rounded"
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

        <div class="bg-sky-600 p-6 text-center">
          <span className="text-xl">© 2023 All rigth reserved RDC Etudes</span>
          
        </div>
      </footer>
    </div>
  );
};
