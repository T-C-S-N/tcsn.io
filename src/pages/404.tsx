import styles from '@/styles/pages/404.module.css'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link'
import SEO from '@/components/layout/SEO'
import Header from '@/components/layout/Header'
import MobileMessage from '@/components/MobileOnlyMessage';

export default function Page() {
  return (
    <>
      <SEO title='tcsn | 404' description='Tocausan 404' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='desktop-up'>
          <div className={styles.container}>
            <h1>Page not found.</h1>
            <Link href='/' className={styles.go_back}>
              <div className={styles.icon}>
                <FaArrowLeft size={18} />
              </div>
              <div className='text'>Go back to home</div>
            </Link>
          </div>
        </div>
        <MobileMessage text='Mobile version coming soon!' />
      </main>
      <Footer />
    </>
  )
}
