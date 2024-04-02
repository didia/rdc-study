import React from "react";
import Layout from "../../Layout";
import ValueCard from "../../ValueCard";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "./styles.module.scss";
import TeamCard from "../../TeamCard";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";
import { Dropdown } from "flowbite-react";
import { FontAwesomeIcon, faGraduationCap, faAssistiveListeningSystems, faHandsHelping, faFileEdit, faPassport } from "@fortawesome/react-fontawesome";
const AboutUs = ({ teammMembers }) => {

  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section className="md:hidden">
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <StaticImage
              alt="plans"
              src="../../../images/World_Of_Empires.png"
              height={100}
            />
          </div>

          <div className="col-span-8 z-10">
            <div className="text-start ml-4">
              <span className="text-xl font-['roboto] font-bold text-sky-600">
                Pourquoi choisir RDC ÉTUDES pour votre projet d'études?
              </span>{" "}
              <p className="mt-3">
                <span className="text-base font-['roboto']">
                  Nous réalisons cette mission chaque jour en guidant et
                  soutenant les étudiants dans la réalisation de leurs projets
                  d'études tout en les orientant sur le plan académique et
                  professionnel
                </span>
              </p>
            </div>
          </div>

          <div>
            <StaticImage
              alt="plan on earth"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <AnimationOnScroll animateIn="animate__bounceIn" animateOnce>
              <StaticImage
                alt="plans"
                src="../../../images/World_Of_Empires.png"
              />
            </AnimationOnScroll>
          </div>
          <div className="col-span-7 z-10 mt-20">
            <div className="text-start ml-20 pr-60">
              <span className="text-3xl text-sky-600 font-['roboto-bold']">
                Pourquoi choisir RDC ÉTUDES pour votre projet d'études?
              </span>{" "}
              <p className="py-5">
                <span className="text-xl font-['roboto']">
                  Nous réalisons cette mission chaque jour en guidant et
                  soutenant les étudiants dans la réalisation de leurs projets
                  d'études tout en les orientant sur le plan académique et
                  professionnel
                </span>
                <br />
                <br />
                <Dropdown
                  class="font-['roboto'] bg-sky-600 text-white text-base font-bold py-2 px-2 rounded-xl transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white"
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

                {/* <PrimaryBtn
                  text={"Demander une assistance"}
                  fontSize={"text-lg"}
                /> */}
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className={styles.ellipse3}>
              <StaticImage
                className=""
                src="../../../images/Ellipse15.png"
                alt="Ellipse"
              />
            </div>
            <div className={styles.ellipse4}>
              <StaticImage alt="plane" src="../../../images/Ellipse16.png" />
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden">
        <div className="flex items-center justify-center mx-8 font-['roboto-bold'] py-3">
          <span
            className={
              "text-center font-extrabold text-lg font-['roboto-bold'] " +
              styles.about__values_title
            }
          >
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </span>
        </div>

        <ValueCard
          title={"honnêteté"}
          section1={
            "Nous vous dirons toujours la vérité par rapport à vos démarches. L’important pour nous c’est que vous ayez la vraie information. La réussite de vos démarches est et restera toujours notre première priorité."
          }
        />
        <ValueCard
          title={"serviabilité"}
          section1={
            "Le plus important pour nous c’est vous rendre service. Voilà pourquoi nous offrons des guides gratuits. Nous savons que c’est en vous rendant le meilleur service possible, que vous parlerez de nous aux autres personnes et que nous aurons plus de clients."
          }
        />
        <ValueCard
          title={"transparence"}
          section1={
            "Nous serons toujours transparents avec vous. À la différence des autres, chez nous vous savez exactement à quoi sert votre argent. Vous avez le choix de faire le paiement vous-même. Si nous payons pour vous, nous vous donnerons toujours les preuves de paiement."
          }
        />
      </section>

      <section className="hidden md:block mt-24">
        <div className="items-center justify-center">
          <div className="text-center font-extrabold text-2xl font-['roboto-bold'] text-sky-600">
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </div>

          <p className="text-xl py-5 mx-[15rem] font-['roboto']">
            RDC ÉTUDES est composée des anciens étudiants qui ont fréquenté
            différents pays tels que l’Allemagne,la Belgique, le Brésil, le
            Canada, Chypre du Nord, la France, les USA et la Roumanie.
            L’entreprise est donc née de leurs expériences, réussites, échecs et
            erreurs lors de la construction de leurs projets d'études. Ce sont
            ces différentes expériences que nous vous offrons en espérant vous
            aider à réussir votre projet d'études
          </p>
        </div>

        <div className="grid grid-cols-3 mt-20">
          <ValueCard
            title={"honnêteté"}
            section1={
              "Nous vous dirons toujours la vérité par rapport à vos démarches. L’important pour nous c’est que vous ayez la vraie information. La réussite de vos démarches est et restera toujours notre première priorité."
            }
          />
          <ValueCard
            title={"serviabilité"}
            section1={
              "Le plus important pour nous c’est vous rendre service. Voilà pourquoi nous offrons des guides gratuits. Nous savons que c’est en vous rendant le meilleur service possible, que vous parlerez de nous aux autres personnes et que nous aurons plus de clients."
            }
          />
          <ValueCard
            title={"transparence"}
            section1={
              "Nous serons toujours transparents avec vous. À la différence des autres, chez nous vous savez exactement à quoi sert votre argent. Vous avez le choix de faire le paiement vous-même. Si nous payons pour vous, nous vous donnerons toujours les preuves de paiement."
            }
          />
        </div>
      </section>

      <section className="mb-10 md:mb-20">
        <div className="flex items-center justify-center mx-3">
          <span
            className={
              "text-center text-lg font-['roboto-bold'] uppercase mb-6 mt-6 md:text-2xl " +
              styles.about__values_title
            }
          >
            Une équipe sérieuse et passionée à votre service
          </span>
        </div>
      </section>

      <div className="md:hidden">
        {teammMembers.map((member) => {
          return <TeamCard member={member.frontmatter} />;
        })}
      </div>

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <div className="hidden md:grid grid-cols-3 mx-10">
          {teammMembers.map((member) => {
            return <TeamCard member={member.frontmatter} />;
          })}
        </div>
      </AnimationOnScroll>
    </Layout>
  );
};

export default AboutUs;
