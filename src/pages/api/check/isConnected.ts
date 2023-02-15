import DbServices from "@/lib/DbServices"
import { NextApiRequest, NextApiResponse } from "next"

// Unauthorized
export default async function handler(req: NextApiRequest, res: NextApiResponse, next: any) {
   const { method } = req
   if (req.method !== 'GET') return res.status(405).json({ 'error': `Method ${method} Not Allowed` })
   const isConnected = await DbServices.ping()
   return res.status(200).json({ message: isConnected })
}