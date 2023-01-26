import styles from '@/styles/pages/Home.module.css'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SEO from '@/components/layout/SEO'
import axios from 'axios'
import { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [error, setError] = useState('')


  const handleSubmit = (e: any) => {
    e.preventDefault()
    setError('')

    axios.post('/api/auth/signup', formData)
      .then(res => {
        window.location.href = '/email-confirmation';
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
          <h1>Sign Up</h1>

          {error && <div className='flex flex-column margin-bottom-15 width-100 padding-10 bg-danger color-white'>{error}</div>}

          <div className='flex flex-column margin-bottom-10 width-100'>
            <label htmlFor="text" className='margin-vertical-5'>Firstname</label>
            <input type="email" name="firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
          </div>

          <div className='flex flex-column margin-bottom-10 width-100'>
            <label htmlFor="text" className='margin-vertical-5'>Lastname</label>
            <input type="email" name="lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
          </div>

          <div className='flex flex-column margin-bottom-10 width-100'>
            <label htmlFor="email" className='margin-vertical-5'>Email</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

          </div>
          <div className='flex flex-column margin-bottom-15 width-100'>
            <label htmlFor="password" className='margin-vertical-5'>Password</label>
            <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          </div>
          <div className='flex flex-column margin-bottom-15 width-100'>
            <label htmlFor="password" className='margin-vertical-5'>Password confirmation</label>
            <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })} />

          </div>
          <div className='flex flex-column margin-vertical-10 width-100'>
            <a className='btn btn-dark width-100' onClick={handleSubmit}>Sign Up</a>
          </div>
          <div className='flex flex-column margin-vertical-10 width-100'>
            <Link href='/signin' className='btn btn-link width-100'>Already registered ?</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}
