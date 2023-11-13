import React from 'react';
import * as style from "./styles.module.scss";

import img8 from "../../images/tour_effeil.png";
import img9 from "../../images/flatten.png";
import img10 from "../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png";
import overlay3 from "../../images/Rectangle10.png";

const Scholarship = () => {
    return (
      <>
        <section className="mb-10">
          <div className="text-center mx-10 mb-3">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "28px",
                lineHeight: "27px",
              }}
            >
              Bourse d'études
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

              <div className={style.scholarship_content}>
                <div className="flex justify-center">
                  <div class="grid grid-cols-16 gap-4">
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
                      <div class="block max-w-[18rem] rounded-lg bg-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                        <div class="relative overflow-hidden bg-cover bg-no-repeat">
                          <img
                            class="rounded-t-lg"
                            src={img8}
                            alt=""
                            style={{ height: "120px" }}
                          />
                        </div>
                        <div class="p-2">
                          <p
                            class="text-base text-neutral-600"
                            style={{ color: "#0490DF", fontWeight: "800" }}
                          >
                            BOURSE D'&Eacute;TUDE
                          </p>
                          <p style={{ fontSize: "14px" }}>
                            Lorem ispum dolor fortuna simpre cresis, out
                            decresis
                          </p>
                        </div>

                        <div className="text-left px-4">
                          <a
                            href="#"
                            style={{ color: "#0490DF", fontWeight: "800" }}
                          >
                            Détails
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-7">
                      <div class="block max-w-[18rem] rounded-lg bg-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                        <div class="relative overflow-hidden bg-cover bg-no-repeat">
                          <img
                            class="rounded-t-lg"
                            src={img9}
                            alt=""
                            style={{ height: "120px" }}
                          />
                        </div>
                        <div class="p-2">
                          <p
                            class="text-base text-neutral-600"
                            style={{ color: "#0490DF", fontWeight: "800" }}
                          >
                            BOURSE D'&Eacute;TUDE
                          </p>
                          <p style={{ fontSize: "14px" }}>
                            Lorem ispum dolor fortuna simpre cresis, out
                            decresis
                          </p>
                        </div>

                        <div className="text-left px-4">
                          <a
                            href="#"
                            style={{ color: "#0490DF", fontWeight: "800" }}
                          >
                            Détails
                          </a>
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
}
 
export default Scholarship;