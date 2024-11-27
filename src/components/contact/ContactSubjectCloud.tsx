import { useState, useEffect, use, useMemo } from 'react'

export default function ContactSubjectCloud ( props: { subjectName: string, handleSubjectChange: ( subject: any ) => void } ) {
  const [ subjectName, setSubjectName ] = useState( 'general' )

  const subjects = [
    {
      name: 'general',
      title: 'I have a general question',
      message: 'I have a general question: \n',
    },
    {
      name: 'hiring',
      title: 'I\'m hiring',
      message: 'I\'m hiring: \n',
    },
    {
      name: 'idea',
      title: 'I\'ve got an idea for an app',
      message: 'I\'ve got an idea for an app: \n',
    },
    {
      name: 'help',
      title: 'I need a tech assistance',
      message: 'I need a tech assistance: \n',
    },
    {
      name: 'hi',
      title: 'I just want to say hi',
      message: 'I want to say "Hi" 🙂',
    },
  ]

  return (
    <>
      <div className="w-[90%] max-w-[720px] text-neutral-900 rounded-md bg-white bg-opacity-90 p-1">
        <h1 className="select-none w-[100%] text-xl font-bold text-left">
          A particular subject in mind?
        </h1>

        <div className="flex justify-start flex-wrap">
          {
            subjects.map( ( subject, index ) => (
              <div key={ index } className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-1 m-1 text-nowrap text-neutral-900 border rounded-md transition ${subjectName === subject.name ? 'active border-[transparent] bg-[#96D6F7] hover:bg-[#00afea]' : 'border-[#60C6F2] hover:border-[transparent] hover:bg-[#00afea]'}` }
                  onClick={ () => {
                    setSubjectName( subject.name )
                    props.handleSubjectChange( subject )
                  } }
                >
                  { subject.title }
                </button>
              </div>
            ) )
          }
        </div>
      </div>
    </>
  )
}
