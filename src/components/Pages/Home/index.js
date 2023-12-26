import * as React from "react";
import Layout from "../../../components/Layout";
import * as style from "./styles.module.scss";

import StudyCountry from "../../../components/StudyCountry";
import Scholarship from "../../../components/Scholarship";
import ContactForm from "../../../components/ContactForm";
import NewsCard from "../../NewsCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { StaticImage } from "gatsby-plugin-image";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";

const Home = ({ guideCountries, articles, scholarships }) => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <div className={"md:hidden " + style.firstSection}>
        <StaticImage
          className={style.firstSection__imgStudent}
          src="../../../images/equipe-etudes.png"
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
              <div className="text-3xl text-white font-black uppercase mt-2 mb-4">
                Rdc études
              </div>
              <div className="text-lg text-white mb-4">
                Nous vous accompagnons dans la réussite de votre projet
                d’études, de l’admission à l’obtention de votre diplôme !
              </div>
              <div>
                <SecondaryBtn text={"Demander une assistance"} />
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
            <p className="text-5xl text-sky-600 font-black">
              Pourquoi RDC-Etudes ?
            </p>
            <p className="text-2xl my-4">
              Nous vous accompagnons dans la réussite de votre projet d’études,
              de l’admission à l’obtention de votre diplôme !
            </p>
            <PrimaryBtn text={"Demander une assistance"} />

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

      <section className="max-md:mb-2" id="studycountry">
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
              className="md:h-[26rem] md:w-[26rem]"
            />
          </div>

          <div className="col-span-6 py-16 mr-10">
            <span className="text-sky-600 text-2xl font-black md:text-5xl">
              Où souhaitez-vous étudier ?
            </span>{" "}
            <p className="md:text-2xl md:py-6">
              Choisissez le pays de votre destination pour votre projet de
              voyage.
              <p className="hidden md:flex text-2xl py-2">
                RDC Etudes vous oriente dans votre projet d'études du choix de
                l'université jusqu'à l'obtention de votre visa.
              </p>
            </p>
            <StaticImage
              className="hidden md:flex h-32 w-32 float-right"
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
              className="md:h-32 md:w-32 md:z-20 md:-mt-48"
              placeholder="blurred"
              alt="plane"
              src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
            />
          </div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={80}
              className="md:hidden"
              alt="tourist"
              placeholder="blurred"
              src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
            />
          </div>
        </div>
      </section>

      <StudyCountry guideCountries={guideCountries} />

      <div className="hidden md:grid md:grid-cols-12">
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
            <StaticImage
              alt="plane"
              height={400}
              src="../../../images/lady_with_suitcase.png"
            />
          </div>
        </div>

        <div className="col-span-7 flex">
          <div>
            <p className="text-6xl font-black text-sky-600">Bourses d'études</p>
            <p className="py-4 text-lg mr-[15rem]">
              Voici les offres de bourses en cours trouvées pour vous avec ❤️
              par l'équipe RDC Etudes.
              <br />
              Lorem ipsum dolor sit amet consectetur. Adipiscing habitant
              consequat dolor dolor ornare eget. Non orci non urna scelerisque
              non. Ridiculus diam tristique cursus vel. Platea facilisis eu urna
              etiam. Nec mattis sed sed odio mattis. Sit vehicula molestie a
              fringilla. In vestibulum enim id turpis feugiat at. In faucibus
              duis odio aliquam. Orci condimentum venenatis cras vitae leo orci.
              <br />
              <br />
              In vestibulum enim id turpis feugiat at. In faucibus duis odio
              aliquam. Orci condimentum venenatis cras vitae leo orci.
            </p>
          </div>
          <div className=" mt-40">
            <StaticImage
              alt="plane"
              className="absolute right-0"
              height={300}
              src="../../../images/Ellipse1.png"
            />

            <StaticImage
              alt="plane"
              className="absolute right-10"
              height={280}
              src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
            />
          </div>
        </div>
      </div>

      <Scholarship scholarships={scholarships} />

      <p className="text-center mb-10">
        <PrimaryBtn
          href={"/bourse"}
          fontSize={"text-sm"}
          text={"Voir plus de bourses"}
        >
          <i className="px-2">
            <FontAwesomeIcon icon={faArrowRight} />
          </i>
        </PrimaryBtn>
      </p>

      <section className="mb-5">
        <div className="text-left px-8 mb-5">
          <span className="text-sky-600 text-xl font-black uppercase">
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

      <section className="mb-5">
        <div className="text-center">
          <span className="text-sky-600 text-2xl font-black">
            Nos partenaires
          </span>{" "}
        </div>

        <div className="container relative z-40 mx-auto px-2 ">
          <div className="grid grid-cols-3 py-6 text-center">
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

                <p className=" text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
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
                <p className="pt-10 text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
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

                <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  UNIVERSITE MEDIPOL D'ISTANBUL (TURQUIE)
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="text-center">
          <span className="text-sky-600 text-2xl font-black">Témoignages</span>{" "}
        </div>

        <div className="mx-6 mt-5 rounded-2xl px-5 py-7 bg-sky-600">
          <div className="z-10">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              color="white"
              className="text-6xl opacity-25"
            />
          </div>
          <div className="z-20 -mt-7">
            <p className="text-center text-sm text-white">
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
            <p className="text-start text-white mt-4">Candidat X</p>
          </div>
        </div>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

export default Home;
