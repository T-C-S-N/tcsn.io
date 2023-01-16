// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string,
  text: string,
  logo: string,
  animation: string,
  embedded: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'signature', text: 'Designed by tocausan', logo: '', animation: '', embedded: '' })
}
