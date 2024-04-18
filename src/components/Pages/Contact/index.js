import React from 'react';
import Layout from '../../Layout';
import ValueCard from '../../ValueCard';
import ContactForm from '../../ContactForm';
import GoogleMapFrame from '../GoogleMap';
import { StaticImage } from 'gatsby-plugin-image';

import img_overlay from "../../../images/Ellipse9.png";
import * as styles from "./style.module.scss";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";

const Contact = () => {
    return (
      <Layout pageTitle={"Contactez-nous"}>
        <section className="md:hidden">
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
                  <span
                    className={`${styles.about__description} font-['roboto']`}
                  >
                    RDC ETUDES vous offre des services de consultation qui vous
                    permet de discuter avec un mentor sur l'état de votre projet
                    d'études. Vous êtes bloqué(e)? Vous ne savez par où
                    commencer ? Nos mentors seront ravis de vous aider a y voir
                    un peu plus clair
                  </span>
                  <StaticImage alt="phone" src="../../../images/phone.png" />
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <div className={styles.ellipse4}>
                <StaticImage
                  height={300}
                  alt="airplane"
                  src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview6.png"
                />
              </div>
            </div>

            <div>
              <StaticImage alt="envelope" src="../../../images/envelope.png" />
            </div>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="grid grid-cols-12 mb-8 mt-4 z-999">
            <div className="col-span-3">
              <AnimationOnScroll animateIn="animate__bounceIn">
                <StaticImage
                  alt="plans"
                  src="../../../images/Earth-Travel-World-Transparent-PNG.png"
                />
              </AnimationOnScroll>
            </div>
            <div className="col-span-7 z-10 mt-10">
              <StaticImage
                height={100}
                alt="airplane"
                className="-z-20"
                src="../../../images/search-location2.png"
              />
              <div className="text-start ml-16 -mt-5">
                <span className="text-[#4bb4d4] text-5xl font-extrabold">
                  Contactez RDC Etudes
                </span>{" "}
                <p className="mt-5">
                  <span className="text-xl font-['roboto']">
                    RDC ETUDES vous offre des services de consultation qui vous
                    permet de discuter avec un mentor sur l'état de votre projet
                    d'études. Vous êtes bloqué(e)? Vous ne savez par où
                    commencer ? Nos mentors seront ravis de vous aider a y voir
                    un peu plus clair
                  </span>
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <div className={styles.ellipse4}>
                <StaticImage
                  height={600}
                  alt="airplane"
                  src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview17.png"
                />
              </div>
            </div>

            <div>
              <StaticImage
                className="h-24 w-24"
                alt="envelope"
                src="../../../images/envelope.png"
              />
            </div>
          </div>
        </section>

        <section className="md:hidden">
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

          <ValueCard title={"Adresse E-mail"} section1={"salut@rdcetudes.com"} />
        </section>

        <section className="hidden md:block">
          <div className="grid grid-cols-4">
            <ValueCard
              extraStyle={"w-[22rem]"}
              title={"Heure de service"}
              section1={"08H-16H30"}
              section2={"Du Lundi au Vendredi"}
            />
            <ValueCard
              extraStyle={"w-[22rem]"}
              title={"Téléphone"}
              section1={"+243826686661"}
              section2={"+243826686661"}
            />
            <ValueCard
              extraStyle={"w-[22rem]"}
              title={"Bureaux"}
              section1={
                "Local LM3, Nouvelles galeries Présidentielles, Boulevard du 30 juin, Kinhsasa, République Démocratique du Congo"
              }
            />

            <ValueCard
              extraStyle={"w-[22rem]"}
              title={"Adresse E-mail"}
              section1={"salut@rdcetudes.com"}
            />
          </div>
        </section>

        <section>
          <ContactForm bgImg={img_overlay} />
        </section>

        <section className="mt-24 md:-mt-16">
          <GoogleMapFrame />
        </section>
      </Layout>
    );
}
 
export default Contact;