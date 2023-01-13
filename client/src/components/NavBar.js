/** @format */

import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className='navbar'>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/projects'>Projects</NavLink>
        </li>
        <li>
          <NavLink to='/contact'>Contact</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
