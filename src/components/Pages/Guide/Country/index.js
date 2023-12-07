import React, { useEffect } from "react";
import Layout from "../../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage, getImage, GatsbyImage } from "gatsby-plugin-image";
import HtmlContent from "../../../HtmlContent";

const CountryGuide = ({ attributes, html }) => {
  const image = getImage(attributes.flag);
 
  return (
    <Layout pageTitle={`Etudier en ${attributes.name}`}>
      <section>
        <div className="grid grid-cols-12 text-center">
          <div className="col-span-1">
            <div className={styles.ellipse2}>
              <StaticImage
                height={270}
                alt="aiplane"
                src="../../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          <div className="col-span-8 ml-5 z-10 mt-5">
            <p className="text-sky-600 text-2xl font-extrabold text-start mb-3">
              Etudier en {attributes.name}
            </p>
            <p className="text-base text-justify mr-3">{attributes.excerpt}</p>
          </div>
          <div className="col-span-3 mt-7 mr-2">
            <GatsbyImage image={image} alt="flag" />
          </div>
        </div>
      </section>
      <section className="-mt-10">
        <div className="h-20 border-b-2 border-sky-600 mx-8"></div>
        <HtmlContent content={html} htmlclassName={"py-2 mx-8"} />
        <div className="h-20 border-b-2 border-sky-600 mx-8"></div>
        <div>
          <div className="grid grid-cols-1 mx-10 py-3">
            <div>
              <StaticImage
                alt="gallery"
                className="block h-full w-full rounded-sm object-cover object-center"
                src="../../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png"
              />
            </div>
          </div>

          <div className="mx-10 text-justify">
            <p className="text-sky-600 text-xl font-bold uppercase">
              étudier au canada
            </p>
            <p className="py-2">
              Lorem ipsum dolor sit amet consectetur. Neque duis cras lectus non
              habitant et. At morbi volutpat sit eget luctus sed tellus dolor
              amet. Gravida amet mi pellentesque nisl tempor eget volutpat
              pulvinar. Lorem ipsum dolor sit amet consectetur. Neque duis cras
              lectus non habitant et..
            </p>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 mx-10 py-7">
            <div>
              <StaticImage
                alt="gallery"
                className="block h-full w-full rounded-sm object-cover object-center"
                src="../../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png"
              />
            </div>
          </div>

          <div className="mx-10 text-justify">
            <p className="text-sky-600 text-xl font-bold uppercase">
              étudier au canada
            </p>
            <p className="py-2">
              Lorem ipsum dolor sit amet consectetur. Neque duis cras lectus non
              habitant et. At morbi volutpat sit eget luctus sed tellus dolor
              amet. Gravida amet mi pellentesque nisl tempor eget volutpat
              pulvinar. Lorem ipsum dolor sit amet consectetur. Neque duis cras
              lectus non habitant et..
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CountryGuide;
