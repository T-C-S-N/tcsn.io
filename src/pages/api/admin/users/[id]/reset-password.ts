require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from 'mongodb'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

const ResetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      // get id from route
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // TODO: reset password
      /*
      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // get user by id
      const { id } = req.query;
      const user = await db.collection(usersCollection).findOne({ _id: new ObjectId(id as string) });
      if (!user) return res.status(401).json({ message: 'User does not exist' });
      return res.json(user);
      */
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;

   }
};

export default ResetPassword;