import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/pages/Home.module.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import WelcomeBox from '@/components/WelcomeBox'
import Header from '@/components/layout/Header'
import { Search } from 'react-feather'
import SEO from '@/components/layout/SEO'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <SEO title='tcsn | Home' description='Tocausan Homepage' siteTitle='Tocausan' />
      <main className={styles.main}>
        <div className='desktop-only'>
          <Header />
          {/* <NavBar /> */}
          <WelcomeBox />
          <Footer />
        </div>
        <div className='mobile-only'>
          <div className='logo-container'>
            <div className='logo'>
              <Logo active={true} />
            </div>
          </div>
          <div className='text'>
            <h1>Mobile version coming soon!</h1>
          </div>
        </div>
      </main>
    </>
  )
}
