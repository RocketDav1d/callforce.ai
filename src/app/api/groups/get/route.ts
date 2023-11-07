import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import type { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get the current user's ID from the session or JWT
    const session = await getServerSession(authOptions);
    console.log("Session inside get Group: ", session);
  
    if (!session) {
      // NextResponse.json({ error: 'User not authenticated' }, {status: 401});
      return res.status(401).json({message: "User not authenticated"});
    } 
  
    const userEmail = session.user.email;
    console.log("User Email: ", userEmail);
  
    if (!userEmail) {
      // NextResponse.json({ error: 'User not authenticated' }, {status: 409});
      return res.status(409).json({message: "User not authenticated"});
    }

    // Fetch the user and their groups from the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        username: true,
        // Include other fields you want
        groups: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log(res)
    console.log("User Groups ", user.groups);
    return NextResponse.json({"groups": user.groups}, {status: 200})
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export { handler as GET }
