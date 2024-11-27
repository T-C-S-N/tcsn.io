
import Logo from "./HeaderLogo";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";

export default function HeaderMobile () {
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
         <header className={ [ 'w-[100%] h-[60px] px-2 flex-col justify-start items-center sm:hidden fixed z-30 shadow-sm',
            isDarkMode ? 'bg-neutral-900 text-white' : 'bg-gray-100 text-neutral-800'
         ].join( ' ' ) }>
            <div className='w-[100%] h-[100%] px-2 flex flex-row justify-between items-center'>
               <div className='w-[80px]'>
                  <Link href='/' className="w-[100%]">
                     { router.pathname === "/" && <Logo color={ 'blue' } /> }
                     { router.pathname !== "/" && !isDarkMode && <Logo color={ 'black' } /> }
                     { router.pathname !== "/" && isDarkMode && <Logo color={ 'white' } /> }
                  </Link>
               </div>

               <Link href='#' onClick={ () => setIsMenuActive( !isMenuActive ) }>
                  <div className={ [
                     "burger-menu",
                     isMenuActive ? 'active' : '',
                     isDarkMode ? '[&>*]:!bg-white' : ''
                  ].join( ' ' ) }>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                  </div>
               </Link>
            </div>

            { isMenuActive && (
               <div className={ [
                  "w-[100%] flex flex-col absolute left-0 bg-gray-50 z-40",
                  isDarkMode ?
                     '[&>*]:bg-sky-50 text-black [&>.active]:bg-sky-300 [&>.active]:text-black' :
                     '[&>*]:bg-sky-50 text-black [&>.active]:bg-sky-300 [&>.active]:text-black'
               ].join( ' ' ) }>
                  <Link href='/' className={ [ 'p-2  text-lg text-right', router.pathname == "/" ? 'active' : '' ].join( ' ' ) }>
                     Home
                  </Link>

                  <Link href='/projects' className={ [ 'p-2 text-lg text-right hidden', router.pathname == "/projects" ? 'active' : '' ].join( ' ' ) }>
                     Projects
                  </Link>

                  <Link href='/contact' className={ [ 'p-2 text-lg text-right', router.pathname == "/contact" ? 'active' : '' ].join( ' ' ) }>
                     Contact
                  </Link>

                  {/*
                  {isSignedIn && isAdmin && (
                     <Link href='/dashboard' className={['p-2 text-lg text-right', router.pathname == "/dashboard" ? 'active' : ''].join(' ')}>
                        Dashboard
                     </Link>
                  )}

                  {!isSignedIn && (
                     <Link href="/auth?type=signin" className={['w-[100%] p-2 text-lg text-right', router.pathname == "/auth" ? 'active' : ''].join(' ')}>
                        Sign In
                     </Link>
                  )}
                  {isSignedIn && <Link href="#" onClick={handleSignout} className='p-2 text-lg text-right'>Sign Out</Link>}
                  {/*
                        !isSignedIn && <Link href="/auth?type=signup" className='btn dark small margin-horizontal-5'>Sign Up</Link>
                  */}
               </div>
            ) }
         </header>
      </>
   )
}