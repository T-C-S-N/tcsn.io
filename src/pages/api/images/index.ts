// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dropbox from '@/lib/dropbpox'

const GetImages = async (req: NextApiRequest, res: NextApiResponse) => {
  const images = await dropbox.filesListFolder({ path: '' })
    .catch(function (err: any) {
      return res.status(401).json({ message: err });
    });
  return res.json(images);
};

export default GetImages;