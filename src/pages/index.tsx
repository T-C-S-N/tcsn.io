import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/pages/Home.module.css'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import WelcomeBox from '@/components/WelcomeBox'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import MobileMessage from '@/components/MobileOnlyMessage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <SEO title='tcsn | Home' description='Tocausan Homepage' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='desktop-up'>
          <WelcomeBox />
        </div>
        <MobileMessage text='Mobile version coming soon!' />
      </main>
      <Footer />
    </>
  )
}
