import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import type { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';



export async function POST(req: Request) {
  if (req.method === 'POST') {

    const body = await req.json();
    const { name } = body
    console.log('POST inside create-group', name);
    
  

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    }

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        });

    
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, {status: 404});
        }

    const userId = user.id;

    const group = await prisma.group.create({
      data: {
        name: name,
        userId: userId,
      },
    });

    if (group) {
      return NextResponse.json(group, {status: 200});
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
  }
}
