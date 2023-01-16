import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/pages/404.module.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link'
import SEO from '@/components/layout/SEO'

const inter = Inter({ subsets: ['latin'] })

export default function Contact() {
  return (
    <>
      <SEO title='tcsn | 404' description='Tocausan 404' siteTitle='Tocausan' />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Page not found.</h1>
          <Link href='/' className={styles.go_back}>
            <div className={styles.icon}>
              <FaArrowLeft size={18} />
            </div>
            <div className='text'>Go back to home</div>
          </Link>
        </div>
      </main>
    </>
  )
}
