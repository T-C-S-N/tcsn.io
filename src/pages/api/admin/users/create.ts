require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb"
import User from "@/models/User";
const bcrypt = require('bcrypt');

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string;

const CreateUser = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // check data
      const { data } = req.body;
      await User.checkForm(data).catch((err: any) => {
         return res.status(401).json({ message: err.message });
      });

      // check if the user already exists
      const exists = await db.collection(usersCollection).findOne({ email: data.email });
      if (exists) return res.status(401).json({ message: 'User already exists' });

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // create a new user
      const newUserData: User = new User({ ...data, password: hashedPassword })
      const newUser = await db.collection(usersCollection).insertOne(newUserData as any);
      return res.json(newUser);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default CreateUser;