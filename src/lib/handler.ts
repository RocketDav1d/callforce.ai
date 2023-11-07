// src/app/api/user/[userId]/tokens.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/db';  // Adjust the path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const account = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
              provider: 'hubspot',
              providerAccountId: userId
            }
          },
        select: {
            access_token: true,
            refresh_token: true
        }
    });

    if (!account) {
      return res.status(404).json({ error: 'Tokens not found' });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
