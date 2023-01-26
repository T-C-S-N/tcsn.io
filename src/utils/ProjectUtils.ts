import axios from "axios";
import { getSession } from "next-auth/react";

const ProjectUtils = {
   getProjects: async () => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/projects', { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   getProject: async (id: string) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/projects/' + id, { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   createProject: async (data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/projects/create', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   },

   updateProject: async (id: string, data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/projects/' + id + '/update', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   },

   deleteProject: async (id: string) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/projects/' + id + '/delete', { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },
}

export default ProjectUtils;