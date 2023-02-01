import styles from '@/styles/pages/Contact.module.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function EmailVerifyPage() {

  // get token from url
  const router = useRouter()
  if (router.query.token) {
    // send token to backend
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: router.query.token, email: router.query.email })
    })
      .then(res => res.json())
  }

  return (
    <>
      <SEO title='tcsn | Email Verification' description='Tocausan Contact Page' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='container flex-center'>
          <div className='container'>
            <p>Your email has been verified.</p>
          </div>
          <div className='container'>
            <Link href='/auth?type=signin' className='btn dark'>Sign In</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
