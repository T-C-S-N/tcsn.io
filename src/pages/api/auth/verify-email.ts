import clientPromise from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string;

// create a new user, set nextjs user session
const VerifyEmail= async (req: NextApiRequest, res: NextApiResponse) =>{
  const { email, token }: { email: string, token: string } = req.body;
  const client = await clientPromise;
  const db = client.db(usersCollection);

  // if email is not provided
  if (!email) return res.status(401).json({ message: 'Email is required' });
  if (!token) return res.status(401).json({ message: 'Token is required' });

  const user = await db.collection(usersCollection).findOne({
    email: email
  });

  // if user doesn't exist
  if (!user) {
    res.status(401).json({
      message: 'User doesn\'t exist'
    });
    return;
  }

  // if user does exist
  if (user && user.emailToken === token) {
    const update = await db.collection(usersCollection).updateOne({
      email: email
    },
      {
        $set: {
          verified: true,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          emailToken: null
        }
      },
    );
    res.json(update);
  } else {
    res.status(401).json({
      message: 'Token is invalid'
    });
  }
}

export default VerifyEmail;