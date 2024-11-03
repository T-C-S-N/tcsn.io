import Config from '@/utils/Config'
import Layout from '@/components/layout/Layout'
import { useState, useEffect, use } from 'react'

export default function ContactPage () {
  const [ subject, setSubject ] = useState( "" );

  const [ firstname, setFirstname ] = useState( "" );
  const [ firstnameInitiated, setFirstnameInitiated ] = useState( false );
  const [ lastname, setLastname ] = useState( "" );
  const [ lastnameInitiated, setLastnameInitiated ] = useState( false );
  const [ company, setCompany ] = useState( "" );
  const [ companyInitiated, setCompanyInitiated ] = useState( false );
  const [ email, setEmail ] = useState( "" );
  const [ emailInitiated, setEmailInitiated ] = useState( false );
  const [ phone, setPhone ] = useState( "" );
  const [ phoneInitiated, setPhoneInitiated ] = useState( false );
  const [ message, setMessage ] = useState( "" );
  const [ messageInitiated, setMessageInitiated ] = useState( false );

  useEffect( () => {
    switch( subject ) {
      case "general":
        setMessage( "I have a general question: \n" );
        break;
      case "app-idea":
        setMessage( "I have an idea for an app: \n" );
        break;
      case "app-help":
        setMessage( "I need help with my app: \n" );
        break;
      case "hi":
        setMessage( "I want to say \"Hi\" 🙂" );
        break;
      case "tech":
        setMessage( "What technologies are you familiar with ?" );
        break;
      default:
        setMessage( "" );
    }

  }, [ subject ] );

  useEffect( () => {
    if( firstname ) {
      setFirstnameInitiated( true );
    }

    if( lastname.length > 0 ) {
      setLastnameInitiated( true );
    }

    if( company.length > 0 ) {
      setCompanyInitiated( true );
    }

    if( email.length > 0 ) {
      setEmailInitiated( true );
    }

    if( phone.length > 0 ) {
      setPhoneInitiated( true );
    }

    if( message.length > 0 ) {
      setMessageInitiated( true );
    }
  }, [ firstname, lastname, company, email, phone, message ] );

  // email validation
  const validateEmail = ( email: string ) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test( email );
  }

  const formValidation = () => {
    switch( true ) {
      case firstname.length <= 0:
        return false
      case lastname.length <= 0:
        return false
      case email.length <= 0:
        return false
      case !validateEmail( email ):
        return false
      case message.length <= 0:
        return false
      case message.length < 15:
        return false
      default:
        return true
    }
  }

  const send = () => {
    if( formValidation() ) {
      const suject = 'Contact request from tcsn.io'
      const body = `
Dear Tomas, %0A%0A%0A

My name is ${firstname} ${lastname} from ${company}. %0A%0A%0A

I would like to discuss the following: %0A%0A
${message} %0A%0A%0A

You can reach me by: %0A%0A
  - Email: ${email} %0A%0A 
  ${phone ? '- Phone: ${phone} %0A%0A' : ''}
%0A%0A
Best regards, %0A%0A
${firstname} ${lastname}
    `

      window.open( `mailto: ${Config.email}?subject=${suject}&body=${body}`, '_self' );
    }
  }

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[100vh] flex justify-start align-start items-center bg-gradient-to-b from-[#F5F5F5] to-[#E5F7FF]'>
        <div className="w-[100%] mt-[-100px] flex flex-col justify-start align-start items-center text-neutral-900">

          { !subject && <div className="w-[90%] max-w-[720px] bg-neutral-100 text-neutral-900 p-5 shadow-lg rounded-md mb-5">
            <h1 className="w-[100%] mb-5 text-3xl font-bold text-left">
              What would you like to talk about?
            </h1>

            <div className="flex justify-center flex-wrap">
              <div className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-2 m-1 bg-sky-200 text-nowrap text-neutral-900 rounded-md transition hover:bg-sky-300 ${subject === "general" ? 'bg-sky-400 hover:bg-sky-500' : 'hover:bg-sky-300'}` }
                  onClick={ () => setSubject( "general" ) }>
                  I have a general question
                </button>
              </div>

              <div className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-2 m-1 bg-sky-200 text-nowrap text-neutral-900 rounded-md transition ${subject === "app-idea" ? 'bg-sky-400 hover:bg-sky-500' : 'hover:bg-sky-300'}` }
                  onClick={ () => setSubject( "app-idea" ) }>
                  I have an idea for an app
                </button>
              </div>

              <div className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-2 m-1 bg-sky-200 text-nowrap text-neutral-900 rounded-md transition hover:bg-sky-300 ${subject === "app-help" ? 'bg-sky-400 hover:bg-sky-500' : 'hover:bg-sky-300'}` }
                  onClick={ () => setSubject( "app-help" ) }>
                  I need help with my app
                </button>
              </div>

              <div className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-2 m-1 bg-sky-200 text-nowrap text-neutral-900 rounded-md transition hover:bg-sky-300 ${subject === "tech" ? 'bg-sky-400 hover:bg-sky-500' : 'hover:bg-sky-300'}` }
                  onClick={ () => setSubject( "tech" ) }>
                  What technologies are you familiar with ?
                </button>
              </div>

              <div className="min-w-[100%] sm:min-w-0">
                <button
                  className={ `min-w-[100%] sm:min-w-0 px-3 py-2 m-1 bg-sky-200 text-nowrap text-neutral-900 rounded-md transition hover:bg-sky-300 ${subject === "hi" ? 'bg-sky-400 hover:bg-sky-500' : 'hover:bg-sky-300'}` }
                  onClick={ () => setSubject( "hi" ) }>
                  I want to say hi
                </button>
              </div>
            </div>
          </div> }

          { subject && <div className='w-[90%] max-w-[820px] flex flex-col justify-center items-center bg-neutral-100 text-neutral-900 p-5 shadow-lg rounded-md'>

            <div className="w-[100%] mb-5 flex justify-start">
              <button
                className='px-3 py-2 bg-sky-100 text-neutral-900 text-sm rounded-md transition hover:bg-sky-200'
                onClick={ () => setSubject( "" ) }
              >
                &#8592; Change Subject
              </button>
            </div>

            <div className="w-[100%] mb-5">
              <h1 className="w-[100%] text-3xl font-bold text-left">Contact Form</h1>
              <p className="w-[100%] text-left">Fill out the form & let&apos;s get in touch</p>
            </div>

            <div className='w-[100%] flex flex-col sm:flex-column justify-between items-center'>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='firstname'
                  className='w-[100%] p-2 m-1 text-sm'
                >
                  First Name
                  <span className='pl-1 text-red-500'>*</span>
                </label>

                <input
                  type='text'
                  id='firstname'
                  placeholder='John'
                  className='w-[100%] p-2 m-1 bg-neutral-200'
                  value={ firstname }
                  onChange={ ( e ) => setFirstname( e.target.value ) }
                />

                { firstnameInitiated && firstname.length <= 0 &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Firstname is required</p>
                  </div> }
              </div>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='lastname'
                  className='w-[100%] p-2 m-1 text-sm'
                >
                  Last Name
                  <span className='pl-1 text-red-500'>*</span>
                </label>

                <input
                  id='lastname'
                  type='text'
                  placeholder='Doe'
                  className='w-[100%] p-2 m-1 bg-neutral-200'
                  value={ lastname }
                  onChange={ ( e ) => setLastname( e.target.value ) }
                />

                { lastnameInitiated && lastname.length <= 0 &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Lastname is required</p>
                  </div> }
              </div>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='company'
                  className='w-[100%] p-2 m-1 text-sm text-neutral-900'
                >
                  Company
                </label>

                <input
                  id='company'
                  type='text'
                  placeholder='Acme'
                  className='w-[100%] p-2 m-1 bg-neutral-200 text-neutral-900'
                  value={ company }
                  onChange={ ( e ) => setCompany( e.target.value ) }
                />

              </div>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='email'
                  className='w-[100%] p-2 m-1 text-sm text-neutral-900'
                >
                  Email
                  <span className='pl-1 text-red-500'>*</span>
                </label>

                <input
                  id='email'
                  type='text'
                  placeholder='john&doe.com'
                  className='w-[100%] p-2 m-1 bg-neutral-200 text-neutral-900'
                  value={ email }
                  onChange={ ( e ) => setEmail( e.target.value ) }
                />

                { emailInitiated && email.length <= 0 &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Email is required</p>
                  </div> }

                { email.length > 0 && !validateEmail( email ) &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Please enter a valid email</p>
                  </div> }
              </div>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='phone'
                  className='w-[100%] p-2 m-1 text-sm text-neutral-900'
                >
                  Phone
                </label>

                <input
                  id='phone'
                  type='text'
                  placeholder='+1 555 555 5555'
                  className='w-[100%] p-2 m-1 bg-neutral-200 text-neutral-900'
                  value={ phone }
                  onChange={ ( e ) => setPhone( e.target.value ) }
                />
              </div>

              <div className="w-[100%] mb-2">
                <label
                  htmlFor='message'
                  className='w-[100%] p-2 m-1 text-sm text-neutral-900'
                >
                  Message
                  <span className='pl-1 text-red-500'>*</span>
                </label>

                <textarea
                  id='message'
                  placeholder='Your message here'
                  className='w-[100%] p-2 m-1 bg-neutral-200 text-neutral-900'
                  rows={ 5 }
                  value={ message }
                  onChange={ ( e ) => setMessage( e.target.value ) }
                />

                { messageInitiated && message.length <= 0 &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Message is required</p>
                  </div> }

                { messageInitiated && message.length > 0 && message.length < 15 &&
                  <div className="pl-5 text-xs text-red-500">
                    <p>Message is too short</p>
                  </div> }
              </div>

              <div className="w-[100%] mt-10">
                <button
                  className={ `w-[100%] p-2 m-1 bg-sky-600 text-neutral-100 rounded-md transition ${!formValidation() ? 'opacity-30 cursor-auto' : 'hover:bg-sky-700'}` }
                  onClick={ send }
                >
                  Send Message
                </button>
              </div>
            </div>
          </div> }
        </div>
      </div>
    </Layout >
  )
}
