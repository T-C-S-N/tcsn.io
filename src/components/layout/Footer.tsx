/** @format */

import styles from "@/styles/components/Footer.module.css";
import { Codepen, Instagram, Mail } from "react-feather";
import { FaGithub, FaLinkedin, FaBehance, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.media}>
        <a href='http://bit.ly/3XwVLgF' title='tocausan@Github' target='_blank' rel='noreferrer'>
          <i className='fab fa-github'></i>
          <FaGithub color='black' size={20} />
        </a>
        <a href='http://bit.ly/3X6WKUJ' title='tocausan@Codepen' target='_blank' rel='noreferrer'>
          <i className='fab fa-codepen'></i>
          <Codepen color='black' size={20} />
        </a>
        <a href='https://bit.ly/3CNyi2S' title='tocausan@Linkedin' target='_blank' rel='noreferrer'>
          <i className='fab fa-linkedin'></i>
          <FaLinkedin color='black' size={20} />
        </a>
        <a href='http://bit.ly/3H3JICa' title='tocausan@Pinterest' target='_blank' rel='noreferrer'>
          <i className='fab fa-pinterest'></i>
          <FaPinterest color='black' size={20} />
        </a>
        <a href='http://bit.ly/3CKsiHQ' title='tocausan@Instagram' target='_blank' rel='noreferrer'>
          <i className='fab fa-instagram'></i>
          <Instagram color='black' size={20} />
        </a>
        <a href='http://bit.ly/3IIexNV' title='tocausan@Behance' target='_blank' rel='noreferrer'>
          <i className='fab fa-behance'></i>
          <FaBehance color='black' size={20} />
        </a>
        <a href='mailto: hello@tcsn.io' title='hello@tcsn.io' target='_blank' rel='noreferrer'>
          <i className='far fa-envelope'></i>
          <Mail color='black' size={20} />
        </a>
      </div>
      <div className={styles.copyright}>
        <p>tocausan | {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

