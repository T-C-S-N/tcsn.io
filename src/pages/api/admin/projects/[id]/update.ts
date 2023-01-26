require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from 'mongodb'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string
const projectsCollection: string = process.env.MONGO_PROJECTS_COLLECTION as string

const UpdateProject = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

      // uodate project by id
      const { id } = req.query;
      const { data } = req.body;

      // check data
      if (!data) return res.status(401).json({ message: 'Invalid data' });

      // update project
      await db.collection(projectsCollection).updateOne(
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

      // check if the project exists
      const project = await db.collection(projectsCollection).findOne({ _id: new ObjectId(id as string) });
      if (!project) return res.status(401).json({ message: 'Project does not exist' });
      return res.json(project);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default UpdateProject;