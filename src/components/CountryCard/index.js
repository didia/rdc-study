import React from 'react';

const CountryCard = () => {
    return (
      <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div className="relative overflow-hidden bg-cover bg-no-repeat">
          <StaticImage
            className="rounded-t-lg"
            alt="tour"
            placeholder="blurred"
            src="../../images/flatten.jpg"
          />
        </div>
        <div className="p-6">
          <p className="text-base text-[#4bb4d4] font-extrabold">CANADA</p>
        </div>
      </div>
    );
}

export default CountryCard;