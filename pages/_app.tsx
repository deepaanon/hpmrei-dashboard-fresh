import '../styles/globals.css'
import '../styles/enhanced-dashboard-v2.css' // New CSS file to bypass Vercel cache
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
