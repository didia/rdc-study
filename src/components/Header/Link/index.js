import React from 'react';
import * as styles from "./styles.module.scss";

const NavLink = ({title, url}) => {
    return (
      <>
        <li className="md:hidden border py-2 border-white border-opacity-60 opacity-60 text-sm">
          {" "}
          <a href={url}>{title}</a>
        </li>
        <a
          href={url}
          className={"hidden md:flex text-sky-600 uppercase " + styles.title}
        >
          {" "}
          {title}
        </a>
      </>
    );
}

export default NavLink;