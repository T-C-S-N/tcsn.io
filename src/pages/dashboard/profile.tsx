import styles from '@/styles/pages/Dashboard.module.css'
import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import UserProfile from '@/components/UserProfile'
import DashboardHeader from '@/components/layout/DashboardHeader'

export default function Dashboard() {

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
