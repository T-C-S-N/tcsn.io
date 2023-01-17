import { Inter } from '@next/font/google'
import styles from '@/styles/pages/404.module.css'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link'
import SEO from '@/components/layout/SEO'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export default function Contact() {
  return (
    <>
      <SEO title='tcsn | 404' description='Tocausan 404' siteTitle='Tocausan' />
      <main className={styles.main}>
        <div className='desktop-only'>
          <Header />
          <div className={styles.container}>
            <h1>Page not found.</h1>
            <Link href='/' className={styles.go_back}>
              <div className={styles.icon}>
                <FaArrowLeft size={18} />
              </div>
              <div className='text'>Go back to home</div>
            </Link>
          </div>
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
