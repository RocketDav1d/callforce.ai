import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse ) {
  if (req.method === 'POST') {

    const body = await req.json();
    const callId = body.callId;

    // console.log("Chat ID inside get chat: ", callId);

    // get userID from session
    const session = await getServerSession(authOptions);

    // console.log("Session inside get chat: ", session);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    }
    
    const userEmail = session.user.email;
    if (!userEmail) {
    return NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    }
  
    // Retrieve the user ID based on their email
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, {status: 404});
    }
    const userId = user.id;

    const chat = await prisma.chat.findUnique({
        where: { 
            id: callId, 
            user: {
                id: userId
            }
        },
    });
    // console.log("Chats inside get chat: ");

    if (!chat) {
        return NextResponse.json({ error: 'Chats not found for this user' }, {status: 404});
      }

    return NextResponse.json(chat, {status: 200});


  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
