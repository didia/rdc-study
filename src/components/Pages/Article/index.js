import React from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import NewsCard from "../../NewsCard";

const Article = ({ otherArticles }) => {

  return (
    <Layout pageTitle={"Rdc Etudes Articles"}>

      <section className="mb-5 mt-10 md:mt-10">
          <div className="text-left mx-28 px-3 md:p-8 mb-5">
            <span className="text-sky-600 text-lg font-black uppercase md:text-xl font-['roboto-bold']">
              Les dernières nouvelles
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
