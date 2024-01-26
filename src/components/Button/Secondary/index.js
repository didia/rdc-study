import React from 'react';
import * as styles from "./styles.module.scss";

const SecondaryBtn = ({ text, fontSize }) => {
  return (
    <button
      className={`font-['roboto-bold'] md:font-['monserrat-bold'] text-white bg-yellow-400 py-3 font-bold px-5 rounded-md transition-colors duration-300 ease-in-out hover:bg-sky-600 hover:text-white ${
        fontSize ? fontSize : " text-xs"
      }`}
    >
      {text}
    </button>
  );
};

export default SecondaryBtn;