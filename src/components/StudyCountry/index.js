import React, { useEffect } from "react";
import * as styles from "./styles.module.scss";
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image";
import { Carousel } from "flowbite-react";
import { Card } from "flowbite-react";
import _ from "lodash";

const StudyCountry = ({ guideCountries }) => {

  useEffect(() => {
    console.log("guideCountries : ", guideCountries);
  })
  const substring = (val) => {
    return val.substring(0, 130) + "...";
  };

  const firstThree = _.filter(
    guideCountries,
    (guideCountry, index) => index < 3
  );
  return (
    <>
      <section className="mb-10">
        <div className={styles.travel_countries}>
          <StaticImage
            className={styles.travel_countries__img}
            alt="travel"
            src="../../images/World_Of_Empires.png"
            placeholder="blurred"
          />
          <div className={styles.travel_countries_inner}>
            <StaticImage
              alt="Overlay"
              className={styles.travel_countries_inner__img}
              src="../../images/Rectangle5.png"
              placeholder="blurred"
            />

            <div
              className={"md:hidden bloc " + styles.travel_countries_content}
            >
              <Carousel slide={true} indicators={false}>
                {guideCountries.map((guideCountry) => {
                  const image = getImage(guideCountry.frontmatter.thumbnail);
                  return (
                    <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                      <div className="relative overflow-hidden bg-cover bg-no-repeat">
                        <a href={`/${guideCountry.frontmatter.slug}`}>
                          <GatsbyImage
                            image={image}
                            alt={guideCountry.frontmatter.title}
                            className="rounded-t-lg"
                            style={{ height: "200px" }}
                          />
                        </a>
                      </div>
                      <div className="p-6">
                        <a
                          href={`/${guideCountry.frontmatter.slug}`}
                          className="text-lg text-sky-600 font-extrabold uppercase"
                        >
                          {guideCountry.frontmatter.name}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>

            <div className={styles.travel_countries_content}>
              <Carousel slide={true} indicators={false}>
                {guideCountries.map((guideCountry, index) => {
                  const image = getImage(guideCountry.frontmatter.thumbnail);
                  
                  const fisrtItem = guideCountries[index];
                  const secondItem = guideCountries[index + 1];
                  const thirdItem = guideCountries[index + 2];
                  return (
                    <div className="flex mx-60" key={index}>
                      {fisrtItem && (
                        <Card
                          className="max-w-sm mx-4 h-[420px]"
                          imgAlt="Meaningful alt text for an image that is not purely decorative"
                          renderImage={() => (
                            <GatsbyImage
                              image={getImage(fisrtItem.frontmatter.thumbnail)}
                              class="h-60 w-full"
                              alt={fisrtItem.frontmatter.title}
                            />
                          )}
                        >
                          <a href={`/${fisrtItem.frontmatter.slug}`}>
                            <h5 className="text-2xl font-['roboto'] font-bold tracking-tight text-gray-900 dark:text-white">
                              {fisrtItem.frontmatter.name}
                            </h5>
                          </a>
                          <p className="font-['roboto-bold'] font-normal text-gray-700 dark:text-gray-400 text-sm">
                            {fisrtItem.frontmatter.excerpt}
                          </p>
                        </Card>
                      )}

                      {secondItem && (
                        <Card
                          className="max-w-sm mx-4 h-[420px]"
                          imgAlt="Meaningful alt text for an image that is not purely decorative"
                          renderImage={() => (
                            <GatsbyImage
                              image={getImage(secondItem.frontmatter.thumbnail)}
                              class="h-60 w-full"
                              alt={secondItem.frontmatter.title}
                            />
                          )}
                        >
                          <a href={`/${secondItem.frontmatter.slug}`}>
                            <h5 className="text-2xl font-['roboto'] font-bold tracking-tight text-gray-900 dark:text-white">
                              {secondItem.frontmatter.name}
                            </h5>
                          </a>
                          <p className="font-['roboto-bold'] font-normal text-gray-700 dark:text-gray-400 text-sm">
                            {secondItem.frontmatter.excerpt}
                          </p>
                        </Card>
                      )}
                      {thirdItem && (
                        <Card
                          className="max-w-sm mx-4 h-[420px]"
                          imgAlt="Meaningful alt text for an image that is not purely decorative"
                          renderImage={() => (
                            <GatsbyImage
                              image={getImage(thirdItem.frontmatter.thumbnail)}
                              class="h-60 w-full"
                              alt={thirdItem.frontmatter.title}
                            />
                          )}
                        >
                          <a href={`/${thirdItem.frontmatter.slug}`}>
                            <h5 className="text-2xl font-['roboto'] font-bold tracking-tight text-gray-900 dark:text-white">
                              {thirdItem.frontmatter.name}
                            </h5>
                          </a>
                          <p className="font-['roboto-bold'] font-normal text-gray-700 dark:text-gray-400 text-sm">
                            {thirdItem.frontmatter.excerpt}
                          </p>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyCountry;
