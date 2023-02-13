import '@/styles/library.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLoading from '@/components/PageLoading';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, [router.isReady, session]);

  return (
    <>
      <SessionProvider session={session}>
        {isLoading && (
          <div className='flex-center' style={{ height: '100vh', width: '100vw' }} >
            <PageLoading isLoading={isLoading} />
          </div>
        )}

        {!isLoading &&
          <Component {...pageProps} />
        }
        <Analytics />
      </SessionProvider>
    </>
  )
}

App.displayName = 'tocausan';

export default App
