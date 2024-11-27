import Layout from '@/components/layout/Layout'
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
    <Layout title='Message'>
      <section className='w-[100%] min-h-[780px] flex flex-col flex-wrap justify-center items-center'>

        {type !== 'email-verify' && type !== 'email-confirmation' && (
          <div className='w-[90%] flex flex-col justify-center items-center'>
            <p>No message for you 🙂</p>
            <Link href='/' className='px-5 py-2 mt-[25px] bg-gray-300 hover:bg-gray-400 transition rounded-md'>
              Back
            </Link>
          </div>
        )}

        {type === 'email-confirmation' && (
          <div className='w-[90%] flex flex-col justify-center items-center'>
            <p>A confirmation email has been sent.</p>
            <p>Please check your emails.</p>
            <Link href='/' className='px-5 py-2 mt-[25px] bg-gray-300 hover:bg-gray-400 transition rounded-md'>
              Back
            </Link>
          </div>
        )}

        {type === 'email-verify' && (
          <div className='w-[90%] flex flex-col justify-center items-center'>
            <p> Your email has been verified.</p>
            <p>You can now sign in.</p>

            <Link href='/auth?type=signin' className='px-5 py-2 mt-[25px] bg-gray-300 hover:bg-gray-400 transition rounded-md'>
              Sign In
            </Link>
          </div>
        )}
      </section>
    </Layout>
  )
}
