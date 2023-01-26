import styles from '@/styles/pages/Home.module.css'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from "next-auth/react"

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')

    axios.post('/api/auth/signin', formData)
      .then(res => {
        if (res.data)
          signIn('credentials', res.data)
            .then(() => {
              window.location.href = '/dashboard';
            })
        else setError('Invalid credentials')
      })
      .catch(err => {
        setError(err.response.data.message as string)
      })
  }

  return (
    <>
      <SEO title='tcsn | Admin' description='Tocausan Admin' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <form className='container width-90 sm-width-50 lg-width-30'>
          <h1>Sign In</h1>

          {error && <div className='flex flex-column margin-bottom-15 width-100 padding-10 bg-danger color-white'>{error}</div>}

          <div className='flex flex-column margin-bottom-10 width-100'>
            <label htmlFor="email" className='margin-vertical-5'>Email</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className='flex flex-column margin-bottom-15 width-100'>
            <label htmlFor="password" className='margin-vertical-5'>Password</label>
            <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className='flex flex-column margin-vertical-10 width-100'>
            <a className='btn btn-dark width-100' onClick={handleSubmit}>Sign In</a>
          </div>
          <div className='flex flex-column margin-vertical-10 width-100'>
            <Link href='/signup' className='btn btn-link width-100'>Not registered yet ?</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}
