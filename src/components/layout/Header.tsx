
import styles from "@/styles/components/Header.module.css";
import Logo from "../Logo";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
   const router = useRouter();

   const handleSignout = (e: any) => {
      e.preventDefault()
      signOut()
   }

   const { data: session } = useSession();

   return (
      <header className={styles.header}>
         <div className={styles.left}>
            <div className={styles.logo}>
               <Link href='/'>
                  <Logo active={router.pathname == "/"} />
               </Link>
            </div>
            <div className={[styles.header__link, router.pathname == "/contact" ? styles.header__link__active : "", 'mobile-hide btn btn-small border-radius-0'].join(' ')}>
               <Link href='/contact'>Contact</Link>
            </div>
            {session && <Link href="/dashboard" className={[styles.header__link, router.pathname == "/dashboard" ? styles.header__link__active : "", 'btn btn-small border-radius-0'].join(' ')}>Dashboard</Link>}

         </div>


         <div className={styles.right}>
            {session && <Link href="#" onClick={handleSignout} className='btn btn-border-danger btn-small margin-horizontal-5'>Signout</Link>}
            {!session && <Link href="/signin" className='btn btn-border-dark btn-small margin-horizontal-5'>Signin</Link>}
            {/*
            !session && <Link href="/signup" className='btn btn-dark btn-small margin-horizontal-5'>Signup</Link>
            */}
         </div>
      </header>
   )
}