import clientPromise from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcrypt');

const usersCollection: string = process.env.MONGO_USERS_COLLECTION as string

// check user credentials and set next.js user session
const Signin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password }: { email: string, password: string } = req.body;

  if (!email) return res.status(401).json({ message: 'Email is required' });
  if (!password) return res.status(401).json({ message: 'Password is required' });
  if (email.search(/@/) === -1 || email.search(/\./) === -1) return res.status(401).json({ message: 'Email incorrect' });
  if (password.length < 6) return res.status(401).json({ message: 'Password must be at least 6 characters long' });
  if (password.length > 20) return res.status(401).json({ message: 'Password must be less than 20 characters long' });

  const client = await clientPromise;
  const db = client.db(usersCollection);
  let user = await db.collection(usersCollection).findOne({ email: email });

  // if user does not exist
  if (!user) return res.status(401).json({ message: 'User does not exist' });


  // if user exists
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // if password is not valid
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

  // if password is valid
  // create accessToken and accessTokenExpiry
  const accessToken = await bcrypt.hash(email, 10);
  const accessTokenExpiry = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).toISOString();

  // update user with accessToken and accessTokenExpiry
  await db.collection(usersCollection).findOneAndUpdate(
    { email },
    {
      $set: {
        accessToken: accessToken,
        accessTokenExpiry: accessTokenExpiry
      }
    },
  );

  user = await db.collection(usersCollection).findOne({ email: email });
  return res.json(user);
}

export default Signin;