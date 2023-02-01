/** @format */

import config from "@/lib/config";
import styles from "@/styles/components/Footer.module.css";
import Link from "next/link";
import { Codepen, Instagram, Mail } from "react-feather";
import { FaGithub, FaLinkedin, FaBehance, FaPinterest, } from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.media}>
        <Link href={config.social.github.url} title='tocausan@Github' target='_blank' rel='noreferrer'>
          <FaGithub color='black' size={20} />
        </Link>
        <Link href={config.social.codepen.url} title='tocausan@Codepen' target='_blank' rel='noreferrer'>
          <Codepen color='black' size={20} />
        </Link>
        <Link href={config.social.linkedin.url} title='tocausan@Linkedin' target='_blank' rel='noreferrer'>
          <FaLinkedin color='black' size={20} />
        </Link>
        <Link href={config.social.pinterest.url} title='tocausan@Pinterest' target='_blank' rel='noreferrer'>
          <FaPinterest color='black' size={20} />
        </Link>
        <Link href={config.social.instagram.url} title='tocausan@Instagram' target='_blank' rel='noreferrer'>
          <Instagram color='black' size={20} />
        </Link>
        <Link href={config.social.behance.url} title='tocausan@Behance' target='_blank' rel='noreferrer'>
          <FaBehance color='black' size={20} />
        </Link>
        <Link href={'mailto:' + config.email} title='hello@tcsn.io' target='_blank' rel='noreferrer'>
          <Mail color='black' size={20} />
        </Link>
        <Link href='/design-system' title='Design System' rel='noreferrer'>
          <MdOutlineDesignServices color='black' size={20} />
        </Link>
      </div>

      <div className={styles.copyright}>
        <p>{config.copyright} | {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};