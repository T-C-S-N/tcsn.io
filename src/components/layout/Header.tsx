
import styles from "@/styles/components/Header.module.css";
import Logo from "../Logo";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useState } from "react";

export default function Header() {
   const router = useRouter();
   const { data: session } = useSession();

   const [isOpen, setIsOpen] = useState(false);

   const handleSignout = (e: any) => {
      e.preventDefault()
      signOut()
   }

   return (
      <>
         <header className="width-100 padding-15-30 flex-column sm-none">
            <div className="width-100 padding-horizontal-10 flex-row flex-align-center flex-justify-space-between">
               <div className='width-80 max-width-80 margin-bottom-10'>
                  <Link href='/'>
                     <Logo active={true} />
                  </Link>
               </div>

               <Link href='#' onClick={() => setIsOpen(!isOpen)}>
                  <div className={["burger-menu margin-bottom-15", isOpen ? 'active' : ''].join(' ')}>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                  </div>
               </Link>
            </div>

            {isOpen && (
               <div className="width-100 flex-column">
                  <div className={[router.pathname == "/contact" ? 'bg-white' : "", 'font-size-subtitle padding-10-5'].join(' ')}>
                     <Link href='/contact'>Contact</Link>
                  </div>
                  {session &&
                     <Link href="/dashboard" className={[router.pathname == "/dashboard" ? 'bg-white' : "", 'font-size-subtitle padding-10-5'].join(' ')}>Dashboard</Link>
                  }

                  <div className="margin-top-20">
                     {session &&
                        <Link href="#" onClick={handleSignout} className='width-50 btn border danger small margin-horizontal-5'>Signout</Link>
                     }
                     {!session &&
                        <Link href="/signin" className='width-50 btn border dark small margin-horizontal-5'>Signin</Link>
                     }
                     {/*
            !session && <Link href="/signup" className='btn dark small margin-horizontal-5'>Signup</Link>
            */}
                  </div>
               </div>
            )}
         </header>

         <header className={[styles.header, 'none sm-flex'].join(' ')}>
            <div className={styles.left}>
               <div className={styles.logo}>
                  <Link href='/'>
                     <Logo active={router.pathname == "/"} />
                  </Link>
               </div>
               <div className={[styles.header__link, router.pathname == "/contact" ? styles.header__link__active : "", 'mobile-hide btn small border-radius-0'].join(' ')}>
                  <Link href='/contact'>Contact</Link>
               </div>
               {session && <Link href="/dashboard" className={[styles.header__link, router.pathname == "/dashboard" ? styles.header__link__active : "", 'btn small border-radius-0'].join(' ')}>Dashboard</Link>}

            </div>


            <div className={styles.right}>
               {session && <Link href="#" onClick={handleSignout} className='btn border danger small margin-horizontal-5'>Signout</Link>}
               {!session && <Link href="/signin" className='btn border dark small margin-horizontal-5'>Signin</Link>}
               {/*
            !session && <Link href="/signup" className='btn dark small margin-horizontal-5'>Signup</Link>
            */}
            </div>
         </header>
      </>


   )
}