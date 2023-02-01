require('dotenv').config();
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb"
import Project from "@/models/Project";

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string
const projectsCollection: string = process.env.MONGO_PROJECTS_COLLECTION as string

const CreateProject = async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      const client = await clientPromise;
      const db = client.db(usersCollection);

      // get requester account
      const { credentials } = req.body;
      const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
      if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

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

      const newProject = await db.collection(projectsCollection).insertOne(newProjectData as any);
      return res.json(newProject);
   } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
   }
};

export default CreateProject;