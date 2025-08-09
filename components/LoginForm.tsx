import { useState } from 'react'

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin()
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-trading-bg">
      <div className="bg-trading-card p-8 rounded-lg border border-trading-border max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🚀 HPMREI</h1>
          <p className="text-gray-400">Secure Trading Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Access Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-trading-bg border border-trading-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter dashboard password"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? '🔑 Authenticating...' : '🔓 Access Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🔒 Secured with password + IP protection</p>
          <p className="mt-1">📱 Access from anywhere securely</p>
        </div>
      </div>
    </div>
  )
}
