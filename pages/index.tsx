import { useState, useEffect } from 'react'
import Head from 'next/head'
import LoginForm from '../components/LoginForm'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth/check')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">🚀 Loading Enhanced HPMREI Dashboard...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>HPMREI Trading Dashboard</title>
        <meta name="description" content="Secure HPMREI cryptocurrency trading dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-trading-bg">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <LoginForm onLogin={() => setIsAuthenticated(true)} />
        )}
      </div>
    </>
  )
}
