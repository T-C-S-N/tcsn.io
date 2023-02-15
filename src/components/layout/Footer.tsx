/** @format */

import Config from '@/lib/Config'
import styles from "@/styles/components/Footer.module.css";
import Link from "next/link";
import { Codepen, Instagram, Mail } from "react-feather";
import { FaGithub, FaLinkedin, FaBehance, FaPinterest, } from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";

export default function Footer() {
  return (
    <footer className='w-[100%] px-5 py-2 flex flex-col sm:flex-row justify-center items-center sm:justify-between absolute bottom-0 bg-white'>
      <div className='w-[100%] sm:w-[50%] flex flex-row justify-evenly sm:justify-start'>
        <Link href={Config.social.github.url} title='tocausan@Github' target='_blank' rel='noreferrer' className="px-1">
          <FaGithub color='black' size={20} />
        </Link>
        <Link href={Config.social.codepen.url} title='tocausan@Codepen' target='_blank' rel='noreferrer' className="px-1">
          <Codepen color='black' size={20} />
        </Link>
        <Link href={Config.social.linkedin.url} title='tocausan@Linkedin' target='_blank' rel='noreferrer' className="px-1">
          <FaLinkedin color='black' size={20} />
        </Link>
        <Link href={Config.social.pinterest.url} title='tocausan@Pinterest' target='_blank' rel='noreferrer' className="px-1">
          <FaPinterest color='black' size={20} />
        </Link>
        <Link href={Config.social.instagram.url} title='tocausan@Instagram' target='_blank' rel='noreferrer' className="px-1">
          <Instagram color='black' size={20} />
        </Link>
        <Link href={Config.social.behance.url} title='tocausan@Behance' target='_blank' rel='noreferrer' className="px-1">
          <FaBehance color='black' size={20} />
        </Link>
        <Link href={'mailto:' + Config.email} title={Config.email} target='_blank' rel='noreferrer' className="px-1">
          <Mail color='black' size={20} />
        </Link>
      </div>

      <div className='w-[100%] text-[12px] mt-5 flex justify-center sm:justify-end items-end'>
        <p>{Config.copyright} | {new Date().getFullYear()}</p>
        <span className="ml-2 text-[10px]">
          {/*<Link href={Config.by.url}>{Config.by.text}</Link>*/}
        </span>
      </div>
    </footer>
  );
};