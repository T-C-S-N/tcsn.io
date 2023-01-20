
import styles from "@/styles/components/Header.module.css";
import Logo from "../Logo";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Header() {
   const router = useRouter();

   return (
      <header className={styles.header} >
         <div className={styles.logo}>
            <Link href='/'>
               <Logo active={router.pathname == "/"} />
            </Link>
         </div>
         <div className={[styles.header__link, router.pathname == "/contact" ? styles.header__link__active : "", 'mobile-hide'].join(' ')}>
            <Link href='/contact'>Contact</Link>
         </div>
      </header>
   )
}