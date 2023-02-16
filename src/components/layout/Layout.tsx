// header component
import React from 'react';
import SEO from './SEO';
import Header from './Header';
import Footer from './Footer';

// layout component
export default function Layout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <>
      <SEO title={title} description={'Tocausan' + title} siteTitle="Tocausan" />
      <Header />
      <main className='w-[100%] max-w-[1500px] min-h-[780px] mb-[30px] pb-[50px] bg-gray-100'>
        {children}
      </main>
      <Footer />
    </>
  )
}