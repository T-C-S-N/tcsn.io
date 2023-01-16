/** @format */

import styles from "@/styles/NavBar.module.css";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/projects'>Projects</Link>
        </li>
        <li>
          <Link href='/contact'>Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
