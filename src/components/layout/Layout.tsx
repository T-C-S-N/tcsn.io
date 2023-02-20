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
      <main className='w-[100%] max-w-[1500px] min-h-[780px] pt-[60px] sm:pt-[55px] mb-[75px] sm:mb-[50px] bg-gray-100 shadow-md z-10'>
        {children}
      </main>
      <Footer />
    </>
  )
}