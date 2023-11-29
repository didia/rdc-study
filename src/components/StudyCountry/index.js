import React from "react";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";

const StudyCountry = () => {
  return (
    <>
      <section className="mb-2" id="studycountry">
        <div class="grid grid-cols-4 gap-2">
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <StaticImage
              height={60}
              alt="plane"
              src="../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div class="grid grid-cols-8">
          <div className="col-span-3">
            <StaticImage
              alt="travelers"
              src="../../images/4564198_2400445 1.png"
            />
          </div>

          <div className="col-span-5 px-1">
            <span className="text-sky-600 text-2xl font-black">
              Où souhaitez-vous étudier ?
            </span>{" "}
            <p>
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-4">
          <div className="">
            <StaticImage
              height={80}
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
          />
          <div className={styles.travel_countries_inner}>
            <StaticImage
              alt="Overlay"
              className={styles.travel_countries_inner__img}
              src="../../images/Rectangle5.png"
            />

            <div className={styles.travel_countries_content}>
              <div className="flex justify-center">
                <div class="grid grid-cols-12 gap-4">
                  <div>
                    <button
                      class="absolute left-4 z-[1] flex h-10 w-10 items-center justify-center text-center bg-white hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full top-16"
                      type="button"
                      data-te-target="#carouselExampleIndicators"
                      data-te-slide="prev"
                    >
                      <span class="inline-block h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="4.5"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>

                  <div className="col-span-5">
                    <div class="block max-w-[18rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                      <div class="relative overflow-hidden bg-cover bg-no-repeat">
                        <StaticImage
                          class="rounded-t-lg"
                          alt="tour"
                          src="../../images/tour_effeil.jpg"
                        />
                      </div>
                      <div class="p-6">
                        <p
                          class="text-base text-neutral-600"
                          style={{ color: "#0490DF", fontWeight: "800" }}
                        >
                          FRANCE
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5">
                    <div class="block max-w-[18rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                      <div class="relative overflow-hidden bg-cover bg-no-repeat">
                        <StaticImage
                          class="rounded-t-lg"
                          alt="tour"
                          src="../../images/flatten.jpg"
                        />
                      </div>
                      <div class="p-6">
                        <p
                          class="text-base text-neutral-600"
                          style={{ color: "#0490DF", fontWeight: "800" }}
                        >
                          CANADA
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      class="absolute right-4 z-[1] flex h-10 w-10 items-center justify-center text-center bg-white hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full top-16"
                      type="button"
                      data-te-target="#carouselExampleIndicators"
                      data-te-slide="prev"
                    >
                      <span class="inline-block h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="4.5"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyCountry;
