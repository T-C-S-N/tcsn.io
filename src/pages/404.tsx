import Link from 'next/link'
import Layout from '@/components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout title='tcsn | 404' >
      <div className='w-[100%] min-h-[780px] flex flex-col justify-center items-center'>
        <div className='flex flex-col text-neutral-900 rounded-md justify-center items-center px-5 py-3'>
          <h1 className='mb-5 text-2xl font-semibold text-center'>Page Not Found</h1>

          <Link href='/' className='px-5 py-2 text-center bg-sky-200 rounded-md bg-gray-300 hover:bg-sky-300 transition'>
            <div className='text'>Back</div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
