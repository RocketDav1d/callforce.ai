// pages/api/create-chat.js
import prisma from '@/lib/db';
import { getSession } from 'next-auth/react';
import { NextResponse } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto';

export async function POST(req: Request, res: NextResponse) {
  if (req.method === 'POST') {

    const body = await req.json();
    const { content, chatId, role } = body; // Add the content and role fields to your request body
    console.log('POST inside create-message', body);
    
    
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
      const message = await prisma.message.create({
        data: {
          chatId, // Assuming this is passed from the client and exists in the DB
          content, // The content of the message
          role,    // The role (USER or SYSTEM)
        },
      });

    return NextResponse.json(message, {status: 200});
    } catch (error) {
      console.error('Failed to create message:', error);
      return NextResponse.json({ error: 'Failed to create message' }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
