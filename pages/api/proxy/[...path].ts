import { NextApiRequest, NextApiResponse } from 'next'

function checkAuth(req: NextApiRequest): boolean {
  const cookies = req.headers.cookie || ''
  return cookies.includes('hpmrei-auth=authenticated')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { path } = req.query
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'
  
  try {
    const response = await fetch(`${backendUrl}/api/${Array.isArray(path) ? path.join('/') : path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'HPMREI-Dashboard/1.0',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.json()
    return res.status(response.status).json(data)
    
  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ 
      error: 'Backend connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
