import React from "react";
import Layout from "../../Layout";
import HeroSection from "./components/HeroSection";
import ScholarshipSection from "./components/ScholarshipSection";
import StudyCountry from "../../StudyCountry";
import Scholarship from "../../Scholarship";
import ContactForm from "../../ContactForm";
import NewsCard from "../../NewsCard";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";

const Home = ({ guideCountries, articles, scholarships }) => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <HeroSection />
      <ScholarshipSection />
      <StudyCountry guideCountries={guideCountries} />
      <Scholarship scholarships={scholarships} />

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="mb-5 mt-10 md:mt-7">
          <div className="text-left px-3 md:p-8 md:mx-24 mb-5">
            <span className="text-[#4bb4d4] text-lg font-black uppercase md:text-xl font-['roboto']">
              Les dernières nouvelles
            </span>
            <div className="h-4 w-full border-b border-sky-600"></div>
          </div>

          {articles.map((article) => (
            <NewsCard
              key={article.frontmatter.title}
              ItemData={article.frontmatter}
            />
          ))}
        </section>
      </AnimationOnScroll>

      <section className="mb-5 md:mb-28 mt-12 md:mt-28">
        <div className="text-center md:mb-10">
          <span className="text-[#4bb4d4] text-2xl font-semibold md:text-4xl font-['roboto']">
            Nos partenaires
          </span>
        </div>

        <AnimationOnScroll animateIn="animate__fadeInRight" animateOnce>
          <div className="container relative z-40 mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-4 py-6 text-center">
              <PartnerLogo
                href="/article/faire-une-formation-professionnelle-institut-a-l-institut-africain-de-haute-formation"
                src="../../../../images/iahf.png"
                alt="logo"
                text="INSTITUT AFRICAIN DE HAUTE FORMATION (TUNISIE)"
              />
              <PartnerLogo
                href="/article/faites-une-formation-professionnelle-de-qualite-chez-excelia"
                src="../../../../images/excelia.png"
                alt="Logo"
                text="EXCELIA GROUP (FRANCE)"
              />
              <PartnerLogo
                href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie"
                src="../../../../images/medipol.jpg"
                alt="logo"
                text="UNIVERSITE MEDIPOL D'ISTANBUL (TURQUIE)"
              />
              <div className="hidden md:flex">
                <PartnerLogo
                  href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie"
                  src="../../../../images/universite_de_lefke.webp"
                  alt="logo"
                  text="UNIVERSITE EUROPEENNE DE LEFKE EN CHYPRE DU NORD"
                />
              </div>
            </div>
          </div>
        </AnimationOnScroll>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

const PartnerLogo = ({ href, src, alt, text }) => (
  <div>
    <a href={href}>
      <StaticImage
        src={src}
        className="block mx-auto"
        placeholder="blurred"
        alt={alt}
        height={90}
        objectFit="contain"
      />
      <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-base md:text-base md:pt-6 font-['roboto']">
        {text}
      </p>
    </a>
  </div>
);

export default Home;
