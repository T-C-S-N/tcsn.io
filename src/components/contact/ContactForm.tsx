import Config from '@/utils/Config'
import { useState, useEffect, use } from 'react'
import ContactSubjectCloud from './ContactSubjectCloud'

export default function ContactForm () {
  const [ subjectName, setSubjectName ] = useState( "" );
  const [ subject, setSubject ] = useState( { name: "general", title: "Message", message: "Message:" } );

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

  function handleSubjectChange ( s: any ) {
    setSubject( s );
    setSubjectName( s.name );
    // setMessage( s.message );
  }

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

${subject.message} %0A%0A
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
    <>
      <div className='w-[90%] max-w-[820px] flex flex-col justify-center items-center bg-white bg-opacity-80 text-neutral-900 p-5 shadow-lg rounded-md'>
        <div className="w-[100%] p-3">
          <h1 className="w-[100%] text-xl font-bold text-left">Let&#39;s connect!</h1>
          <p className="w-[100%] text-sm text-left">Fill out the form & let&apos;s get in touch</p>
        </div>

        <div className='w-[100%] flex flex-col sm:flex-column justify-between'>

          <div className="flex flex-col sm:flex-row justify-between">
            <div className="w-[100%] sm:w-[50%] p-2">
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
                className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
                value={ firstname }
                onChange={ ( e ) => setFirstname( e.target.value ) }
              />

              { firstnameInitiated && firstname.length <= 0 &&
                <div className="pl-5 text-xs text-red-500">
                  <p>Firstname is required</p>
                </div> }
            </div>

            <div className="w-[100%] sm:w-[50%] p-2">
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
                className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
                value={ lastname }
                onChange={ ( e ) => setLastname( e.target.value ) }
              />

              { lastnameInitiated && lastname.length <= 0 &&
                <div className="pl-5 text-xs text-red-500">
                  <p>Lastname is required</p>
                </div> }
            </div>

          </div>


          <div className="w-[100%] sm:w-[50%] p-2">
            <label
              htmlFor='company'
              className='w-[100%] p-2 m-1 text-sm text-neutral-900'
            >
              Company ?
            </label>

            <input
              id='company'
              type='text'
              placeholder='Acme'
              className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
              value={ company }
              onChange={ ( e ) => setCompany( e.target.value ) }
            />

          </div>

          <div className='w-[100%] flex flex-col sm:flex-row justify-between'>

            <div className="w-[100%] sm:w-[50%] p-2">
              <label
                htmlFor='email'
                className='w-[100%] p-2 m-1 text-sm text-neutral-900'
              >
                Email
                <span className='pl-1 text-red-500'>*</span>
              </label>

              <input
                id='email'
                type='email'
                placeholder='john@doe.com'
                className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
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

            <div className="w-[100%] sm:w-[50%] p-2">
              <label
                htmlFor='phone'
                className='w-[100%] p-2 m-1 text-sm text-neutral-900'
              >
                Phone
              </label>

              <input
                id='phone'
                type='tel'
                placeholder='+1 555 555 5555'
                className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
                value={ phone }
                onChange={ ( e ) => setPhone( e.target.value ) }
              />
            </div>

          </div>

          <div className="w-[100%] p-2">
            <ContactSubjectCloud subjectName={ subjectName } handleSubjectChange={ handleSubjectChange } />
          </div>


          <div className="w-[100%] p-2">
            <label
              htmlFor='message'
              className='w-[100%] p-2 m-1 text-sm text-neutral-900'
            >
              { subject.title }
              <span className='pl-1 text-red-500'>*</span>
            </label>

            <textarea
              id='message'
              placeholder='Your message here'
              className='w-[100%] p-2 m-1 bg-neutral-100 bg-opacity-50 shadow-md border border-neutral-100 rounded shadow-inner'
              rows={ 2 }
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

          <div className="w-[100%] mt-5">
            <button
              className={ `primary active-hover w-[100%] ${!formValidation() ? 'opacity-30 cursor-auto' : ''}` }
              onClick={ send }
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
