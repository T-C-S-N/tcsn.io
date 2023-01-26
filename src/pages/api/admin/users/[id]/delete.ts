require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from 'mongodb'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

const DeleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // get user by id
      const { id } = req.query;
      if (!id) return res.status(401).json({ message: 'Invalid data' });

      await db.collection(usersCollection).deleteOne({ _id: new ObjectId(id as string) });
      res.json('User deleted');
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default DeleteUser;