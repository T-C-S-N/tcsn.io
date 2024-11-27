
import Logo from "./HeaderLogo";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";
import HeaderItem from "./HeaderItem";

export default function HeaderDesktop () {
   const router = useRouter();
   const { data: session }: { data: any } = useSession();

   const [ isSignedIn, setIsSignedIn ] = useState( false );
   const [ profile, setProfile ] = useState( null as any );
   const [ isMember, setIsMember ] = useState( false );
   const [ isAdmin, setIsAdmin ] = useState( false );
   const [ isMenuActive, setIsMenuActive ] = useState( false );
   const [ isDarkMode, setIsDarkMode ] = useState( false );

   useEffect( () => {
      if( session && session.email && session.accessToken ) {
         setIsSignedIn( true );
         setProfile( session.user );
         setIsMember( session.role === 'user' );
         setIsAdmin( session.role === 'admin' );
      } else {
         setIsSignedIn( false );
         setProfile( null );
         setIsMember( false );
         setIsAdmin( false );
      }
   }, [ session ] );

   useEffect( () => {
      switch( true ) {
         case router.pathname.includes( '/projects' ):
            setIsDarkMode( true );
            break;
         default:
            setIsDarkMode( false );
      }
   }, [ router.pathname ] );

   const handleSignout = ( e: any ) => {
      e.preventDefault()
      signOut()
   }

   return (
      <>
         <header className={ [
            'w-[100%] h-[55px] p-2 py-1 hidden sm:flex flex-row justify-center items-center fixed top-0 left-0 z-30',
            isDarkMode ? 'text-white' : 'text-neutral-800'
         ].join( ' ' ) }>
            <div className='h-[100%] flex flex-row justify-start items-center'>
               <div className='w-[80px] h-[100%]'>
                  <Link href='/' className="w-[100%]">
                     { router.pathname == "/" && <Logo color={ 'blue' } /> }
                     { router.pathname != "/" && !isDarkMode && <Logo color={ 'black' } /> }
                     { router.pathname != "/" && isDarkMode && <Logo color={ 'white' } /> }
                  </Link>
               </div>

               <div className="ml-10 hidden">
                  <HeaderItem  
                     title="Home"
                     href="/"
                     active={ router.pathname == "/" }
                  />

                  {/*<HeaderItem  
                     title="Projects"
                     href="/projects"
                     active={ router.pathname == "/projects" }
                  />*/}

                  <HeaderItem  
                     title="Contact"
                     href="/contact"
                     active={ router.pathname == "/contact" }
                  />
               </div>
            </div>

            <div className='flex flex-row justify-end items-center !hidden'>
               { isSignedIn && isAdmin && (
                  <Link href='/dashboard' className={ [
                     'p-2 ml-5 text-sm hover:text-neutral-600 transition',
                     router.pathname == "/dashboard" ? 'border border-neutral-500 border-b-1 border-l-0 border-t-0 border-r-0' : ''
                  ].join( ' ' ) }>Dashboard</Link>
               ) }

               { !isSignedIn && <Link href="/auth?type=signin"
                  className={ [
                     'px-5 py-1 ml-5 text-md border border-neutral-500 rounded-md hover:bg-neutral-800 hover:text-white transition text-xs',
                     router.pathname == "/auth" ? 'text-white bg-neutral-800' : ''
                  ].join( ' ' ) }>
                  Sign In
               </Link> }
               { isSignedIn && <Link href="#" onClick={ handleSignout }
                  className='px-5 py-1 ml-5 text-md text-red-800 border border-red-800 rounded-md hover:bg-red-800 hover:text-white transition text-xs'>Sign Out</Link> }
               {/*
               !isSignedIn && <Link href="/auth?type=signup" className='btn dark small margin-horizontal-5'>Sign Up</Link>
               */}
            </div>
         </header>
      </>
   )
}