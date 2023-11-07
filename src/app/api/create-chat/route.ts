// pages/api/create-chat.js
import prisma from '@/lib/db';
import { getSession } from 'next-auth/react';
import { NextResponse } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(req: Request, res: NextResponse) {
  if (req.method === 'POST') {

    const body = await req.json();
    const { chatId, fileKey, chatName, summary, transcript, pdfUrl, groupId } = body;

    console.log('POST inside create-chat', body);
    
    // get userID from session
    const session = await getServerSession(authOptions);
    console.log("Session inside Extract Route: ", session);
  
    if (!session) {
      return NextResponse.json({message: "User not authenticated"}, {status: 401});
    }
  
    const userEmail = session.user.email;
  
    if (!userEmail) {
      return NextResponse.json({message: "User not authenticated"}, {status: 409});
    }
    // Retrieve the user ID based on their email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404});
    }
    const userId = user.id;

    try {
      const chat = await prisma.chat.create({
        data: {
          id: chatId,
          fileKey,
          chatName,
          summary,
          transcript,
          pdfUrl,
          userId: userId, // Use the user ID from the session
          groupId,
        },
      });

    return NextResponse.json(chat, {status: 200});
    } catch (error) {
      console.error('Failed to create chat:', error);
      return NextResponse.json({ error: 'Failed to create chat' }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
