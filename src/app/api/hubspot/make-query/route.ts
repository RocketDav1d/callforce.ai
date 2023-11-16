import { NextResponse, NextRequest } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prisma from '../../../../lib/db';  // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';





export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Body inside Hubspot query route: ", body);
    // get userID from session
    const session = await getServerSession(authOptions);
    console.log("Session inside Hubspot query Route: ", session);
    if (!session) {
      return NextResponse.json({message: "User not authenticated"}, {status: 401});
    }
    const userEmail = session.user.email;
    console.log("UserEmail inside Hubspot query Route: ", userEmail);
    if (!userEmail) {
      return NextResponse.json({message: "User not authenticated"}, {status: 409});
    }
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    console.log("User inside Hubspot query Route: ", user);
    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404});
    }
    const userId = user.id;
    console.log("UserId inside Hubspot query Route: ", userId);


    const { properties, s3_key } = body;
    console.log("Properties inside Hubspot query route: ", properties);
    if (!properties) {
      return NextResponse.json({ error: 'Missing required parameters' }, {status: 400});
    }

    console.log("Properties inside Hubspot query route: ", properties, "and UserId: ", userId);

    const response = await fetch('https://callforce-worker-07ee47d87df1.herokuapp.com/hubspot/properties/query', {
    // const response = await fetch('http://127.0.0.1:8000/hubspot/properties/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties,
        s3_key,
        userId,
      }),
    });

    console.log("RESPONSE inside Hubspot query route: ", properties);

    if (!response.ok) {
      return NextResponse.json({ error: `Hi there - Request failed with status ${response.status}` }, {status: response.status});
    }

    const properties_data = await response.json();
    const chatId = uuidv4();
    return NextResponse.json(properties_data, {status: 200 });

} catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, {status: 500});
  }
}


