import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import UserList from '@/components/UserList'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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
      <SEO title='tcsn | Dashboard | Users' description='Tocausan users dashboard' siteTitle='Tocausan' />

      <main className='flex flex-column flex-justify-start sm-flex-row sm-flex-justify-start'>
        <DashboardHeader />
        <section className='width-100 sm-width-80 xl-width-90'>
          <UserList />
        </section>
      </main>
      <Footer />
    </>
  )
}
