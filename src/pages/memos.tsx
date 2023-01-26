import styles from '@/styles/pages/Memos.module.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import TutoNextReact from './memos/tuto-next-react'
import MobileMessage from '@/components/MobileOnlyMessage'

export default function ContactPage() {
  return (
    <>
      <SEO title='tcsn | Memos' description='Tocausan Memos' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='sm-up'>
          <h1>Memos</h1>
          <TutoNextReact />
        </div>
        <MobileMessage text='Mobile version coming soon!' />
      </main>
      <Footer />
    </>
  )
}
