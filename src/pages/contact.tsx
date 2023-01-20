import { Inter } from '@next/font/google'
import styles from '@/styles/pages/Contact.module.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/Logo'
import BoxSection from '@/components/BoxSection'
import config from '@/lib/config'
import SEO from '@/components/layout/SEO'
import { FaRegHandPointRight, FaRegHandPointLeft } from 'react-icons/fa'
import Link from 'next/link'
import MobileMessage from '@/components/MobileOnlyMessage'

const inter = Inter({ subsets: ['latin'] })

export default function Contact() {
  return (
    <>
      <SEO title='tcsn | Contact' description='Tocausan Contact Page' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='desktop-up'>
          <BoxSection>
            <p className={styles.text}>For any inquiries, please drop a message at</p>
            <p className={styles.email}>
              <FaRegHandPointRight color='white' size='18px' className={styles.pointing_icons} />
              <Link href={'mailto: ' + config.email}>
                <b>{config.email}</b>
              </Link>
              <FaRegHandPointLeft color='white' size='18px' className={styles.pointing_icons} />
            </p>
          </BoxSection>
        </div>
        <MobileMessage text='Mobile version coming soon!' />
      </main>
      <Footer />
    </>
  )
}
