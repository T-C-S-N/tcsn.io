/** @format */

import Config from '@/utils/Config'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Codepen, Instagram, Mail } from "react-feather";
import { FaGithub, FaLinkedin, FaBehance, FaPinterest, } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    switch (true) {
      case router.pathname.includes('/projects'):
        setIsDarkMode(true);
        break;
      default:
        setIsDarkMode(false);
    }
  }, [router.pathname]);

  return (
    <footer className={[
      'w-[100%] max-w-[1500px] h-[75px] sm:h-[50px] px-5 py-2 flex flex-col sm:flex-row justify-center items-center sm:justify-between absolute bottom-0 ',
      isDarkMode ? 'bg-neutral-900 text-gray-300' : 'bg-white text-neutral-800'
    ].join(' ')}>
      <div className='w-[100%] sm:w-[50%] flex flex-row justify-evenly sm:justify-start'>
        <Link href={Config.social.github.url} title='tocausan@Github' target='_blank' rel='noreferrer' className="px-1 hover:text-gray-600 transition">
          <FaGithub size={20} />
        </Link>
        <Link href={Config.social.codepen.url} title='tocausan@Codepen' target='_blank' rel='noreferrer' className="px-1 hover:text-gray-600 transition">
          <Codepen size={20} />
        </Link>
        <Link href={Config.social.linkedin.url} title='tocausan@Linkedin' target='_blank' rel='noreferrer' className="px-1 hover:text-blue-600 transition">
          <FaLinkedin size={20} />
        </Link>
        <Link href={Config.social.pinterest.url} title='tocausan@Pinterest' target='_blank' rel='noreferrer' className="px-1 hover:text-red-600 transition">
          <FaPinterest size={20} />
        </Link>
        <Link href={Config.social.instagram.url} title='tocausan@Instagram' target='_blank' rel='noreferrer' className="px-1 hover:text-pink-600 transition">
          <Instagram size={20} />
        </Link>
        <Link href={Config.social.behance.url} title='tocausan@Behance' target='_blank' rel='noreferrer' className="px-1 hover:text-blue-600 transition">
          <FaBehance size={20} />
        </Link>
        <Link href={'mailto:' + Config.email} title={Config.email} target='_blank' rel='noreferrer' className="px-1 hover:text-cyan-600 transition">
          <Mail size={20} />
        </Link>
      </div>

      <div className='w-[100%] text-[12px] mt-5 flex justify-center sm:justify-end items-end select-none'>
        <p>{Config.copyright} | {new Date().getFullYear()}</p>
        <span className="ml-2 text-[10px]">
          {/*<Link href={Config.by.url}>{Config.by.text}</Link>*/}
        </span>
      </div>
    </footer>
  );
};