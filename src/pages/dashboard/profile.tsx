import SEO from '@/components/layout/SEO'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import UserProfile from '@/components/admin/users/UserProfile'
import DashboardHeader from '@/components/layout/DashboardHeader'
import UserUtils from '@/utils/UserUtils'
import { useRouter } from 'next/router'
import DashboardFooter from '@/components/layout/DashboardFooter'

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    UserUtils.checkToken()
      .catch(() => {
        signOut()
        router.push('/auth?type=signin')
      })
  }, [router.isReady, router.query])

  return (
    <>
      <SEO title='tcsn | Dashboard | Profile' description='Tocausan profile dashboard' siteTitle='Tocausan' />

      <main className='flex-column flex-justify-start sm-flex-row sm-flex-justify-start padding-bottom-40'>
        <DashboardHeader />
        <section className='width-100 sm-width-80 xl-width-90 bg-white padding-horizontal-10'>
          <UserProfile />
        </section>
      </main>
      <DashboardFooter />
    </>
  )
}
