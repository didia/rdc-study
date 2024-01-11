import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const NewsCard = ({ ItemData }) => {
  const image = getImage(ItemData.thumbnail);
  const substring = (val) => {
    return val.substring(0, 130) + "...";
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-4 py-3">
        <div className="col-span-5 ml-2 md:ml-8">
          <a href={`/${ItemData.slug}`}>
            <GatsbyImage
              image={image}
              alt={ItemData.title}
              className="h-48 md:h-60"
            />
          </a>
        </div>
        <div className="col-span-7 -mt-2 md:-ml-[7rem]">
          <a
            href={`/${ItemData.slug}`}
            className="text-sky-600 text-lg md:text-2xl font-extrabold font-['monserrat-bold']"
          >
            {ItemData.title}
          </a>
          <p className="py-2 md:text-lg text-yellow-500 font-['roboto-bold']">
            {ItemData.date}
          </p>
          <p className="md:hidden text-sm md:text-xl mr-7 text-justify font-['roboto']">
            {substring(ItemData.excerpt)}
          </p>

          <p className="hidden md:flex text-sm md:text-xl mr-7 text-justify">
            {ItemData.excerpt}
          </p>
        </div>
      </div>
    </>
  );
};
 
export default NewsCard;