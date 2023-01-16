import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/404.module.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link'

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
        <div className={styles.App}>
          <div className={styles['not-found']}>
            <div className={styles.container}>
              <h1>Page not found.</h1>
              <Link href='/' className={styles['go-back']}>
                <div className={styles.icon}>
                  <FaArrowLeft size={18} />
                </div>
                <div className='text'>Go back to home</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
