import { NextApiRequest, NextApiResponse } from 'next'

// FRESH DEPLOYMENT - COMPLETELY NEW - NO IP CHECKING
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always respond with success for any password to test deployment
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  
  return res.status(200).json({ 
    success: true, 
    message: 'FRESH DEPLOYMENT WORKING - IP restrictions permanently removed',
    timestamp: new Date().toISOString(),
    deployment: 'fresh-v2'
  })
}
