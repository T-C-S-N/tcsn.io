require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from 'mongodb'
import Project from "@/models/Project";

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
      if (!id) return res.status(401).json({ message: 'ID required' });

      // check data
      const { data } = req.body;
      await Project.checkForm(data)
         .catch((e: any) => {
            return res.status(401).json({ message: e.message });
         });

      // create a new project
      const newProjectData = new Project({
         title: data.title,
         description: data.description,
         details: data.details,
         url: data.url,
         images: data.images,
         isOnline: data.isOnline,
      })

      // update project
      await db.collection(projectsCollection).updateOne(
         { _id: new ObjectId(id as string) },
         {
            $set: {
               title: newProjectData.title,
               description: newProjectData.description,
               details: newProjectData.details,
               url: newProjectData.url,
               images: newProjectData.images,
               isOnline: newProjectData.isOnline,
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