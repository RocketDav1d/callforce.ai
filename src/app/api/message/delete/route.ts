// pages/api/create-chat.js
import prisma from '@/lib/db';
import { NextResponse } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(req: Request, res: NextResponse) {
  if (req.method === 'POST') {

    const chatId = await req.json();


    try {
      const deleted_message = await prisma.message.delete({
        where: {
          id: chatId,
        },
      });

    return NextResponse.json(deleted_message, {status: 200});
    } catch (error) {
      console.error('Failed to delete message:', error);
      return NextResponse.json({ error: 'Failed to delete message' }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
