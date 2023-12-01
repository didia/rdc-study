import React from "react";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import { Carousel } from "flowbite-react";

const StudyCountry = () => {
  return (
    <>
      <section className="mb-2" id="studycountry">
        <div className="grid grid-cols-4 gap-2">
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={60}
              alt="plane"
              placeholder="blurred"
              src="../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="grid grid-cols-8">
          <div className="col-span-3">
            <StaticImage
              alt="travelers"
              placeholder="blurred"
              src="../../images/4564198_2400445 1.png"
            />
          </div>

          <div className="col-span-5 px-1">
            <span className="text-sky-600 text-2xl font-black">
              Où souhaitez-vous étudier ?
            </span>{" "}
            <p>
              Choisissez le pays de votre destination pour votre projet de
              voyage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="">
            <StaticImage
              height={80}
              placeholder="blurred"
              alt="plane"
              src="../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
            />
          </div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={80}
              alt="tourist"
              placeholder="blurred"
              src="../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
            />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className={styles.travel_countries}>
          <StaticImage
            className={styles.travel_countries__img}
            alt="travel"
            src="../../images/World_Of_Empires.png"
            placeholder="blurred"
          />
          <div className={styles.travel_countries_inner}>
            <StaticImage
              alt="Overlay"
              className={styles.travel_countries_inner__img}
              src="../../images/Rectangle5.png"
              placeholder="blurred"
            />

            <div className={styles.travel_countries_content}>
              <Carousel slide={true} indicators={false}>
                <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                  <div className="relative overflow-hidden bg-cover bg-no-repeat">
                    <StaticImage
                      className="rounded-t-lg"
                      alt="tour"
                      placeholder="blurred"
                      src="../../images/flatten.jpg"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-base text-sky-600 font-extrabold">
                      CANADA
                    </p>
                  </div>
                </div>

                <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                  <div className="relative overflow-hidden bg-cover bg-no-repeat">
                    <StaticImage
                      className="rounded-t-lg"
                      alt="tour"
                      placeholder="blurred"
                      src="../../images/tour_effeil.jpg"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-base text-sky-600 font-extrabold">
                      FRANCE
                    </p>
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyCountry;
