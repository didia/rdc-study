import React from 'react';

const ValueCard = ({ title, section1, section2, extraStyle }) => {
  return (
    <>
      <div
        className={
          "mx-auto mb-10 block max-w-[20rem] md:max-w-[27rem] md:h-[25rem] rounded bg-white text-left shadow-2xl border-b-8 border-sky-600 " +
          extraStyle
        }
      >
        <div className="p-6">
          <h5 className="uppercase text-center font-['roboto'] mb-1 text-xl md:text-xl font-bold leading-tight text-[#4bb4d4]">
            {title}
          </h5>
          <p className="mb-6 mt-6 md:mt-10 text-base md:text-lg text-center leading-normal font-['roboto']">
            {section1}
          </p>

          <p className="mb-6 mt-6 md:mt-10 md:text-lg text-base text-center">
            {section2}
          </p>
        </div>
      </div>
    </>
  );
};
 
export default ValueCard;