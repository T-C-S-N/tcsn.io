
import Logo from "../Logo";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardHeader({ pageView, switchPageView }: { pageView: string, switchPageView: Function }) {
   const router = useRouter();

   const [isOpen, setIsOpen] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false)
   const { data: session, status } = useSession() as any

   useEffect(() => {
      if (session && session.role && session.role === 'admin') {
         setIsAdmin(true)
      }
   }, [session])

   const handleSignout = (e: any) => {
      e.preventDefault()
      signOut()
      router.push('/');
   }

   return (
      <>
         <header className="width-100 padding-15-30 flex-column sm-none">
            <div className="width-100 padding-horizontal-10 flex-row flex-align-center flex-justify-space-between">
               <div className='width-80 max-width-80 margin-bottom-10'>
                  <Link href='/'>
                     <Logo color={'black'} />
                  </Link>
               </div>

               <Link href='#' onClick={() => setIsOpen(!isOpen)}>
                  <div className={["burger-menu margin-bottom-15", isOpen ? 'active' : ''].join(' ')}>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                  </div>
               </Link>
            </div>

            {isOpen && (
               <div className="width-100 flex-column">
                  {/*
                  <Link href="#" className={['width-100 padding-10-5 font-size-subtitle', pageView == "" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('')}>Dashboard</Link>                  
                  */}
                  <Link href="#" className={['width-100 padding-10-5 font-size-subtitle', pageView == "profile" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('profile')}>Profile</Link>

                  {isAdmin && (
                     <>
                        <Link href="#" className={['width-100 padding-10-5 font-size-subtitle', pageView == "users" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('users')}>Users</Link>
                        <Link href="#" className={['width-100 padding-10-5 font-size-subtitle', pageView == "projects" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('projects')}>Projects</Link>
                     </>
                  )}

                  <div className="width-100 flex-start padding-left-10 margin-top-30">
                     <Link href="#" className='width-50 padding-5 btn border danger small' onClick={handleSignout}>Signout</Link>
                  </div>
               </div>
            )}
         </header>

         <header className='width-100 sm-width-20 xl-width-10 flex-row sm-flex-column flex-center sm-flex-start bg-main none sm-flex'>
            <div className='width-30 sm-width-90 xl-width-80 margin-bottom-20 flex-start padding-10-25'>
               <div className='width-80 max-width-80'>
                  <Link href='/'>
                     <Logo color={'black'} />
                  </Link>
               </div>
            </div>

            <div className='width-70 sm-width-100 flex-column'>
               {/*               
               <Link href="#" className={['width-100 padding-5', pageView == "" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('')}>Dashboard</Link>
               */}
               <Link href="#" className={['width-100 padding-5', pageView == "profile" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('profile')}>Profile</Link>

               {isAdmin && (
                  <>
                     <Link href="#" className={['width-100 padding-5', pageView == "users" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('users')}>Users</Link>
                     <Link href="#" className={['width-100 padding-5', pageView == "projects" ? 'bg-white' : ""].join(' ')} onClick={() => switchPageView('projects')}>Projects</Link>
                  </>
               )}

               <div className="width-100 flex-start padding-left-10 margin-top-50">
                  <Link href="#" className='width-70 padding-5 btn border danger small' onClick={handleSignout}>Signout</Link>
               </div>
            </div>
         </header>
      </>

   )
}