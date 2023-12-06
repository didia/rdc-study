import React from 'react';

const NavLink = ({title, url}) => {
    return (
      <>
        <li className="md:hidden border py-2 border-white border-opacity-60 opacity-60 text-sm">
          {" "}
          <a href={url}>{title}</a>
        </li>
        <a href={url} className="hidden md:flex px-2 text-sky-600 text-sm uppercase">
          {" "}
          {title}
        </a>
      </>
    );
}

export default NavLink;