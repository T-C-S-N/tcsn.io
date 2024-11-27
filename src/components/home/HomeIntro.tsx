import { useState, useEffect } from 'react'
import Link from "next/link";

export default function HomeIntro () {
  const [ title, setTitle ] = useState( '' )
  const [ description, setDescription ] = useState( '' )


  const content = {
    title: '',
    description: `
    Position: Full Stack Developer
    Location: Remote
    Availability: Open
    `

  }

  return (
    <>
      <div className='home-intro w-[100%] min-h-[20vh] py-[30px] flex flex-col justify-center align-center items-center bg-[#E5F7FF] bg-gradient-to-b from-[#E5F7FF] to-[#D5EFFC]'>
        <div className="w-[80%] max-w-[900px] p-5 flex flex-col sm:flex-row justify-between rounded-lg">

          <div className="text">
            <h1 className="home-intro-title text-4xl font-bold text-neutral-900">
              { title }
            </h1>
            <p className="home-intro-description text-2xl text-neutral-900 mt-5">
              { description }
            </p>
          </div>

          <div className="w-[100%] text-neutral-900 flex justify-center">
            <Link href="/contact" className='w-[100%]'>
              <button className="primary w-[100%]">
                Contact
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
