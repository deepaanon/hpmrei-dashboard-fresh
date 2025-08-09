import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie || ''
  const isAuthenticated = cookies.includes('hpmrei-auth=authenticated')

  if (isAuthenticated) {
    return res.status(200).json({ authenticated: true })
  } else {
    return res.status(401).json({ authenticated: false })
  }
}
