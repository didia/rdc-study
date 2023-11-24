import React from 'react';
import * as styles from "./styles.module.scss";

const PrimaryBtn = ({ text }) => {
    return (
      <button className="bg-sky-600 text-white text-xs font-bold py-3 px-3 rounded-md transition-colors duration-300 ease-in-out hover:bg-yellow-500 hover:text-black">
        {text}
      </button>
    );
}

export default PrimaryBtn;