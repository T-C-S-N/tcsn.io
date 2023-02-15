import AuthServices from "@/lib/AuthServices"
import userServices from "@/lib/UserServices"
import { NextApiRequest, NextApiResponse } from "next"

// get all users
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const { method } = req
   if (req.method !== 'PUT') return res.status(405).json({ 'error': `Method ${method} Not Allowed` })

   try {
      // check authorization header
      const isAdmin = await AuthServices.checkIsUser(req.headers.authorization)
      if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' })

      const { firstname, lastname, email } = req.body
      if (!firstname) return res.status(400).json({ error: 'Firstname missing' })
      if (!lastname) return res.status(400).json({ error: 'Lastname missing' })
      if (!email) return res.status(400).json({ error: 'Email missing' })

      const auth = JSON.parse(req.headers.authorization as string)
      let user = await userServices.getUserByEmail(auth.email as string)
      await userServices.updateUserById(user._id, {
         firstname,
         lastname,
      })
         .catch((e: any) => {
            res.status(500).json({ error: e.message })
         })

      user = await userServices.getUserByEmail(auth.email as string)
      res.status(200).json(user)
   } catch (e: any) {
      res.status(500).json({ error: e.message })
   }
}