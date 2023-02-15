/** @format */

import Config from '@/utils/Config'
import styles from "@/styles/components/Footer.module.css";

export default function Footer() {
  return (
    <footer className={[styles.footer, 'flex-justify-end'].join(' ')}>
      <div className={styles.copyright}>
        <p>{Config.copyright} | {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};