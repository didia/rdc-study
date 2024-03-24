import React from 'react';

const PrimaryBtn = ({ text, fontSize, href, children }) => {
    return (
      <>
        <a href={href || "#"}>
          <button
            className={`md:hidden font-['monserrat-bold'] bg-sky-600 text-white font-bold py-3 px-3 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white
            ${fontSize ? fontSize : " text-xs"}`}
          >
            {text} {children}
          </button>
        </a>

        <a href={href}>
          <button className="hidden md:flex font-['monserrat-bold'] bg-sky-600 text-white text-lg font-bold py-5 px-4 rounded-xl transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white">
            {text}
          </button>
        </a>
      </>
    );
}

export default PrimaryBtn;