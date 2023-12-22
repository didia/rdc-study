import React from 'react';
import Layout from '../../Layout';
import ValueCard from '../../ValueCard';
import ContactForm from '../../ContactForm';
import GoogleMapFrame from '../GoogleMap';
import { StaticImage } from 'gatsby-plugin-image';

import img_overlay from "../../../images/Ellipse9.png";
import * as styles from "./style.module.scss";

const Contact = () => {
    return (
      <Layout pageTitle={"Contactez-nous"}>
        <section>
          <div className="grid grid-cols-12 mb-8 mt-4 z-999">
            <div className="col-span-3">
              <StaticImage
                alt="plans"
                src="../../../images/Earth-Travel-World-Transparent-PNG.png"
              />
            </div>
            <div className="col-span-7 z-10">
              <div className="text-start ml-4">
                <span className={styles.about__title}>
                  Contactez RDC Etudes
                </span>{" "}
                <p>
                  <span className={styles.about__description}>
                    Lorem ispum dolor fortuna simpre cresis, out decresis vita
                    Lorem
                  </span>
                  <StaticImage alt='phone' src="../../../images/phone.png" />
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <div className={styles.ellipse4}>
                <StaticImage
                  height={300}
                  alt='airplane'
                  src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview6.png"
                />
              </div>
            </div>

            <div>
              <StaticImage alt='envelope' src="../../../images/envelope.png" />
            </div>
          </div>
        </section>

        <section>
          <ValueCard
            title={"Heure de service"}
            section1={"08H-16H30"}
            section2={"Du Lundi au Vendredi"}
          />
          <ValueCard
            title={"Téléphone"}
            section1={"+243826686661"}
            section2={"+243826686661"}
          />
          <ValueCard
            title={"Bureaux"}
            section1={
              "Local LM3, Nouvelles galeries Présidentielles, Boulevard du 30 juin, Kinhsasa, République Démocratique du Congo"
            }
          />

          <ValueCard title={"Adresse E-mail"} section1={"info@rdcetudes.com"} />
        </section>

        <section>
          <ContactForm bgImg={img_overlay} />
        </section>

        <section className="-mt-48">
          <GoogleMapFrame />
        </section>
      </Layout>
    );
}
 
export default Contact;