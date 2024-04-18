import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const NewsCard = ({ ItemData }) => {
  const image = getImage(ItemData.thumbnail);
  const substring = (val) => {
    return val.substring(0, 130) + "...";
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-8 justify-evenly py-3 md:mx-40">
        <div className="col-span-5 ml-2">
          <a href={`/${ItemData.slug}`}>
            <GatsbyImage
              image={image}
              alt={ItemData.title}
              className="h-48 md:w-full md:h-[15rem]"
            />
          </a>
        </div>
        <div className="col-span-7 -mt-2">
          <a
            href={`/${ItemData.slug}`}
            className="text-[#4bb4d4] text-base md:text-2xl font-semibold font-['roboto']"
          >
            {ItemData.title}
          </a>
          <p className="py-2 md:text-lg text-yellow-500 font-['roboto']">
            {ItemData.date}
          </p>
          <p className="md:hidden text-sm md:text-xl mr-7 text-justify font-['roboto']">
            {substring(ItemData.excerpt)}
          </p>

          <p className="hidden md:flex text-base mr-28 text-justify font-['roboto']">
            {ItemData.excerpt}
          </p>
        </div>
      </div>
    </>
  );
};
 
export default NewsCard;