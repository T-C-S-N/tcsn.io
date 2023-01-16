import '@/styles/globals.css'
import type { AppProps } from 'next/app'

App.displayName = 'tocausan';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
