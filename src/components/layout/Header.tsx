
import styles from "@/styles/components/Header.module.css";
import Logo from "../Logo";

export default function Header() {
   return (
      <header className={styles.header} >
         <div className={styles.logo}>
            <Logo />
         </div>
      </header>
   )
}