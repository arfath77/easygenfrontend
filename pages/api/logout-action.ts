import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    res.setHeader(
      'Set-Cookie',
      `access_token='; HttpOnly; Secure; SameSite=None; Path=/`
    );
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}
