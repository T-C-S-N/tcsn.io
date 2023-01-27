import styles from '@/styles/pages/Home.module.css'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'

export default function Dashboard() {

  return (
    <>
      <SEO title='tcsn | Email confirmation' description='Tocausan Email confirmation' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <p className='container flex-center padding-10-20 margin-top-50 bg-info'>
          A confirmation email has been sent, <br /><br />
          Please check your emails.
        </p>
      </main>
      <Footer />
    </>
  )
}
