import React from "react";
import * as styles from "./styles.module.scss";

import overlay2 from "../../images/Rectangle5.png";
import img3 from "../../images/4564198_2400445 1.png";
import img4 from "../../images/earth-with-plane-drawing-png.png";
import img5 from "../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png";
import img6 from "../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png";
import img7 from "../../images/World_Of_Empires_Travel_Tourism_Landmark_PNG_-_Free_Download-removebg-preview 1.png";
import img8 from "../../images/tour_effeil.png";
import img9 from "../../images/flatten.png";

const StudyCountry = () => {
  return (
    <>
      <section className="mb-10" id="studycountry">
        <div class="grid grid-cols-4 gap-4">
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <img src={img4} style={{ height: "60px" }} />
          </div>
        </div>

        <div class="grid grid-cols-8">
          <div className="col-span-3">
            <img src={img3} style={{ height: "200px", width: "100%" }} />
          </div>

          <div className="col-span-5 px-3">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "25px",
                lineHeight: "27px",
              }}
            >
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
            <img src={img6} style={{ height: "80px" }} />
          </div>
          <div className="">&nbsp;</div>
          <div className="">&nbsp;</div>
          <div className="">
            <img src={img5} style={{ height: "2.5rem", marginTop: "-20px" }} />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className={styles.travel_countries} id="contact_section">
          <img src={img7} />
          <div className={styles.travel_countries_inner}>
            <img src={overlay2} />

            <div className={styles.travel_countries_content}>
              <div className="flex justify-center">
                <div class="grid grid-cols-12 gap-4">
                  <div>
                    <button
                      class="absolute left-4 z-[1] flex h-10 w-10 items-center justify-center text-center bg-white hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full"
                      type="button"
                      data-te-target="#carouselExampleIndicators"
                      data-te-slide="prev"
                      style={{ top: "90px" }}
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
                        <img
                          class="rounded-t-lg"
                          src={img8}
                          alt=""
                          style={{ height: "150px" }}
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
                        <img
                          class="rounded-t-lg"
                          src={img9}
                          alt=""
                          style={{ height: "150px" }}
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
                      class="absolute right-4 z-[1] flex h-10 w-10 items-center justify-center text-center bg-white hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded-full"
                      type="button"
                      data-te-target="#carouselExampleIndicators"
                      data-te-slide="prev"
                      style={{ top: "90px" }}
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
