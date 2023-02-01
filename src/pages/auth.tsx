import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'

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
    <>
      <SEO title='tcsn | Auth' description='Tocausan Auth' siteTitle='Tocausan' />
      <Header />
      <main className='flex-justify-center flex-align-start sm-margin-top-100 margin-bottom-30'>

        <Loading isLoading={isLoading} />

        {!isLoading && (
          <>
            {formType === 'signin' && (
              <form className='container width-90 sm-width-50 lg-width-30'>
                <h1>Sign In</h1>

                {serverError && <div className='flex-column margin-bottom-15 width-100 padding-10 bg-danger color-white'>{serverError}</div>}

                <div className='flex-column margin-bottom-10 width-100'>
                  <label htmlFor="email" className='margin-vertical-5'>
                    Email
                    {isEmailError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className='flex-column margin-bottom-15 width-100'>
                  <label htmlFor="password" className='margin-vertical-5'>
                    Password
                    {isPasswordError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>

                {!loadingRequest && (
                  <>
                    <div className='flex-column margin-vertical-10 width-100'>
                      <a className='btn dark width-100' onClick={handleSigninSubmit}>Sign In</a>
                    </div>
                    <div className='flex-column margin-vertical-10 width-100'>
                      <Link href='#' className='btn link width-100' onClick={() => switchFormType('signup')}>Not registered yet ?</Link>
                    </div>
                  </>
                )}

              </form>
            )}

            {formType === 'signup' && (
              <form className='container width-90 sm-width-50 lg-width-30'>
                <h1>Sign Up</h1>

                {serverError && <div className='flex-column margin-bottom-15 width-100 padding-10 bg-danger color-white'>{serverError}</div>}

                <div className='flex-column margin-bottom-10 width-100'>
                  <label htmlFor="text" className='margin-vertical-5'>
                    Firstname
                    {isFirstnameError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="email" name="firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
                </div>

                <div className='flex-column margin-bottom-10 width-100'>
                  <label htmlFor="text" className='margin-vertical-5'>
                    Lastname
                    {isLastnameError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="email" name="lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                </div>

                <div className='flex-column margin-bottom-10 width-100'>
                  <label htmlFor="email" className='margin-vertical-5'>
                    Email
                    {isEmailError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                </div>
                <div className='flex-column margin-bottom-15 width-100'>
                  <label htmlFor="password" className='margin-vertical-5'>
                    Password
                    {isPasswordError && <b className='text-danger'> is required</b>}
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                </div>
                <div className='flex-column margin-bottom-15 width-100'>
                  <label htmlFor="password" className='margin-vertical-5'>
                    Password confirmation
                    {isPasswordConfirmError && <b className='text-danger'> is required</b>}
                    {isPasswordConfirmError && isPasswordMatchError && <b className='text-danger'> and </b>}
                    {isPasswordMatchError && <b className='text-danger'> must match</b>}
                  </label>
                  <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} />
                </div>

                {!loadingRequest && (
                  <>
                    <div className='flex-column margin-vertical-10 width-100'>
                      <a className='btn dark width-100' onClick={handleSignupSubmit}>Sign Up</a>
                    </div>
                    <div className='flex-column margin-vertical-10 width-100'>
                      <Link href='#' className='btn link width-100' onClick={() => switchFormType('signin')}>Already registered ?</Link>
                    </div>
                  </>
                )}

              </form>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
