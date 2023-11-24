import React from 'react';
import * as styles from "./styles.module.scss";

const NavLink = ({title, url}) => {
    return (
      <li className="border py-2 border-white border-opacity-60 opacity-60">
        {" "}
        <a href={url}>{title}</a>
      </li>
    );
}

export default NavLink;