import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from "./styles.module.scss";

const ContactForm = ({ title, bgImg, marginBottom }) => {
    return (
      <>
        <section className={marginBottom}>
          <div className="text-center mx-10 z-10">
            <span className="text-sky-600 text-2xl font-black">
              Besoin d'un service ?
            </span>{" "}
            <p className="py-7">
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
            </p>
          </div>

          <div>
            <div class="flex justify-center w-full z-10 absolute">
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
                  <textarea className={styles.form__textarea} aria-label='Message' defaultValue={"Message"} />
                </div>

                <div className="py-4">
                  <button class="bg-sky-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.form__overlayImg}>
              <StaticImage alt='airway' src="../../images/png-clipart-black-airway.png" />
            </div>
          </div>
        </section>
      </>
    );
}
 
export default ContactForm;