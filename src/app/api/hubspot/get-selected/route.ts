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
    // Retrieve the user ID based on their email
    const user = await prisma.user.findUnique({
        where: { email: userEmail! },
    });
    console.log("User inside Tokens Route: ", user);

    if (!user) {
        return NextResponse.json({message: "User not found"}, {status: 404})
    }

    const userId = user.id;
    
    const properties = await prisma.hubSpotProperty.findMany({
        where: {
            userId: userId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                label: true,
                type: true,
            },
    });

    if (!properties) {
        return NextResponse.json({message: "Properties not found"}, {status: 404})
    }


    // console.log(res)
    console.log("Selected Properties ", properties);
    return NextResponse.json(properties, {status: 200})
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
