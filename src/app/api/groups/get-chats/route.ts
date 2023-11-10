import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import type { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";


export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    const groupId = req.nextUrl.searchParams.get('groupId');
    // Get the current user's ID from the session or JWT
    const session = await getServerSession(authOptions);
    console.log("Session inside get Group: ", session);
  
    if (!session) {
      return NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    } 
  
    const userEmail = session.user.email;
    console.log("User Email: ", userEmail);
  
    if (!userEmail) {
      return  NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    //   return res.status(409).json({message: "User not authenticated"});
    }


    const groupWithChats = await prisma.group.findUnique({
        where: {
          id: groupId!,
          user : {
            email: userEmail
          } // replace groupId with the actual id of the group
        },
        include: {
          chats: true, // This will include all the chats associated with the group
        },
      });
      

    if (!groupWithChats) {
      return NextResponse.json({ error: 'Group not found' }, {status: 404});
    //   return res.status(404).json({ message: 'User not found' });
    }

    // console.log(res)
    console.log("User Groups ", groupWithChats);
    return NextResponse.json(groupWithChats, {status: 200})
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
    // res.status(405).json({ message: 'Method not allowed' });
  }
}

export { handler as GET }
