import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const NewsCard = ({ ItemData }) => {
  const image = getImage(ItemData.thumbnail);
  const substring = (val) => {
    return val.substring(0, 130) + "...";
  }
  return (
    <>
      <div className="sm:hidden max-sm:visible grid grid-cols-12 gap-4 py-3">
        <div className="col-span-5 ml-2">
          <a href={`/${ItemData.slug}`}>
            <GatsbyImage image={image} alt={ItemData.title} className="h-48" />
          </a>
        </div>
        <div className="col-span-7 -mt-2">
          <a
            href={`/${ItemData.slug}`}
            className="text-sky-600 text-lg font-extrabold"
          >
            {ItemData.title}
          </a>
          <p className="py-2 text-yellow-500">{ItemData.date}</p>
          <p className="text-sm mr-7 text-justify">
            {substring(ItemData.excerpt)}
          </p>
        </div>
      </div>
    </>
  );
};
 
export default NewsCard;