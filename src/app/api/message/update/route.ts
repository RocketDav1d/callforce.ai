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

    const { chatId, content } = body; // Add the content and role fields to your request body
    console.log('POST inside update-message', body);
    
    
    try {
      const message = await prisma.message.update({
        where: {
          id: chatId,
        },
        data: {
          content, // The content of the message
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
