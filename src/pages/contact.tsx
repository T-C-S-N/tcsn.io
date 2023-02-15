import styles from '@/styles/pages/Contact.module.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BoxSection from '@/components/BoxSection'
import SEO from '@/components/layout/SEO'
import { FaRegHandPointRight, FaRegHandPointLeft } from 'react-icons/fa'
import Link from 'next/link'
import Config from '@/lib/config'
import Layout from '@/components/layout/Layout'

export default function ContactPage() {
  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[780px] flex justify-center items-center'>
        <div className='container margin-top-50 width-100 flex-center'>
          <BoxSection>
            <p className={styles.text}>For any inquiries, please drop a message at</p>
            <p className={styles.email}>
              <FaRegHandPointRight color='white' size='18px' className={styles.pointing_icons} />
              <Link href={'mailto: ' + Config.email}>
                <b>{Config.email}</b>
              </Link>
              <FaRegHandPointLeft color='white' size='18px' className={styles.pointing_icons} />
            </p>
          </BoxSection>
        </div>
      </div>
    </Layout>
  )
}
