import { NextResponse, NextRequest } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/db';  // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';

export const maxDuration = 20


export async function POST(req: NextRequest, res: NextResponse) {
  try {

    const body = await req.json();
    console.log('POST inside send-prompt route', body);


    // get userID from session
    const session = await getServerSession(authOptions);
    console.log("Session inside Send-Propmt Route: ", session);
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
  

    const { data: { prompt }, file_key } = body;
    const request_body = JSON.stringify({
      file_key,
      userId,
      prompt
    })
    console.log(request_body)
    const response = await fetch('https://callforce-worker-07ee47d87df1.herokuapp.com/prompt', {
    // const response = await fetch('http://127.0.0.1:8000/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request_body,
    });



    if (!response.ok) {
      return NextResponse.json({ error: `Hi there - Request failed with status ${response.status}` }, {status: response.status});
    }


    const data = await response.json();
    console.log('Data inside send-prompt route', data);
    return NextResponse.json({data}, {status: 200 });
} catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, {status: 500});
  }
}
