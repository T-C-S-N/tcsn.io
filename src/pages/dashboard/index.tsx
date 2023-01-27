import SEO from '@/components/layout/SEO'
import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardFooter from '@/components/layout/DashboardFooter'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import UserUtils from '@/utils/UserUtils';
import { signOut } from 'next-auth/react';

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
      <SEO title='tcsn | Dashboard' description='Tocausan dashboard' siteTitle='Tocausan' />

      <main className='flex flex-column flex-justify-start sm-flex-row sm-flex-justify-start padding-bottom-40'>
        <DashboardHeader />
        <section className='width-100 sm-width-80 xl-width-90 bg-white padding-horizontal-10'>
          <h1>Dashboard</h1>
        </section>
      </main>
      <DashboardFooter />
    </>
  )
}
