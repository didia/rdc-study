import React from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import NewsCard from "../../NewsCard";

const ArticleDetails = ({ article, content, otherArticles }) => {
  const image = getImage(article.thumbnail);

  return (
    <Layout pageTitle={"Détails sur la article d'études"}>
      <section>
        <div className="grid grid-cols-1 mx-6 py-3">
          <div>
            <GatsbyImage image={image} alt={article.title} />
          </div>
        </div>
        <div className="mx-6">
          <p className="text-sky-600 text-xl font-bold text-start">
            {article.title}
          </p>
          <p className="py-2 text-md text-gray-600">{article.excerpt}</p>

          <p className="text-lg text-yellow-500">Date : {article.date}</p>
        </div>

        <div className="mx-6">
          <HtmlContent content={content} />
        </div>
      </section>

      <section className="mx-2 mb-10">
        <div className="text-sky-600 text-lg font-black absolute mt-10 uppercase">
          Autres articles
        </div>
        <div className="h-20 border-b-2 border-sky-600"></div>
        <div className="">
          {otherArticles.map((article) => {
            return (
              <NewsCard
                key={article.frontmatter.title}
                ItemData={article.frontmatter}
              />
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default ArticleDetails;
