import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import Layout from '@/components/layout/Layout'

export default function AuthPage() {
  const router = useRouter()
  const { type } = router.query

  const [isLoading, setIsLoading] = useState(false)
  const [loadingRequest, setLoadingRequest] = useState(false)
  const [formType, setFormType] = useState(type || 'signin')
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [isFirstnameError, setIsFirstnameError] = useState('')
  const [isLastnameError, setIsLastnameError] = useState('')
  const [isEmailError, setIsEmailError] = useState('')
  const [isPasswordError, setIsPasswordError] = useState('')
  const [isPasswordConfirmError, setIsPasswordConfirmError] = useState('')
  const [isPasswordMatchError, setIsPasswordMatchError] = useState('')
  const [serverError, setServerError] = useState('')

  const switchFormType = (type: string) => {
    setFormType(type)
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordConfirm: '',
    })
    setIsFirstnameError('')
    setIsLastnameError('')
    setIsEmailError('')
    setIsPasswordError('')
    setIsPasswordConfirmError('')
    setIsPasswordMatchError('')
    setServerError('')
  }

  const handleSigninSubmit = async (e: any) => {
    e.preventDefault()
    formData.email ? setIsEmailError('') : setIsEmailError('Email is required')
    formData.password ? setIsPasswordError('') : setIsPasswordError('Password is required')

    if (!formData.email || !formData.password) return

    setServerError('')
    setLoadingRequest(true)

    axios.post('/api/auth/signin', formData)
      .then(res => {
        signIn('credentials', res.data)
          .then(() => router.push('/dashboard'))
      })
      .catch(err => {
        setLoadingRequest(false)
        setServerError(err.response.data.message as string)
      })
  }

  const handleSignupSubmit = async (e: any) => {
    e.preventDefault()
    formData.firstname ? setIsFirstnameError('') : setIsFirstnameError('Firstname is required')
    formData.lastname ? setIsLastnameError('') : setIsLastnameError('Lastname is required')
    formData.email ? setIsEmailError('') : setIsEmailError('Email is required')
    formData.password ? setIsPasswordError('') : setIsPasswordError('Password is required')
    formData.passwordConfirm ? setIsPasswordConfirmError('') : setIsPasswordConfirmError('Password Confirm is required')
    formData.password !== formData.passwordConfirm ? setIsPasswordMatchError('Password does not match') : setIsPasswordMatchError('')

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.passwordConfirm || formData.password !== formData.passwordConfirm) return

    setServerError('')
    setLoadingRequest(true)

    axios.post('/api/auth/signup', formData)
      .then(() => router.push('/message-for-you?type=email-confirmation'))
      .catch(err => {
        setLoadingRequest(false)
        setServerError(err.response.data.message as string)
      })
  }

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[780px] flex flex-col justify-center items-center'>

        {formType === 'signin' && (
          <fieldset className='w-[90%] sm:w-[400px] p-2 border border-black rounded-md shadow-md'>
            <legend className='px-2 text-lg'>Sign In</legend>

            {serverError && <div className='w-[100%] p-2 mb-5 rounded-md bg-red-500 text-white'>{serverError}</div>}

            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Email
                {isEmailError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="email" name="email" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="password" className='my-2'>
                Password
                {isPasswordError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="password" name="password" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            {!loadingRequest && (
              <>
                <div className='w-[100%] px-1 mt-5 flex'>
                  <Link href='' className='w-[100%] p-2 rounded-md text-center bg-gray-300 hover:bg-gray-400 transition' onClick={handleSigninSubmit}>
                    Submit
                  </Link>
                </div>
                {/*<div className='flex-column margin-vertical-10 width-100'>
                      <Link href='#' className='btn link width-100' onClick={() => switchFormType('signup')}>Not registered yet ?</Link>
                    </div>
                    */}
              </>
            )}

          </fieldset>
        )}

        {formType === 'signup' && (
          <fieldset className='w-[90%] sm:w-[400px] p-2 border border-black rounded-md shadow-md'>
            <legend className='px-2 text-lg'>Sign Up</legend>

            {serverError && <div className='w-[100%] p-2 mb-5 rounded-md bg-red-500 text-white'>{serverError}</div>}

            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Firstname
                {isFirstnameError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="email" name="firstname" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
            </div>

            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Lastname
                {isLastnameError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="email" name="lastname" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
            </div>

            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Email
                {isEmailError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="email" name="email" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

            </div>
            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Password
                {isPasswordError && <b className='text-red-500'> is required</b>}
              </label>
              <input type="password" name="password" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

            </div>
            <div className='w-[100%] px-1 py-2'>
              <label htmlFor="email" className='my-2'>
                Password confirmation
                {isPasswordConfirmError && <b className='text-red-500'> is required</b>}
                {isPasswordConfirmError && isPasswordMatchError && <b className='text-red-500'> and </b>}
                {isPasswordMatchError && <b className='text-red-500'> must match</b>}
              </label>
              <input type="password" name="passwordConfirm" className='w-[100%] h-[35px] p-2 rounded-md bg-white border border-gray-300'
                value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} />
            </div>

            {!loadingRequest && (
              <>
                <div className='w-[100%] px-1 mt-5 flex'>
                  <Link href='' className='w-[100%] p-2 rounded-md text-center bg-gray-300 hover:bg-gray-400 transition' onClick={handleSignupSubmit}>
                    Sign Up
                  </Link>
                </div>
                {/*
                    <div className='flex-column margin-vertical-10 width-100'>
                      <Link href='#' className='btn link width-100' onClick={() => switchFormType('signin')}>Already registered ?</Link>
                    </div>
                    */}
              </>
            )}

          </fieldset>
        )}

      </div>
    </Layout>
  )
}
