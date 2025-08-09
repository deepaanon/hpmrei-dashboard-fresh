import { NextApiRequest, NextApiResponse } from 'next'

// FRESH DEPLOYMENT - NO IP CHECKING - PROPER PASSWORD HANDLING
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body
  
  // Prevent caching to ensure fresh responses
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  
  // Check password - NO IP restrictions whatsoever
  if (password === 'hpmrei2025') {
    res.setHeader('Set-Cookie', [
      `hpmrei-auth=authenticated; HttpOnly; Path=/; Max-Age=86400`
    ])
    
    return res.status(200).json({ 
      success: true, 
      message: 'FRESH DEPLOYMENT SUCCESS - No IP restrictions!',
      timestamp: new Date().toISOString()
    })
  }
  
  return res.status(401).json({ 
    success: false, 
    message: 'Invalid password',
    timestamp: new Date().toISOString()
  })
}
