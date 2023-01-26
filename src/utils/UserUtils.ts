import axios from "axios";
import { getSession } from "next-auth/react";

const UserUtils = {
   getUsers: async () => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users', { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   getUser: async (id: string) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users/' + id, { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   createUser: async (data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users/create', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   },

   updateUser: async (id: string, data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users/' + id + '/update', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   },

   deleteUser: async (id: string) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users/' + id + '/delete', { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   changePassword: async (id: string, data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/admin/users/' + id + '/change-password', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   },

   getProfile: async () => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/user/profile', { credentials: { email: session.email, accessToken: session.accessToken } })
         .then(res => res.data)
   },

   updateProfile: async (data: any) => {
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');

      return axios.post('/api/user/profile/update', { credentials: { email: session.email, accessToken: session.accessToken }, data: data })
         .then(res => res.data)
   }
}

export default UserUtils;