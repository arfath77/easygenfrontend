import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { email, password, name } = JSON.parse(req.body);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!, // Use the secret API_KEY server-side
        },
        body: JSON.stringify({ email, password, name }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return res.status(data.status).json({ message: data.message });
    }

    const data = await response.json();
    res.setHeader(
      'Set-Cookie',
      `access_token=${data.accessToken}; HttpOnly; Secure; SameSite=None; Path=/`
    );
    return res.status(200).json(data); // Send the response data back to the client
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}
