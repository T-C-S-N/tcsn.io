import axios from "axios";
import { getSession } from "next-auth/react";

const ImagesUtils = {
   getImages: async () => {


      /*
      const session = await getSession() as any
      if (!session || !session.email || !session.accessToken) throw new Error('Access denied');


      /*
      return axios.post('/api/admin/users', { credentials: { email: session.email, role: session.role, accessToken: session.accessToken } })
         .then(res => res.data)
         */
   },


}

export default ImagesUtils;