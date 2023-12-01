import React from 'react';

const ValueCard = ({ title, section1, section2 }) => {
  return (
    <>
      <div className="mx-auto mb-10 block max-w-[18rem] rounded bg-white text-left shadow-2xl border-b-8 border-sky-600">
        <div className="p-6">
          <h5 className="text-center mb-1 text-xl font-medium leading-tight text-sky-600">
            {title}
          </h5>
          <p className="mb-6 mt-6 text-base text-center leading-normal">
            {section1}
          </p>

          <p className="mb-6 mt-6 text-base text-center">{section2}</p>
        </div>
      </div>
    </>
  );
};
 
export default ValueCard;