// header component
import React from 'react';
import SEO from './SEO';
import Header from './header/Header';
import Footer from './Footer';

// layout component
export default function Layout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <>
      <SEO title={title} description={'Tocausan' + title} siteTitle="Tocausan" />
      <Header />
      <main className='w-[100%] min-h-[100vh] bg-gray-100 shadow-md z-10'>
        {children}
      </main>
      <Footer />
    </>
  )
}