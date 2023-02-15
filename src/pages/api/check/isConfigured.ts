require("dotenv").config()
import { NextApiRequest, NextApiResponse } from "next"

// Unauthorized
export default async function handler(req: NextApiRequest, res: NextApiResponse, next: any) {
   const { method } = req
   if (req.method !== 'GET') return res.status(405).json({ 'error': `Method ${method} Not Allowed` })

   // check if env variables are set
   if (!process.env.SECRET) return res.status(500).json({ 'error': `SECRET is not set` })
   if (!process.env.WEBSITE_URL) return res.status(500).json({ 'error': `WEBSITE_URL is not set` })
   if (!process.env.API_URL) return res.status(500).json({ 'error': `API_URL is not set` })
   if (!process.env.NEXTAUTH_URL) return res.status(500).json({ 'error': `NEXTAUTH_URL is not set` })

   if (!process.env.MONGODB_URI) return res.status(500).json({ 'error': `MONGODB_URI is not set` })
   if (!process.env.MONGODB_DATABASE) return res.status(500).json({ 'error': `MONGODB_DATABASE is not set` })

   if (!process.env.EMAIL_HOST) return res.status(500).json({ 'error': `EMAIL_HOST is not set` })
   if (!process.env.EMAIL_PORT) return res.status(500).json({ 'error': `EMAIL_PORT is not set` })
   if (!process.env.EMAIL_USER) return res.status(500).json({ 'error': `EMAIL_USER is not set` })
   if (!process.env.EMAIL_PASSWORD) return res.status(500).json({ 'error': `EMAIL_PASSWORD is not set` })
   if (!process.env.EMAIL_WEBSITE_NAME) return res.status(500).json({ 'error': `EMAIL_WEBSITE_NAME is not set` })
   if (!process.env.EMAIL_WEBSITE_URL) return res.status(500).json({ 'error': `EMAIL_WEBSITE_URL is not set` })
   if (!process.env.EMAIL_LOGO_IMAGE_URL) return res.status(500).json({ 'error': `EMAIL_LOGO_IMAGE_URL is not set` })

   return res.status(200).json({ message: true })
}