import React from 'react';
import * as styles from "./styles.module.scss";

const SecondaryBtn = ({ text }) => {
    return (
      <button className="bg-yellow-500 text-xs font-bold py-3 px-3 rounded-md transition-colors duration-300 ease-in-out hover:bg-sky-600 hover:text-white">
        {text}
      </button>
    );
}

export default SecondaryBtn;