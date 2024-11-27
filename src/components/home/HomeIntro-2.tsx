import { useState, useEffect } from 'react'
import Link from "next/link";

export default function HomeIntro () {
  const [ title, setTitle ] = useState( '' )
  const [ description, setDescription ] = useState( '' )


  const content = {
    title: 'About Me',
    description: 'Dear visitor, welcome to my portfolio. I am a full-stack developer with a passion for creating beautiful and functional websites. I am always looking for new challenges and opportunities to learn and grow. Feel free to contact me if you have any questions or would like to work together.'
  }

  useEffect( () => {
    let index = 0
    let triggered = false

    const interval = setInterval( () => {
      if( triggered ) {
        // set title letter by letter
        setTitle( content.title.slice( 0, index ) )
        setDescription( content.description.slice( 0, index ) )
        index++
      }
    }, 10 );

    if( title === content.title && description === content.description ) {
      clearInterval( interval )
    }



    // get vertical position of "home-intro"
    const homeIntro = document.querySelector( '.home-intro' )
    const homeIntroTitle = document.querySelector( '.home-intro-title' )
    const homeIntroDescription = document.querySelector( '.home-intro-description' )

    window.addEventListener( 'scroll', () => {
      // display text as user scrolls 2/3
      triggered = homeIntroTitle?.getBoundingClientRect().top < window.innerHeight * 9/10

      if( parseInt( homeIntroTitle?.getBoundingClientRect().top ) < window.innerHeight ) {
        //setTitle( content.title.slice( 0, ( window.innerHeight - parseInt( title?.getBoundingClientRect().top ) ) / 10 ) )
      }

      if( parseInt( homeIntroDescription?.getBoundingClientRect().top ) < window.innerHeight ) {
        //setDescription( content.description.slice( 0, ( window.innerHeight - parseInt( description?.getBoundingClientRect().top ) )/1.1  ) )
      }
    } )
  }, [] )



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
