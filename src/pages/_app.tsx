import '@/styles/library.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import { useState } from 'react';
import RefreshTokenHandler from '@/components/refreshTokenHandler';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [interval, setInterval] = useState(0);

  return (
    <>
      <SessionProvider session={session} refetchInterval={interval}>
        <Component {...pageProps} />
        <Analytics />
        <RefreshTokenHandler setInterval={setInterval} />
      </SessionProvider>
    </>
  )
}

App.displayName = 'tocausan';

export default App
