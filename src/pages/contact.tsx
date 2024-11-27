import Config from '@/utils/Config'
import Layout from '@/components/layout/Layout'
import Contact from '../components/contact/Contact'

export default function ContactPage () {
  return (
    <>
      <Layout title='tcsn | Contact' >
        <Contact />
        <iframe src={ '/generative/connection-full.html' } scrolling="no"  className='w-[100vw] h-[calc(100vh+60px)] overflow-hidden fixed top-0 z-0'></iframe>
      </Layout >
    </>
  )
}
