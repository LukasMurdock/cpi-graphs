// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { code } from '@/utils/magicNumbers';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(code.ok).json({ name: 'John Doe' });
}
