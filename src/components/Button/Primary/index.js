import React from 'react';

const PrimaryBtn = ({ text, fontSize, href, children, type }) => {
    return (
      <>
        <a href={href || "#"}>
          <button
            type={type ? type : "button"}
            className={`md:hidden font-['roboto'] bg-[#4bb4d4] text-white font-bold py-3 px-3 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white
            ${fontSize ? fontSize : " text-sm"}`}
          >
            {text} {children}
          </button>
        </a>

        <a href={href}>
          <button
            type={type ? type : "button"}
            className="hidden md:flex font-['roboto'] bg-[#4bb4d4] text-white text-lg py-3 px-3 rounded-xl transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-white"
          >
            {text}
          </button>
        </a>
      </>
    );
}

export default PrimaryBtn;