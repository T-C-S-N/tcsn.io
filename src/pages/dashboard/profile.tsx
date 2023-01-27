import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import UserProfile from '@/components/UserProfile'
import DashboardHeader from '@/components/layout/DashboardHeader'
import UserUtils from '@/utils/UserUtils'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    UserUtils.checkToken()
      .catch(() => {
        signOut()
        router.push('/signin')
      })
  }, [router.isReady, router.query])

  return (
    <>
      <SEO title='tcsn | Dashboard | Profile' description='Tocausan profile dashboard' siteTitle='Tocausan' />

      <main className='flex flex-column flex-justify-start sm-flex-row sm-flex-justify-start'>
        <DashboardHeader />
        <section className='width-100 sm-width-80 xl-width-90'>
          <UserProfile />
        </section>
      </main>
      <Footer />
    </>
  )
}
