import clientPromise from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

// check user credentials and set next.js user session
const CheckToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db(usersCollection);

  // get requester account
  const { credentials } = req.body;
  const requester = await db.collection(usersCollection).findOne({ email: credentials.email, accessToken: credentials.accessToken });
  if (!requester || requester.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });
  return res.json({ message: 'Authorized' });
}

export default CheckToken;