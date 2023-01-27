/** @format */

import config from "@/lib/config";
import styles from "@/styles/components/Footer.module.css";

export default function Footer() {
  return (
    <footer className={[styles.footer, 'flex-justify-end'].join(' ')}>
      <div className={styles.copyright}>
        <p>{config.copyright} | {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};