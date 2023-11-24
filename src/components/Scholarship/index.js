import React from 'react';
import * as style from "./styles.module.scss";

import img8 from "../../images/tour_effeil.png";
import img9 from "../../images/flatten.png";
import img10 from "../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png";
import overlay3 from "../../images/Rectangle10.png";
import img6 from "../../images/800x600_FE_WEB_equivalence 2.png";
import BourseCard from '../BourseCard';

const Scholarship = () => {
    return (
      <>
        <section className="mb-5">
          <div className="text-center mx-10 mb-3">
            <span className="text-sky-600 text-2xl font-black">
              Bourses d'études
            </span>{" "}
            <p>
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
          </div>

          <div className={style.scholarship} id="contact_section">
            <img src={img10} />
            <div className={style.scholarship_inner}>
              <img src={overlay3} />

              <div className={style.scholarship__content}>
                <div className="flex justify-center">
                  <div
                    class={
                      "grid grid-cols-16 gap-4 " +
                      style.scholarship__bourse_card
                    }
                  >
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

                    <div className="col-span-7">
                      <BourseCard
                        img={img6}
                        setDescription={false}
                        textSize={"sm"}
                      />
                    </div>
                    <div className="col-span-7">
                      <BourseCard
                        img={img6}
                        setDescription={false}
                        textSize={"sm"}
                      />
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
}
 
export default Scholarship;