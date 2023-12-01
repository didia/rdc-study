import React from 'react';
import * as style from "./styles.module.scss";
import { Carousel } from 'flowbite-react';
import img6 from "../../images/800x600_FE_WEB_equivalence 2.jpg";
import BourseCard from '../BourseCard';
import { StaticImage } from 'gatsby-plugin-image';

const Scholarship = () => {
    return (
      <>
        <section className="mb-5">
          <div className="text-center mx-10 mb-3">
            <span className="text-sky-600 text-2xl font-black">
              Bourses d'études
            </span>{" "}
            <p>
              Découvrez nos meilleurs programmes de bourse qui vous assure un
              voyage réussi
            </p>
          </div>

          <div className={style.scholarship}>
            <StaticImage
              className={style.scholarship__overlay}
              alt="plane"
              src="../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png"
            />
            <div className={style.scholarship_inner}>
              <StaticImage
                className={style.scholarship_inner__overlay}
                alt="overlay"
                src="../../images/Rectangle10.png"
              />
              <div className={style.scholarship__content}>

                <Carousel slide={true} indicators={false}>
                  <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="relative overflow-hidden bg-cover bg-no-repeat">
                      <StaticImage
                        className="rounded-t-lg"
                        alt="tour"
                        placeholder="blurred"
                        src="../../images/800x600_FE_WEB_equivalence 2.jpg"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-base text-sky-600 font-extrabold capitalize">
                        Bourse d'études
                      </p>
                    </div>
                  </div>

                  <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="relative overflow-hidden bg-cover bg-no-repeat">
                      <StaticImage
                        className="rounded-t-lg"
                        alt="tour"
                        placeholder="blurred"
                        src="../../images/800x600_FE_WEB_equivalence 2.jpg"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-base text-sky-600 font-extrabold capitalize">
                        Bourse d'études
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
}
 
export default Scholarship;