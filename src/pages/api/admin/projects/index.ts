require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb"

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string
const projectsCollection: string = process.env.MONGO_PROJECTS_COLLECTION as string

const GetProjects = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // get all users
      const projects = await db.collection(projectsCollection).find({}).toArray()
      return res.json(projects);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default GetProjects;