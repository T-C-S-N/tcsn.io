import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLoading from '@/components/PageLoading';
import { store } from '@/store';
import { Provider } from 'react-redux';

function App ( { Component, pageProps: { session, ...pageProps } }: AppProps ) {
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState( true );

  useEffect( () => {
    setTimeout( () => setIsLoading( false ), 1000 );
  }, [ router.isReady, session ] );

  return (
    <>
      <SessionProvider session={ session }>

        <div className="h-[100vh] invisible absolute overflow-hidden">
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
          All work and no play makes Jack a dull boy <br />
        </div>

        <Provider store={ store }>
          { isLoading && (
            <div className='flex justify-center items-center' style={ { height: '100vh', width: '100vw' } } >
              <PageLoading isLoading={ isLoading } />
            </div>
          ) }

          { !isLoading &&
            <Component { ...pageProps } />
          }
          <Analytics />
        </Provider>
      </SessionProvider>
    </>
  )
}

App.displayName = 'tocausan';

export default App
