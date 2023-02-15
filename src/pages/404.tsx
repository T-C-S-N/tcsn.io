import styles from '@/styles/pages/404.module.css'
import Footer from '@/components/layout/Footer'
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link'
import SEO from '@/components/layout/SEO'
import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[780px] flex flex-col justify-center items-center'>
        <div className='w-[90%] flex flex-col justify-center items-center'>
          <h1 className='mb-5 text-xl font-semibold text-center'>Page not found</h1>

          <Link href='/' className='px-5 py-2 text-center rounded-md bg-gray-300 hover:bg-gray-400 transition'>
            <div className='text'>Back</div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
