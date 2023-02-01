require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb"

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

const GetUsers = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // get all users
      const users = await db.collection(usersCollection).find({}).toArray()
      return res.json(users);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default GetUsers;