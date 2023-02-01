import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MessagePage() {
  // get request query
  const router = useRouter()
  const { type, token, email } = router.query


  // get token from url
  if (type === 'email-verify' && token) {
    // send token to backend
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, email })
    })
      .then(res => res.json())
  }

  return (
    <>
      <SEO title='tcsn | Message' description='Tocausan Message' siteTitle='Tocausan' />
      <Header />
      <main className='flex-justify-center flex-align-start sm-margin-top-100 margin-bottom-30'>

        {type !== 'email-verify' && type !== 'email-confirmation' && (
          <>
            <p className='container flex-center padding-10-20 margin-top-50 bg-info'>
              No message for you 🙂
            </p>
          </>
        )}

        {type === 'email-confirmation' && (
          <>
            <p className='container flex-center padding-10-20 margin-top-50 bg-info text-center'>
              A confirmation email has been sent, <br /><br />
              Please check your emails.
            </p>
          </>
        )}

        {type === 'email-verify' && (
          <>
            <div className='flex-center flex-column'>
              <p className='container flex-center padding-10-20 margin-top-50 bg-info text-center'>
                Your email has been verified. <br /><br />
                You can now sign in.
              </p>

              <Link href='/auth?type=signin' className='btn dark border small'>Sign In</Link>
            </div>
          </>
        )}

      </main>
      <Footer />
    </>
  )
}
