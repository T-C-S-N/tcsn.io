
import Logo from "../Logo";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";

export default function Header() {
   const router = useRouter();
   const { data: session }: { data: any } = useSession();

   const [isSignedIn, setIsSignedIn] = useState(false);
   const [profile, setProfile] = useState(null as any);
   const [isMember, setIsMember] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
   const [isMenuActive, setIsMenuActive] = useState(false);

   useEffect(() => {
      if (session && session.email && session.accessToken) {
         setIsSignedIn(true);
         setProfile(session.user);
         setIsMember(session.role === 'user');
         setIsAdmin(session.role === 'admin');
      } else {
         setIsSignedIn(false);
         setProfile(null);
         setIsMember(false);
         setIsAdmin(false);
      }
   }, [session]);

   const handleSignout = (e: any) => {
      e.preventDefault()
      signOut()
   }

   return (
      <>
         <header className='w-[100%] px-2  flex-col justify-start sm:hidden bg-gray-100'>
            <div className='w-[100%] px-2 flex flex-row justify-between items-center'>
               <div className='w-[80px]'>
                  <Link href='/' className="w-[100%]">
                     {router.pathname === "/" && <Logo active={true} />}
                     {router.pathname !== "/" && <Logo active={false} />}

                  </Link>
               </div>

               <Link href='#' onClick={() => setIsMenuActive(!isMenuActive)}>
                  <div className={["burger-menu", isMenuActive ? 'active' : ''].join(' ')}>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                  </div>
               </Link>
            </div>

            {isMenuActive && (
               <div className="width-100 flex-column absolute left-0 z-10">
                  <Link href='/' className={['p-2 text-lg text-right', router.pathname == "/" ? 'bg-white' : ''].join(' ')}>
                     Home
                  </Link>
                  <Link href='/contact' className={['p-2 text-lg text-right', router.pathname == "/contact" ? 'bg-white' : ''].join(' ')}>
                     Contact
                  </Link>
                  {/*
                   <div className={['p-2 bgtext-lg text-right', router.pathname == "/projects" ? 'bg-white' : ''].join(' ')}>
                     <Link href='/projects'>Projects</Link>
                  </div>
                  */}

                  {isSignedIn && isAdmin && (
                     <Link href='/dashboard' className={['p-2 text-lg text-right', router.pathname == "/dashboard" ? 'bg-white' : ''].join(' ')}>
                        Dashboard
                     </Link>
                  )}

                  {!isSignedIn && (
                     <Link href="/auth?type=signin" className={['w-[100%] p-2 text-lg text-right', router.pathname == "/auth" ? 'bg-white' : ''].join(' ')}>
                        Sign In
                     </Link>
                  )}
                  {isSignedIn && <Link href="#" onClick={handleSignout} className='p-2 text-lg text-right'>Sign Out</Link>}
                  {/*
                        !isSignedIn && <Link href="/auth?type=signup" className='btn dark small margin-horizontal-5'>Sign Up</Link>
                     */}
               </div>
            )}
         </header>

         <header className='w-[100%] px-2 hidden sm:flex flex-row justify-between items-center bg-gray-100'>
            <div className='flex flex-row justify-start items-center'>
               <div className='w-[80px]'>
                  <Link href='/' className="w-[100%]">
                     <Logo active={router.pathname == "/"} />
                  </Link>
               </div>
               <div className={['p-2 ml-5 text-sm hover:text-neutral-600 transition', router.pathname == "/contact" ? 'border border-b-1 border-l-0 border-t-0 border-r-0' : ''].join(' ')}>
                  <Link href='/contact'>Contact</Link>
               </div>
               {/*
                <div className={['p-2 ml-5 text-sm hover:text-neutral-600 transition', router.pathname == "/projects" ? 'border border-b-1 border-l-0 border-t-0 border-r-0' : ''].join(' ')}>
                  <Link href='/projects'>Projects</Link>
               </div>
               */}

            </div>

            <div className='flex flex-row justify-end items-center'>
               {isSignedIn && isAdmin && (
                  <div className={['p-2 ml-5 text-sm hover:text-neutral-600 transition', router.pathname == "/dashboard" ? 'border border-b-1 border-l-0 border-t-0 border-r-0' : ''].join(' ')}>
                     <Link href='/dashboard'>Dashboard</Link>
                  </div>
               )}

               {!isSignedIn && <Link href="/auth?type=signin"
                  className={['px-5 py-1 ml-5 text-md border border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white transition text-xs', router.pathname == "/auth" ? 'text-white bg-neutral-800' : ''].join(' ')}>
                  Sign In
               </Link>}
               {isSignedIn && <Link href="#" onClick={handleSignout}
                  className='px-5 py-1 ml-5 text-md text-red-800 border border-red-800 rounded-md hover:bg-red-800 hover:text-white transition text-xs'>Sign Out</Link>}
               {/*
               !isSignedIn && <Link href="/auth?type=signup" className='btn dark small margin-horizontal-5'>Sign Up</Link>
               */}
            </div>
         </header>
      </>


   )
}