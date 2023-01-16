import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/layout/Header'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'

const inter = Inter({ subsets: ['latin'] })

export default function Contact() {
  return (
    <>
      <Head>
        <title>tcsn</title>
        <meta name="description" content="Tocausan website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className='desktop-only'>
          <Header />
          {/* <NavBar /> */}
          <h1>Contact</h1>
          <Footer />
        </div>
        <div className='mobile-only'>
          <div className='logo-container'>
            <Logo />
          </div>
          <div className='text'>
            <h1>Mobile version coming soon!</h1>
          </div>
        </div>
      </main>
    </>
  )
}
