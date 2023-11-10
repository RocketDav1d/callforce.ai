import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import type { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {
    // Get the current user's ID from the session or JWT
    const session = await getServerSession(authOptions);
    // console.log("Session inside get Group: ", session);
  
    if (!session) {
      NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    } 
  
    const userEmail = session!.user.email;
    // console.log("User Email: ", userEmail);
  
    if (!userEmail) {
      NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    }

    

    // Fetch the user and their groups from the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
      select: {
        id: true,
        name: true,
        username: true,
        // Include other fields you want
        groups: true,
      },
    })


    if (!user) {
      return NextResponse.json({ error: 'User not found' }, {status: 404});
    }

    // console.log(res)
    console.log("User Groups ", user.groups);
    return NextResponse.json({"groups": user.groups}, {status: 200})
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
