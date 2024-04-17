import React, {useEffect} from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import NewsCard from "../../NewsCard";
import SocialShareButtons from "../../SocialShareButtons";

const ArticleDetails = ({ article, content, otherArticles }) => {
  const image = getImage(article.thumbnail);
  let sharedImg = null
  sharedImg = article.thumbnail && article.thumbnail.childImageSharp && article.thumbnail.childImageSharp.gatsbyImageData
  return (
    <Layout pageTitle={"Détails sur la article d'études"}>
      <section>
        <div className="grid grid-cols-1">
          <div>
            <GatsbyImage
              image={image}
              className="md:h-[30rem]"
              objectFit="cover"
              alt={article.title}
            />
          </div>
        </div>
        <div className="mx-4 md:mx-28 md:mt-10">
          <p className="text-sky-600 text-xl md:text-2xl md:uppercase font-bold text-start">
            {article.title}
          </p>
          <p className="py-2 text-lg text-gray-600 font-['roboto']">{article.excerpt}</p>

          <p className="text-lg text-yellow-500"><FontAwesomeIcon icon={faCalendar} />  {article.date}</p>
        </div>

        <div className="mx-4 md:mx-28">
          <HtmlContent content={content} htmlclassName="md:text-lg font-['roboto'] mt-10" />
        </div>
      </section>

      <SocialShareButtons 
                          title={article.title} 
                          subject={article.slug} 
                          message={article.excerpt} 
                          path={article.slug} 
                          img={sharedImg}
      />
      <section className="mb-5 mt-10 md:mt-10">
          <div className="text-left px-3 md:p-8 mb-5">
            <span className="text-sky-600 text-base font-black uppercase md:text-xl font-['roboto-bold']">
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

export default ArticleDetails;
