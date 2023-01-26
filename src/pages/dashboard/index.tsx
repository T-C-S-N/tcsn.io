import styles from '@/styles/pages/Dashboard.module.css'
import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import DashboardHeader from '@/components/layout/DashboardHeader'

export default function Dashboard() {

  return (
    <>
      <SEO title='tcsn | Dashboard' description='Tocausan dashboard' siteTitle='Tocausan' />

      <main className='flex flex-column flex-justify-start sm-flex-row sm-flex-justify-start'>
        <DashboardHeader />
        <section className='width-100 sm-width-80 xl-width-90'>
          <h1>Dashboard</h1>
        </section>
      </main>
      <Footer />
    </>
  )
}
