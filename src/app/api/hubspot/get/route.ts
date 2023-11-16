import prisma from '@/lib/db';
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";



export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {

    

    const session = await getServerSession(authOptions);
    // console.log("Session inside get-message Route: ", session);
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

    // Fetch HubSpot properties for the authenticated user
    const hubSpotProperties = await prisma.hubSpotProperty.findMany({
        where: {
            userId: userId
        }     
    });

    // const body = await req.json();
    // const token = body.callId;
    // console.log("Token inside Properties Route: ", token);


    
    // const response = await fetch('http://127.0.0.1:8000/properties', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         token
    //     }),
    //   });
    

    if (!hubSpotProperties) {
      return NextResponse.json({ error: 'Problem fetching Hubspot properties from Prisma' }, {status: 404});
    }
    console.log("Hubspot Properties", hubSpotProperties);
    return NextResponse.json(hubSpotProperties, {status: 200})
    
  } 
  catch (error) {
    console.error('Failed to get properties:', error);
    return NextResponse.json({ error: 'Failed to get properties' }, {status: 500});
  }

  } 
  else {
    return NextResponse.json({ error: 'Method not allowed' }, {status: 405});
  }
}
