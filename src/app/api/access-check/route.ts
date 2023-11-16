// pages/api/access-check.js
import prisma from '@/lib/db'; 
import { getSession } from 'next-auth/react';
import { NextResponse, NextRequest } from "next/server";
import { JWT, getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Session as NextAuthSession } from "next-auth";
import { NextApiRequest } from 'next';



type Props = {
    params: {
    callId: string;
    };
};

interface CustomSession extends JWT {
    user: {
      name: string;
      email: string;
      image?: string;
      username?: string | null;
    };
  }





  export async function GET(req: NextRequest) {
    // Extract the callId from the URL search parameters
    const callId = req.nextUrl.searchParams.get('callId');
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as CustomSession;

    console.log("Session inside access-check:", session); // Debugging
    console.log('Call ID:', callId);


    if (!callId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Perform the access check using Prisma
    const canAccess = await checkUserAccessToCall(session, callId);

    return NextResponse.json({ canAccess }, { status: 200 });
}


async function checkUserAccessToCall(session: CustomSession, callId: string) {

    if (!session) {
        console.log("Session or session.email not found");
        return false;
    }

    // Retrieve the user based on their email from the session
    const user = await prisma.user.findUnique({
        where: { email: session.email! },
    });
    console.log("User inside middleware:", user); // Debugging

    if (!user) {
        console.log("User not found");
        return false;
    }

    // Check if the user has access to the specified call
    const chat = await prisma.chat.findUnique({
        where: { 
            id: callId, 
            userId: user.id // Adjust the field names based on your schema
        },
    });

    console.log("Chat inside middleware:", chat); // Debugging


    const hasAccess = !!chat;
    console.log("User has access:", hasAccess);
    return hasAccess;

}
