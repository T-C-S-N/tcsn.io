require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from 'mongodb'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

const UpdateUser = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // uodate user by id
      const { id } = req.query;
      const { data } = req.body;

      // check if firstname, lastname, email, password are valid
      if (!data || !data.firstname || !data.lastname || !data.email) return res.status(401).json({ message: 'Invalid data' });

      // update user
      await db.collection(usersCollection).updateOne(
         { _id: new ObjectId(id as string) },
         {
            $set: {
               firstname: data.firstname,
               lastname: data.lastname,
               email: data.email,
               role: data.role,
            }
         }
      );

      // check if the user already exists
      const user = await db.collection(usersCollection).findOne({ _id: new ObjectId(id as string) });
      if (!user) return res.status(401).json({ message: 'User does not exist' });
      return res.json(user);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default UpdateUser;