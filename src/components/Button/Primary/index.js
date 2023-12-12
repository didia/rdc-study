import React from 'react';

const PrimaryBtn = ({ text, fontSize, children }) => {
    return (
      <>
        <button
          className={`md:hidden bg-sky-600 text-white font-bold py-3 px-3 rounded-md transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-black
            ${fontSize ? fontSize : " text-xs"}`}
        >
          {text} {children}
        </button>
        <button className="hidden md:flex bg-sky-600 text-white text-lg font-bold py-3 px-3 rounded-md transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-black">
          {text}
        </button>
      </>
    );
}

export default PrimaryBtn;