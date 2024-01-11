import React from 'react';
import * as styles from "./styles.module.scss";

const SecondaryBtn = ({ text }) => {
    return (
      <button className="font-['roboto-bold'] md:font-['monserrat-bold'] text-white bg-yellow-400 text-xs py-5 px-5 rounded-md transition-colors duration-300 ease-in-out hover:bg-sky-600 hover:text-white">
        {text}
      </button>
    );
}

export default SecondaryBtn;