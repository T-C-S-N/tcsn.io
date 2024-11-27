
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from "react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

export default function Header () {
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
         <HeaderDesktop/>
         <HeaderMobile/>        
      </>


   )
}