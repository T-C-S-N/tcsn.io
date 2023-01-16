import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import WelcomeBox from '@/components/WelcomeBox'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <Head>
        <title>tcsn</title>
        <meta name="description" content="Tocausan website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
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
