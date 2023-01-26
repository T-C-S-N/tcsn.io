require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb"

const usersCollection: string = process.env.MONGO_USERS_COLLECTION || ''

// get profile from db
export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      // get id from route
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester) return res.status(401).json({ message: 'User does not exist' });
      return res.json(requester);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;

   }
};