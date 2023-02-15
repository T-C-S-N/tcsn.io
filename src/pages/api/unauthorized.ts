import { NextApiRequest, NextApiResponse } from "next"

// Unauthorized
export default async function handler(req: NextApiRequest, res: NextApiResponse, next: any) {
   return res.status(401).json({ error: 'Unauthorized' })
}