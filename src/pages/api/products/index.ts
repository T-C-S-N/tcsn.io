import AuthServices from "@/lib/AuthServices"
import ProductServices from "@/lib/ProductServices"
import { NextApiRequest, NextApiResponse } from "next"

// get all products
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const { method } = req
   if (req.method !== 'GET') return res.status(405).json({ 'error': `Method ${method} Not Allowed` })

   try {
      // check authorization header
      const isAdmin = await AuthServices.checkIsAdmin(req.headers.authorization)
      if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' })

      const products = await ProductServices.getAllProducts()
         .catch((e: any) => {
            res.status(500).json({ error: e.message })
         })
      res.status(200).json(products)
   } catch (e: any) {
      res.status(500).json({ error: e.message })
   }
}