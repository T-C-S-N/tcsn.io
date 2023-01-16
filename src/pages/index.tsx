import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import { useState, useEffect, useRef } from "react";
import WelcomeBox from '@/components/WelcomeBox'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [intro, setIntro] = useState("");

  const text = "Hii,\nWelcome !";
  const index = useRef(0);

  useEffect(() => {
    function tick() {
      setIntro((prev) => prev + text[index.current]);
      index.current++;
    }
    if (index.current < text.length - 1) {
      let addChar = setInterval(tick, 50);
      return () => clearInterval(addChar);
    }
  }, [intro]);

  function newLineText(t: string) {
    const nt = t.split("\n").map((str) => <p key={str}>{str}</p>);
    return nt;
  }

  return (
    <>
      <Head>
        <title>tcsn</title>
        <meta name="description" content="Tocausan website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles['desktop-only']}>
          <Header />
          {/* <NavBar /> */}
          <WelcomeBox />
          <Footer />
        </div>
        <div className={styles['mobile-only']}>
          <div className={styles['logo-container']}>
            <div className={styles.logo}>
              <Logo />
            </div>
          </div>
          <div className={styles.text}>
            <h1>Mobile version coming soon!</h1>
          </div>
        </div>
      </main>
    </>
  )
}
