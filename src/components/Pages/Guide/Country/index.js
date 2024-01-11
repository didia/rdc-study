import React, { useEffect } from "react";
import Layout from "../../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage, getImage, GatsbyImage } from "gatsby-plugin-image";
import HtmlContent from "../../../HtmlContent";
import PrimaryBtn from "../../../Button/Primary";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";

const CountryGuide = ({ guide, relatedGuides, otherGuides }) => {
  const image = getImage(guide.flag);

  return (
    <Layout pageTitle={`Etudier en ${guide.name}`}>
      <section className="md:hidden">
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

      <section className="hidden md:block mt-10">
        <div className="grid grid-cols-12">
          <div className="col-span-1">
            <div className={styles.ellipse2}>
              <StaticImage
                height={320}
                alt="aiplane"
                src="../../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          {guide.flag ? (
            <>
              <div className="col-span-11 z-10 mt-5">
                <div className="grid grid-cols-12 gap-10">
                  <div className=" col-span-8">
                    <p className="text-sky-600 text-5xl font-extrabold text-start mb-3">
                      {guide.title}
                    </p>
                    <p className="text-xl text-justify py-4">{guide.excerpt}</p>
                  </div>

                  <div className="col-span-4">
                    <GatsbyImage
                      image={image}
                      alt="flag"
                      className="rounded-sm h-40 w-64"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-10 z-10 mt-5">
              <p className="text-sky-600 text-4xl font-extrabold text-start mb-3">
                {guide.title}
              </p>
              <p className="text-xl text-justify mr-3">{guide.excerpt}</p>
            </div>
          )}
        </div>
      </section>

      <section className="-mt-16 md:hidden">
        <div className="h-20 border-b-2 border-sky-600 mx-6"></div>
        <HtmlContent
          content={guide.content}
          htmlclassName={"py-2 mx-6 text-justify"}
        />
        <div className="ml-6">
          <PrimaryBtn text="Demander une Assistance" />
        </div>
      </section>

      <section className="hidden md:block">
        <div className="h-20 border-b-2 border-sky-600 mx-10"></div>
        <HtmlContent
          content={guide.content}
          htmlclassName={"py-2 mx-10 text-justify text-xl"}
        />
        <div className="ml-6">
          <PrimaryBtn text="Demander une Assistance" />
        </div>
      </section>

      <section className="mx-6 md:hidden">
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

      <section className="mx-10 hidden md:block">
        <div className="text-sky-600 text-2xl font-black absolute mt-10 uppercase">
          Guides reliés
        </div>
        <div className="h-20 border-b-2 border-sky-600"></div>
        <AnimationOnScroll animateIn="animate__fadeInUp">
          <div className="grid grid-cols-3 mt-5">
            {relatedGuides.map((relatedGuide) => {
              return (
                <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href={`/${relatedGuide.slug}`}>
                    <GatsbyImage
                      class="rounded-t-lg h-72"
                      image={getImage(relatedGuide.thumbnail)}
                      alt="flag"
                    />
                  </a>
                  <div class="p-5">
                    <a href={`/${relatedGuide.slug}`}>
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {relatedGuide.title}
                      </h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {relatedGuide.excerpt}
                    </p>
                    <a
                      href={`/${relatedGuide.slug}`}
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lire le guide
                      <svg
                        class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimationOnScroll>
      </section>

      <section className="mx-6 md:hidden">
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

      <section className="mx-6 hidden md:block">
        <div className="text-sky-600 text-xl font-black absolute mt-20 uppercase">
          Autres guides qui pourraient vous intéresser
        </div>
        <div className="h-20 border-b-2 py-16 border-sky-600"></div>
        <AnimationOnScroll animateIn="animate__fadeInUp">
          <div className="grid lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-3 gap-3 mt-5">
            {otherGuides.map((otherGuide) => {
              return (
                <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow mb-7">
                  <a href={`/${otherGuide.slug}`}>
                    <GatsbyImage
                      class="rounded-t-lg h-72"
                      image={getImage(otherGuide.thumbnail)}
                      alt="flag"
                    />
                  </a>
                  <div class="p-5">
                    <a href={`/${otherGuide.slug}`}>
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {otherGuide.title}
                      </h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {otherGuide.excerpt}
                    </p>
                    <a
                      href={`/${otherGuide.slug}`}
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lire le guide
                      <svg
                        class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimationOnScroll>
      </section>
    </Layout>
  );
};

export default CountryGuide;
