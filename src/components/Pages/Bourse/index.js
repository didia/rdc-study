import React from "react";
import Layout from "../../Layout";
import SecondaryBtn from "../../Button/Secondary"
import PrimaryBtn from "../../Button/Primary";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import ScholarShipCard from "../../Scholarship/ScholarShipCard";
import _ from "lodash";
import { AnimationOnScroll } from "react-animation-on-scroll";
import 'animate.css'

const Bourse = ({ scholarships }) => {
  const LEVEL_ORDERS = [
    "undergraduate",
    "graduate",
    "postgraduate",
    "research",
    "internship",
  ];
  const limitedScholarShips = _.filter(
    scholarships,
    (guideCountry, index) => index <= 3
  );

  return (
    <Layout pageTitle={"Bourse d'études"}>
      <section className="md:hidden">
        <div className="flex justify-start w-full z-5 absolute">
          <div className="text-start mx-10 z-10">
            <span className={styles.bourse__title}>Bourses d'études</span>{" "}
            <p>
              <span className="text-md">
                Voici les offres de bourses en cours trouvées pour vous avec ❤️
                par l'équipe RDC Etudes
              </span>
              <br />
              <br />

              <SecondaryBtn text={"Demander une assistance"} />
            </p>
          </div>
        </div>
        <div className="w-full h-full mt-10">
          <div style={{ marginTop: "20px" }}>
            <div className={styles.ellipse__first}>
              <StaticImage
                height={150}
                alt="Ellipse 7"
                src="../../../images/Ellipse7.png"
              />
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                alt="Ellipse 6"
                height={160}
                src="../../../images/Ellipse6.png"
              />
            </div>
          </div>

          <div>
            <StaticImage
              alt="plane"
              height={280}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
          </div>

          <div className={styles.ellipse__third}>
            <StaticImage
              alt="Ellipse blue 6"
              height={180}
              src="../../../images/Ellipse_blue6.png"
            />
          </div>
          <div className={styles.ellipse__fourth}>
            <StaticImage alt="Ellipse" src="../../../images/Ellipse8.png" />
          </div>

          <div className={styles.bourse__img_container}>
            <StaticImage
              alt="Ellipse"
              height={130}
              src="../../../images/Young-Girl-Student-HD.png"
            />
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="hidden md:flex">
          <div className="flex w-full h-full mt-10">
            <div className="-mt-28">
              <div className={styles.ellipse__second}>
                <StaticImage
                  alt="Ellipse 6"
                  height={350}
                  className="-z-40"
                  src="../../../images/Ellipse12.png"
                />
                <StaticImage
                  alt="plane"
                  className="-z-40 -ml-[28rem] absolute"
                  height={380}
                  src="../../../images/Ellipse10.png"
                />
                <StaticImage
                  alt="Ellipse 6"
                  height={600}
                  className="-z-50 -ml-[26rem] mt-4"
                  src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview4.png"
                />
              </div>
            </div>
          </div>

          <div className="flex -ml-[23rem] mt-[5rem]">
            <div>
              <p className="text-6xl font-black text-sky-600">
                Bourses d'études
              </p>
              <p className="py-4 text-lg mr-[35rem]">
                Voici les offres de bourses en cours trouvées pour vous avec ❤️
                par l'équipe RDC Etudes.
                <br />
                Lorem ipsum dolor sit amet consectetur. Adipiscing habitant
                consequat dolor dolor ornare eget. Non orci non urna scelerisque
                non. Ridiculus diam tristique cursus vel. Platea facilisis eu
                urna etiam. Nec mattis sed sed odio mattis. Sit vehicula
                molestie a fringilla. In vestibulum enim id turpis feugiat at.
                In faucibus duis odio aliquam. Orci condimentum venenatis cras
                vitae leo orci.
              </p>
              <PrimaryBtn
                text={"Demander une assistance"}
                fontSize={"text-2xl"}
              />
            </div>
          </div>

          <div className="mt-40 flex">
            <div className="flex">
              <StaticImage
                alt="plane"
                className="absolute right-0 top-0 -z-50"
                height={700}
                src="../../../images/Ellipse13.png"
              />
            </div>
            <div className="absolute right-10 -mt-24">
              <AnimationOnScroll animateIn="animate__bounceInRight">
                <StaticImage
                  alt="plane"
                  height={500}
                  src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
                />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <AnimationOnScroll animateIn="animate__bounceInLeft">
            <StaticImage
              alt="Ellipse 6"
              height={300}
              src="../../../images/Travel-Icon-Transparent-Background.png"
            />
          </AnimationOnScroll>
        </div>
      </section>

      <section className="px-4 mb-10 md:hidden">
        {scholarships.map((scholarship) => {
          return (
            <div className="py-3">
              {" "}
              <ScholarShipCard scholarship={scholarship} />
            </div>
          );
        })}
      </section>

      <section className="bg-gray-200 py-5 hidden md:block">
        <AnimationOnScroll animateIn="animate__fadeInUp">
          <div className="grid grid-cols-4 mx-8 py-10 gap-3">
            {limitedScholarShips.map((scholarship) => {
              return (
                <div className="">
                  {" "}
                  <ScholarShipCard scholarship={scholarship} />
                </div>
              );
            })}
          </div>
        </AnimationOnScroll>

        <a href="#" className="text-sky-600 text-2xl font-bold px-10">
          Voir plus
        </a>
      </section>
    </Layout>
  );
};

export default Bourse;
