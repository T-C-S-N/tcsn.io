/** @format */

import WelcomeBox from "@/components/WelcomeBox";
import { useEffect } from "react";
import ImagesUtils from "@/utils/ImagesUtils";
import Layout from "@/components/layout/Layout";
import HomeIntro from "@/components/home/HomeIntro";
import { HiPlus } from "react-icons/hi2";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Link from "next/link";
import Config from '@/utils/Config'

/*
  Sections:
    - Intro
    - Services
      - Web Development
      - Design system
      - Web Design
    - Projects
    - Call to action -> contact
*/

export default function HomePage () {

  useEffect( () => {
    ImagesUtils.getImages()



    window.addEventListener( 'scroll', () => {
      // get welcome-box
      const section1 = document.querySelector( '.section-1' )
      const welcomeBox = document.querySelector( '.welcome-box' )
      // scale welcome-box
      if( welcomeBox ) {
        const scroll = window.scrollY
        const scale = 1 + scroll / 30;
        (welcomeBox as HTMLElement).style.transform = `scale(${scale}) translateY(${scroll / 2}px) translateX(${scroll / 10}px)`;
        // filter blur
        (welcomeBox as HTMLElement).style.filter = `blur(${scroll / 5}px)`
      }
    } )
  }, [] )

  return (
    <Layout title='tcsn | Home' >
      {/*<div className='w-[100%] min-h-[100vh] flex flex-col justify-center items-center bg-[#F5F5F5]'>
        <div className="w-[100%] mt-[-100px]">
          <WelcomeBox />
        </div>

      </div>*/}

      {/*
       <div className='w-[100%] p-[30px] flex flex-col justify-center items-center bg-neutral-900'>
        <div className="w-[90%] flex flex-row ">
          <Clients />
        </div>
      </div>
      */}

      {/*<HomeIntro/>*/ }

      <div className='section-1 w-[100%] min-h-[100vh] flex flex-col justify-center items-center bg-gradient-to-b from-[#F5F5F5] to-[#E5F7FF] fixed top-0'>
        <div className="w-[100%] h-[100vh] mt-[0px] p-[20px] text-[black] flex flex-col justify-between items-stretch">

          <div className="flex flex-col">
            <div className="w-[100%] flex flex-row justify-between items-end">
              <div className="">
                <HiPlus size={ 35 } />
              </div>
              <div className="">
                <HiPlus size={ 35 } />
              </div>
            </div>

            <div className="group w-[100%] flex flex-row mt-5 sm:mt-0 justify-center sm:justify-between items-start px-[50px]">
              <div className="text-sm">
                NAME: <span className='group-hover:bg-[transparent] transition'>TOMAS</span> <br />
                POSITION: <span className='group-hover:bg-[transparent] transition'>FULL-STACK DEVELOPER</span> <br />
                LOCATION: <span className='group-hover:bg-[transparent] transition'>BRUSSELS</span> <br />
                REMOTE: <span className='group-hover:bg-[transparent] transition'>TRUE</span> <br />
                OPEN FOR BUSINESS: <span className='group-hover:bg-[transparent] transition'>TRUE</span>
              </div>
            </div>
          </div>


          <div className="welcome-box w-[100%] flex flex-row justify-center p-10">
            <WelcomeBox />
          </div>

          <div className="flex flex-col">
            <div className="w-[100%] flex flex-row justify-between items-end px-[50px]">
              <div className="text-sm">
                <Link
                  href={ Config.social.linkedin.url }
                  title='tocausan@Linkedin'
                  target='_blank'
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row justify-between items-center transition"
                >
                  <div className="group-hover:text-[#0098D7]">LINKEDIN</div>
                  <MdKeyboardArrowLeft size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                </Link>
                <Link
                  href={ Config.social.github.url }
                  title='tocausan@Github'
                  target='_blank'
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row justify-between items-center transition"
                >
                  <div className="group-hover:text-[#0098D7]">GITHUB</div>
                  <MdKeyboardArrowLeft size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                </Link>
                <Link
                  href={ Config.social.codepen.url }
                  title='tcsn@Codepen'
                  target='_blank'
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row justify-between items-center transition"
                >
                  <div className="group-hover:text-[#0098D7]">CODEPEN</div>
                  <MdKeyboardArrowLeft size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                </Link>
                <Link
                  href={ Config.social.pinterest.url }
                  title='tocausan@Pinterest'
                  target='_blank'
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row justify-between items-center transition"
                >
                  <div className="group-hover:text-[#0098D7]">PINTEREST</div>
                  <MdKeyboardArrowLeft size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                </Link>
                <Link
                  href={ Config.social.behance.url }
                  title='tocausan@Behance'
                  target='_blank'
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row justify-between items-center transition"
                >
                  <div className="group-hover:text-[#0098D7]">BEHANCE</div>
                  <MdKeyboardArrowLeft size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                </Link>
              </div>

              <div className="text-sm text-right">
                <Link
                  href="/contact"
                  rel='noreferrer'
                  className="group hover:text-cyan-600 flex flex-row items-center transition"
                >
                  <MdKeyboardArrowRight size={ 20 } className='text-[transparent] group-hover:text-[#0098D7]' />
                  <div className="group-hover:text-[#0098D7]">CONTACT</div>
                </Link>
              </div>
            </div>
            <div className="w-[100%] flex flex-row justify-between items-end">
              <div className="">
                <HiPlus size={ 35 } />
              </div>
              <div className="">
                <HiPlus size={ 35 } />
              </div>
            </div>
          </div>

        </div>
      </div>

    </Layout>
  );
}
