import React, { useEffect } from "react";
import Layout from "../../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage, getImage, GatsbyImage } from "gatsby-plugin-image";
import HtmlContent from "../../../HtmlContent";
import PrimaryBtn from "../../../Button/Primary";

const CountryGuide = ({ guide, relatedGuides, otherGuides }) => {
  const image = getImage(guide.flag);

  return (
    <Layout pageTitle={`Etudier en ${guide.name}`}>
      <section>
        <div className="grid grid-cols-12">
          <div className="col-span-1">
            <div className={styles.ellipse2}>
              <StaticImage
                height={220}
                alt="aiplane"
                src="../../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          {guide.flag ? (
            <>
              <div className="col-span-10 z-10 mt-5">
                <div className="grid grid-cols-2">
                  <div className="">
                    <GatsbyImage
                      image={image}
                      alt="flag"
                      className="rounded-sm"
                    />
                  </div>

                  <div>
                    <p className="text-sky-600 text-2xl font-extrabold text-center mb-3">
                      {guide.title}
                    </p>
                  </div>
                </div>
                <p className="text-base text-justify py-4">{guide.excerpt}</p>
              </div>
            </>
          ) : (
            <div className="col-span-10 z-10 mt-5">
              <p className="text-sky-600 text-2xl font-extrabold text-start mb-3">
                {guide.title}
              </p>
              <p className="text-base text-justify mr-3">{guide.excerpt}</p>
            </div>
          )}
        </div>
      </section>
      <section className="-mt-16">
        <div className="h-20 border-b-2 border-sky-600 mx-6"></div>
        <HtmlContent
          content={guide.content}
          htmlclassName={"py-2 mx-6 text-justify"}
        />
        <div className="ml-6">
          <PrimaryBtn text="Demander une Assistance" />
        </div>
      </section>

      <section className="mx-6">
        <div className="text-sky-600 text-xl font-black absolute mt-10 uppercase">
          Guides reliés
        </div>
        <div className="h-20 border-b-2 border-sky-600"></div>
        {relatedGuides.map((relatedGuide) => {
          return (
            <div className="py-4">
              <div className="grid grid-cols-1">
                <div>
                  <GatsbyImage
                    className="block h-full w-full rounded-sm object-cover object-center"
                    image={getImage(relatedGuide.thumbnail)}
                    alt="flag"
                  />
                </div>
              </div>

              <div className="text-start">
                <a
                  href={`/${relatedGuide.slug}`}
                  className="text-sky-600 text-md font-bold uppercase"
                >
                  {relatedGuide.title}
                </a>
                <p className="py-2 text-justify">{relatedGuide.excerpt}</p>
                <a href={`/${relatedGuide.slug}`}>
                  <PrimaryBtn text="Lire le guide" />
                </a>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mx-6">
        <div className="text-sky-600 text-md font-black absolute mt-10 uppercase">
          Autres guides qui pourraient vous intéresser
        </div>
        <div className="h-20 border-b-2 py-12 border-sky-600"></div>
        {otherGuides.map((otherGuide) => {
          return (
            <div className="py-4">
              <div className="grid grid-cols-1">
                <div>
                  <GatsbyImage
                    className="block h-full w-full rounded-sm object-cover object-center"
                    image={getImage(otherGuide.thumbnail)}
                    alt="flag"
                  />
                </div>
              </div>

              <div className="text-start">
                <a
                  href={`/${otherGuide.slug}`}
                  className="text-sky-600 text-md font-bold uppercase"
                >
                  {otherGuide.title}
                </a>
                <p className="py-2 text-justify">{otherGuide.excerpt}</p>
                <a href={`/${otherGuide.slug}`}>
                  <PrimaryBtn text="Lire le guide" />
                </a>
              </div>
            </div>
          );
        })}
      </section>
    </Layout>
  );
};

export default CountryGuide;
