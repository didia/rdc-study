import React from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import NewsCard from "../../NewsCard";
const Article = ({ otherArticles }) => {

  return (
    <Layout pageTitle={"Rdc Etudes Articles"}>

<section className="md:hidden">
        <div className="relative h-60 w-full bg-sky-600">
          <div className="absolute">
            <StaticImage alt="question" height={150} src="../../../images/Ellipse12.png" />
          </div>
          <div className="absolute font-['montserrat'] py-28 pl-16 text-center text-white text-xl font-bold uppercase z-20">
            Articles Récents
          </div>
          <div className="absolute bottom-0 right-0">
            <StaticImage
              src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
              alt="img student"
              width={150}
            />
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="relative h-[28rem] w-full bg-sky-600">
          <div className="absolute">
            <StaticImage
              alt="question"
              height={350}
              src="../../../images/Ellipse12.png"
            />
          </div>
          <div className="absolute py-40 ml-[30rem] text-center text-white text-4xl font-semibold font-['montserrat'] uppercase z-20">
          Nos Articles Récents
          </div>

          <div className="absolute bottom-0 right-0">
            <StaticImage
              src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
              alt="img student"
              width={320}
            />
          </div>
        </div>
      </section>

      <section className="mb-5 mt-10 md:mt-10">
          <div className="text-left md:mx-32 px-3 md:p-8 mb-5">
            <span className="text-sky-600 md:text-lg uppercase text-sm font-['roboto-bold']">
            Découvrez les derniers articles postés sur RDC-Etudes.
            </span>{" "}
            <div className="h-4 w-full border-b border-sky-600"></div>
          </div>

          
          {otherArticles.map((article) => {
            return (
              <NewsCard
                key={article.frontmatter.title}
                ItemData={article.frontmatter}
              />
            );
          })}
      </section>
    </Layout>
  );
};

export default Article;
