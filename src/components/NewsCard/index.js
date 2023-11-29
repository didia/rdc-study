import React from 'react';
import * as styles from "./styles.module.scss";

const NewsCard = ({ image, title, desc }) => {
    return (
      <>
        <div class="max-sm:hidden flex items-center justify-center mb-3">
          <div class="relative flex w-full max-w-[48rem] flex-row rounded-sm bg-white bg-clip-border text-gray-700 shadow-md">
            <div class="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-sm rounded-r-none bg-white bg-clip-border text-gray-700">
              <img src={image} alt="image" class="h-full w-full object-cover" />
            </div>
            <div class="p-4">
              <h6 class="mb-4 block font-sans text-base font-semibold leading-relaxed tracking-normal text-sky-600 antialiased">
                startups
              </h6>
              <p class="block font-sans text-base font-normal text-gray-700 antialiased">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
            </div>
          </div>
        </div>

        <div class="sm:hidden max-sm:visible grid grid-cols-12 gap-4 py-2">
          <div className="col-span-5 px-4">
            <img src={image} className="object-contain" />
          </div>
          <div className="col-span-7 -mt-2">
            <span className="text-sky-600 text-lg font-extrabold">
              { title || "Titre de l'article" }
            </span>{" "}
            <p className="text-sm mr-7 text-justify">
              { desc || "Lorem ispum dolor fortuna simpre cresis, out decresis vita detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis" }
            </p>
          </div>
        </div>
      </>
    );
}
 
export default NewsCard;