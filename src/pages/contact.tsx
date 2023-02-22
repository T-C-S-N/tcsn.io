import { FaRegHandPointRight, FaRegHandPointLeft } from 'react-icons/fa'
import Link from 'next/link'
import Config from '@/utils/Config'
import Layout from '@/components/layout/Layout'

export default function ContactPage() {
  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[850px] flex justify-center items-center'>
        <div className="w-[100%] mt-[-100px] flex flex-col justify-center text-neutral-900">
          <p className='w-[100%] flex justify-center'>For any inquiries, please drop a message at</p>

          <p className='w-[100%] mt-5 flex justify-center'>
            <FaRegHandPointRight size='18px' className='pointing_icons mt-1 mr-5' />
            <Link href={'mailto: ' + Config.email}>
              <b>{Config.email}</b>
            </Link>
            <FaRegHandPointLeft size='18px' className='pointing_icons mt-1 ml-3' />
          </p>
        </div>
      </div>
    </Layout>
  )
}
