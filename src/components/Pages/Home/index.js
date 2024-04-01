import * as React from "react";
import Layout from "../../../components/Layout";
import * as style from "./styles.module.scss";

import StudyCountry from "../../../components/StudyCountry";
import Scholarship from "../../../components/Scholarship";
import ContactForm from "../../../components/ContactForm";
import NewsCard from "../../NewsCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheckCircle, faClose, faQuestionCircle, faQuoteLeft, faGraduationCap, faFileEdit, faHandsHelping, faTicket, faHandshake, faQuestion, faLanguage, faTicketSimple, faPassport, faAssistiveListeningSystems } from "@fortawesome/free-solid-svg-icons";
import { StaticImage } from "gatsby-plugin-image";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";
import { AnimationOnScroll } from "react-animation-on-scroll";
import 'animate.css';
import { Dropdown, Banner } from "flowbite-react";
import { faHireAHelper } from "@fortawesome/free-brands-svg-icons";

const Home = ({ guideCountries, articles, scholarships }) => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <div className={"md:hidden " + style.firstSection}>
        <StaticImage
          className={style.firstSection__imgStudent}
          src="../../../images/young-students-studying.jpg"
          alt="Equipe etudes"
        />
        <div className={style.firstSection__inner}>
          <StaticImage
            className={style.firstSection__overlay}
            src="../../../images/Rectangle 47.png"
            alt="Overlay"
          />

          <div className={style.contact_content}>
            <div className="text-start">
              <div className="text-3xl text-white font-black uppercase mt-2 mb-4 font-['monserrat-bold']">
                Rdc etudes
              </div>
              <div className="text-base text-white mb-7 font-['roboto-bold']">
                RDC ETUDES est une entreprise axée sur l'éducation qui a pour
                mission de faciliter l'accès à une éducation de qualité pour les
                étudiants africains francophones, que ce soit sur le continent
                ou à l'étranger
              </div>
              <div>
                <Dropdown
                  class="md:hidden font-['monserrat-bold'] bg-sky-600 text-white text-base font-bold py-2 px-2 rounded-xl transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white"
                  label="Demander une assistance"
                  placement="bottom-start"
                >
                  <a href="/bourse">
                    <div className="hover:bg-gray-100 tex-base cursor-pointer hover:text-yellow-400 hover:text-lg">
                      {" "}
                      <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="mr-3 h-5"
                        />
                        Je veux une bourse
                      </Dropdown.Item>
                    </div>
                  </a>
                  <a href="/help">
                    <div className="hover:bg-gray-100 text-base cursor-pointer hover:text-yellow-400 hover:text-lg">
                      <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                        <FontAwesomeIcon
                          icon={faAssistiveListeningSystems}
                          className="mr-3 h-5"
                        />
                        Je veux une consultation
                      </Dropdown.Item>
                    </div>
                  </a>
                  <a href="/help">
                    <div className="hover:bg-gray-100 text-base cursor-pointer hover:text-yellow-400 hover:text-lg">
                      <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                        <FontAwesomeIcon
                          icon={faHandsHelping}
                          className="mr-3 h-5"
                        />
                        Je veux une assistance
                      </Dropdown.Item>
                    </div>
                  </a>
                  <a href="/document">
                    <div className="hover:bg-gray-100 text-sm cursor-pointer hover:text-yellow-400 hover:text-sm">
                      <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                        <FontAwesomeIcon
                          icon={faFileEdit}
                          className="mr-3 h-5"
                        />
                        Je veux une traduction des documents
                      </Dropdown.Item>
                    </div>
                  </a>
                  <a href="/billet">
                    <div className="hover:bg-gray-100 text-base cursor-pointer hover:text-yellow-400 hover:text-lg">
                      <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                        <FontAwesomeIcon
                          icon={faPassport}
                          className="mr-3 h-5"
                        />{" "}
                        Je veux acheter un billet
                      </Dropdown.Item>
                    </div>
                  </a>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-md:hidden flex">
        <div>
          <StaticImage
            alt="plane"
            height={300}
            src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview 2.png"
          />
        </div>

        <div className="mt-20">
          <StaticImage
            alt="plane"
            height={80}
            src="../../../images/kisspng-canada-international-student-travel-visa-f-visa-books-5aa189efac2496.png"
          />
        </div>
      </div>

      <div className="max-md:hidden flex -mt-32 mx-28">
        <div className="z-10">
          <div className="text-start">
            <p className="text-4xl text-sky-600 font-black font-['monserrat-bold']">
              Pourquoi RDC-Etudes ?
            </p>
            <p className="text-xl my-4 font-['roboto']">
              RDC ETUDES est une entreprise axée sur l'éducation qui a pour
              mission de faciliter l'accès à une éducation de qualité pour les
              étudiants africains francophones, que ce soit sur le continent ou
              à l'étranger
            </p>
            <Dropdown
              class="hidden md:flex font-['monserrat-bold'] bg-sky-600 text-white text-xl font-bold py-4 px-4 rounded-xl transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white"
              label="Demander une assistance"
              placement="bottom-start"
            >
              <a href="/bourse">
                <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-xl">
                  {" "}
                  <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="mr-3 h-5"
                    />
                    Je veux une bourse
                  </Dropdown.Item>
                </div>
              </a>
              <a href="/help">
                <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-xl">
                  <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                    <FontAwesomeIcon
                      icon={faAssistiveListeningSystems}
                      className="mr-3 h-5"
                    />
                    Je veux une consultation
                  </Dropdown.Item>
                </div>
              </a>
              <a href="/help">
                <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-xl">
                  <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                    <FontAwesomeIcon
                      icon={faHandsHelping}
                      className="mr-3 h-5"
                    />
                    Je veux une assistance
                  </Dropdown.Item>
                </div>
              </a>
              <a href="/document">
                <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-lg">
                  <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                    <FontAwesomeIcon icon={faFileEdit} className="mr-3 h-5" />
                    Je veux une traduction des documents
                  </Dropdown.Item>
                </div>
              </a>
              <a href="/billet">
                <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-xl">
                  <Dropdown.Item class="mx-4 py-2 text-md font-['monserrat']">
                    <FontAwesomeIcon icon={faPassport} className="mr-3 h-5" />{" "}
                    Je veux acheter un billet
                  </Dropdown.Item>
                </div>
              </a>
            </Dropdown>

            {/* <PrimaryBtn text={"Demander une assistance"} /> */}

            <StaticImage
              alt="plane"
              className="-ml-32 -mt-20 -z-30"
              height={400}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
            <StaticImage
              alt="plane"
              height={200}
              src="../../../images/Travel-PNG-File-Download-Free 1.png"
            />
          </div>
        </div>

        <div className="-mt-28">
          <StaticImage
            height={1600}
            width={1800}
            placeholder="blurred"
            alt="Agence"
            src="../../../images/Agence-M-Com-Marseille-AppartStudy-Marne-Montpellier-Residence.png"
          />
        </div>
      </div>

      <section className="md:hidden mb-2" id="mobileStudycountry">
        <div className="grid grid-cols-4 gap-2">
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={60}
              alt="plane"
              placeholder="blurred"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="grid grid-cols-8">
          <div className="col-span-3">
            <StaticImage
              alt="travelers"
              placeholder="blurred"
              src="../../../images/4564198_2400445 1.png"
            />
          </div>

          <div className="col-span-5">
            <span className="text-sky-600 text-2xl font-black font-['monserrat-bold']">
              Où souhaitez-vous étudier ?
            </span>{" "}
            <p className="font-['roboto'] mr-3 text-base">
              Nous vous accompagnons à réaliser votre projet d'études dans les
              meilleurs universités du monde. L'accompgnement RDC Etudes
              consiste à vous orienter dans votre projet d'études tout en les
              orientant sur le plan académique et professionel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="">
            <StaticImage
              height={80}
              placeholder="blurred"
              alt="plane"
              src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
            />
          </div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={60}
              alt="tourist"
              placeholder="blurred"
              src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
            />
          </div>
        </div>
      </section>

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="hidden md:block" id="studycountry">
          <div className="grid grid-cols-4 gap-2">
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">
              <StaticImage
                height={60}
                alt="plane"
                placeholder="blurred"
                src="../../../images/earth-with-plane-drawing-png.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              <StaticImage
                alt="travelers"
                placeholder="blurred"
                src="../../../images/student.png"
                className="h-[26rem] w-[26rem]"
              />
            </div>

            <div className="col-span-6 py-16 mr-10">
              <span className="text-sky-600 font-black text-4xl">
                Où souhaitez-vous étudier ?
              </span>{" "}
              <p className="text-xl py-6 font-['roboto']">
                Nous vous accompagnons à réaliser votre projet d'études dans les
                meilleurs universités du monde. L'accompgnement RDC Etudes
                consiste à vous orienter dans votre projet d'études tout en les
                orientant sur le plan académique et professionel.
              </p>
              <StaticImage
                className="h-32 w-32 float-right"
                alt="tourist"
                placeholder="blurred"
                src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <StaticImage
                height={80}
                className="h-32 w-32 z-20 -mt-48"
                placeholder="blurred"
                alt="plane"
                src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
              />
            </div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className=""></div>
          </div>
        </section>
      </AnimationOnScroll>
      <StudyCountry guideCountries={guideCountries} />

      <div className="hidden md:grid md:grid-cols-12 mb-20">
        <div className="col-span-5 flex w-full h-full mt-10">
          <div className="-mt-28">
            <div className={style.ellipse__second}>
              <StaticImage
                alt="Ellipse 6"
                height={400}
                src="../../../images/Ellipse2.png"
              />
            </div>
          </div>

          <div className="-ml-[17rem] -mt-10 z-30">
            <StaticImage
              alt="plane"
              height={380}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
          </div>

          <div className="-ml-28">
            <AnimationOnScroll animateIn="animate__bounceInLeft" animateOnce>
              <StaticImage
                alt="plane"
                height={400}
                src="../../../images/lady_with_suitcase.png"
              />
            </AnimationOnScroll>
          </div>
        </div>

        <div className="col-span-7 flex">
          <div>
            <p className=" max-[1456px]:text-4xl text-5xl font-black text-sky-600 font-['monserrat-bold']">
              Bourses d'études
            </p>
            <p className="py-4 max-[1456px]:text-xl text-2xl mr-[15rem] font-['roboto']">
              Chez RDC ÉTUDES nous n’offrons malheureusement pas des bourses
              nous pouvons cependant vous assister à postuler pour la bourse de
              votre choix sans pour autant garantir l’obtention de celle-ci.
              Vous trouverez toutes les offres des bourses dont nous avons
              connaissance dans la section Bourses d'études
            </p>

            <div className="">
              <Banner class="mb-5 w-[50rem] max-[1484px]:w-[35rem]">
                <div className="flex mt-10 justify-between border-b-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  <div className="mx-auto flex items-center">
                    <p className="flex items-center text-base font-['monserrat-bold'] font-normal text-red-700 dark:text-gray-400">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="mr-4 h-8 w-8"
                      />
                      <span className="[&_p]:inline">
                        J’ai compris, j’aimerais quand même être assisté(e) pour
                        la bourse
                      </span>
                    </p>
                  </div>
                </div>
              </Banner>
              <Banner class="w-[50rem] max-[1484px]:w-[35rem]">
                <div className="flex justify-between border-b-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  <div className="mx-auto flex items-center">
                    <p className="flex items-center text-base font-['monserrat-bold'] font-normal text-cyan-600 dark:text-gray-400">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="mr-4 h-8 w-8"
                      />
                      <span className="[&_p]:inline">
                        Pour quelle bourse souhaitez-vous être assisté(e) ?
                      </span>
                    </p>
                  </div>
                </div>
              </Banner>
            </div>

          </div>
          <div className=" mt-40">
            <StaticImage
              alt="plane"
              className="absolute right-0"
              height={300}
              src="../../../images/Ellipse1.png"
            />

            <div className="absolute right-10">
              <AnimationOnScroll animateIn="animate__bounceInRight" animateOnce>
                <StaticImage
                  alt="plane"
                  className=""
                  height={280}
                  src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
                />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
      </div>

      <Scholarship scholarships={scholarships} />

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="mb-5 mt-16 md:mt-20">
          <div className="text-left px-3 md:p-8 mb-5">
            <span className="text-sky-600 text-lg font-black uppercase md:text-2xl font-['monserrat-bold']">
              Les dernières nouvelles
            </span>{" "}
            <div className="h-4 w-full border-b-2 border-sky-600"></div>
          </div>

          {articles.map((article) => {
            return (
              <NewsCard
                key={article.frontmatter.title}
                ItemData={article.frontmatter}
              />
            );
          })}
        </section>
      </AnimationOnScroll>

      <section className="mb-5 mt-12 md:mt-16">
        <div className="text-center md:mb-10">
          <span className="text-sky-600 max-[1484px]:text-xl text-2xl font-black md:text-4xl font-['monserrat-bold']">
            Nos partenaires
          </span>{" "}
        </div>

        <AnimationOnScroll animateIn="animate__fadeInRight" animateOnce>
          <div className="container relative z-40 mx-auto ">
            <div className="grid grid-cols-3 md:grid-cols-4 py-6 text-center">
              <div>
                <a href="/article/faire-une-formation-professionnelle-institut-a-l-institut-africain-de-haute-formation">
                  <StaticImage
                    src="../../../images/iahf.png"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className=" text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    INSTITUT AFRICAIN DE HAUTE FORMATION (TUNISIE)
                  </p>
                </a>
              </div>

              <div className="mt-4">
                <a href="/article/faites-une-formation-professionnelle-de-qualite-chez-excelia">
                  <StaticImage
                    src="../../../images/excelia.png"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="Logo"
                    height={90}
                    objectFit="contain"
                  />
                  <p className="pt-10 text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    EXCELIA GROUP (FRANCE)
                  </p>
                </a>
              </div>

              <div>
                <a href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie">
                  <StaticImage
                    src="../../../images/medipol.jpg"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    UNIVERSITE MEDIPOL D'ISTANBUL (TURQUIE)
                  </p>
                </a>
              </div>

              <div className="hidden md:flex">
                <a href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie">
                  <StaticImage
                    src="../../../images/universite_de_lefke.webp"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                    UNIVERSITE EUROPEENNE DE LEFKE EN CHYPRE DU NORD
                  </p>
                </a>
              </div>
            </div>
          </div>
        </AnimationOnScroll>
      </section>

      <section className="mb-5 mt-12 md:mt-16">
        <div className="text-center md:py-10">
          <span className="text-sky-600 max-[1484px]:text-lg text-2xl font-black md:text-4xl font-['monserrat-bold']">
            Témoignages
          </span>{" "}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-8 mx-48">
          <div className="rounded-2xl h-[300px] px-2 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm md:text-xl text-white font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 max-[1384px]:mt-12 md:text-lg font-['roboto-bold']">
                Candidat X
              </p>
            </div>
          </div>

          <div className="rounded-2xl h-[300px] px-2 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm text-white md:text-xl font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 md:text-lg max-[1384px]:mt-12">
                Candidat X
              </p>
            </div>
          </div>
          <div className="rounded-2xl h-[300px] px-2 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm text-white md:text-xl font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 md:text-lg max-[1384px]:mt-12">
                Candidat X
              </p>
            </div>
          </div>
        </div>

        <div className="md:hidden mx-6 mt-5 rounded-2xl px-2 py-7 bg-sky-600">
          <div className="z-10">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              color="white"
              className="text-6xl opacity-25"
            />
          </div>
          <div className="z-20 -mt-7">
            <p className="text-center text-sm text-white font-['roboto-bold']">
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
            <p className="text-start text-white mt-4 font-['roboto-bold']">
              Candidat X
            </p>
          </div>
        </div>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

export default Home;
