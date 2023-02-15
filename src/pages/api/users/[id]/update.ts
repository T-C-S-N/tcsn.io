import AuthServices from "@/lib/AuthServices"
import userServices from "@/lib/UserServices"
import { NextApiRequest, NextApiResponse } from "next"

// update user by id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const {
      query: { id },
      method,
   } = req
   if (req.method !== 'PUT') return res.status(405).json({ 'error': `Method ${method} Not Allowed` })

   try {
      // check authorization header
      const isAdmin = await AuthServices.checkIsAdmin(req.headers.authorization)
      if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' })

      const user = await userServices.updateUserById(id as string, req.body)
         .catch((e: any) => {
            res.status(500).json({ error: e.message })
         })
      res.status(200).json(user)
   } catch (e: any) {
      res.status(500).json({ error: e.message })
   }
}
