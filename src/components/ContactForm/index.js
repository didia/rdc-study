import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from "./styles.module.scss";
import PrimaryBtn from '../Button/Primary';

const ContactForm = ({ title, bgImg, marginBottom }) => {
    return (
      <>
        <section className={marginBottom + " md:hidden"}>
          <div className="text-center mx-10 z-10">
            <span className="text-sky-600 text-2xl font-black">
              Besoin d'un service ?
            </span>{" "}
            <p className="py-4">
              Avez-vous des questions ou besoin d’informations supplémentaires?
              N’hésitez donc pas de nous contacter, de préférence à travers nos
              médias sociaux.
            </p>
          </div>

          <div>
            <div className="flex justify-center w-full z-10 absolute">
              <div className="">
                <div>
                  <input
                    type="text"
                    className={styles.form__input}
                    placeholder="Nom"
                  />
                </div>

                <div className="py-4">
                  <input
                    type="text"
                    className={styles.form__input}
                    placeholder="Adresse E-mail"
                  />
                </div>

                <div>
                  <textarea
                    className={styles.form__textarea}
                    aria-label="Message"
                    defaultValue={"Message"}
                  />
                </div>

                <div className="py-4">
                  <button className="bg-sky-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.form__overlayImg}>
              <StaticImage
                alt="airway"
                src="../../images/png-clipart-black-airway.png"
              />
            </div>
          </div>
        </section>

        <section className="hidden md:flex">
          <div className="grid grid-cols-2 my-16">
            <div>
              <div className="text-center z-10 ml-40">
                <span className="text-sky-600 text-5xl font-black">
                  Besoin d'un service ?
                </span>{" "}
                <p className="py-4 text-xl">
                  Avez-vous des questions ou besoin d’informations
                  supplémentaires? N’hésitez donc pas de nous contacter, de
                  préférence à travers nos médias sociaux.
                </p>
              </div>

              <div className="mt-12">
                <div className="flex justify-center w-full z-30 ml-20">
                  <div className="">
                    <div>
                      <input
                        type="text"
                        className={styles.form__input2}
                        placeholder="Nom"
                      />
                    </div>

                    <div className="py-4">
                      <input
                        type="text"
                        className={styles.form__input2}
                        placeholder="Adresse E-mail"
                      />
                    </div>

                    <div>
                      <textarea
                        className={styles.form__textarea2}
                        aria-label="Message"
                        defaultValue={"Message"}
                      />
                    </div>

                    <div className="py-4">
                      <PrimaryBtn text={"Soumettre"} fontSize={"xl"} />
                    </div>
                  </div>
                </div>
                <div className={styles.form__overlayImg3}>
                  <StaticImage
                    alt="airway"
                    height={400}
                    src="../../images/Ellipse3.png"
                  />
                </div>
              </div>
            </div>

            <div className="">
              <StaticImage
                className="float-right absolute right-0 -mt-20"
                alt="airway"
                height={300}
                width={300}
                src="../../images/png-clipart-black-airway-aviation-aircraft.png"
              />

              <StaticImage
                className="absolute h-[35rem] w-[20rem] ml-40"
                alt="airway"
                src="../../images/smiley-femme-bagage-rouge-coup-moyen.png"
              />
              <StaticImage
                className="relative float-right mt-40 -z-30"
                alt="airway"
                height={400}
                src="../../images/Ellipse4.png"
              />
            </div>
          </div>
        </section>
      </>
    );
}
 
export default ContactForm;