import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const NewsCard = ({ ItemData }) => {
    const image = getImage(ItemData.image);

  return (
    <>
      <div class="sm:hidden max-sm:visible grid grid-cols-12 gap-4 py-2">
        <div className="col-span-5 px-4">
          <GatsbyImage
            image={image}
            alt={ItemData.title}
            className="object-contain w-full"
          />
        </div>
        <div className="col-span-7 -mt-2">
          <span className="text-sky-600 text-lg font-extrabold">
            {ItemData.title}
          </span>{" "}
          <p className="text-sm mr-7 text-justify">{ItemData.description}</p>
        </div>
      </div>
    </>
  );
};
 
export default NewsCard;