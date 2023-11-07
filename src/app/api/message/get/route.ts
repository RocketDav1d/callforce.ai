// pages/api/create-chat.js
import prisma from '@/lib/db';
import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {


    const body = await req.json();
    const chatId = body.chatId;

    
    // get userID from session
    const session = await getServerSession(authOptions);
    console.log("Session inside get-message Route: ", session);
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
      const messages = await prisma.message.findMany({
        where: {
          chatId: chatId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return NextResponse.json(messages, {status: 200});
    } catch (error) {
      console.error('Failed to get messages:', error);
      return NextResponse.json({ error: 'Failed to get messages' }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
