import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import prisma from '../../../lib/db'; // Adjust the path to your db.ts file
import type { NextApiRequest, NextApiResponse } from 'next';
import authOptions from '@/lib/auth'
import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';
import { google } from 'googleapis';



type AccountType = {
  id: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  providerAccountId: string;
};



export async function GET(req: NextRequest) {
    // Fetch the user session
    const session = await getServerSession(authOptions);
    // console.log("📆 Inside Calendar Route -> Session: ", session);
    
    // Ensure the user is authenticated and has a userId
    if (!session || !session.user) {
      return NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    }

    const userEmail = session.user.email;
    console.log("User Email inside Calendar Route: ", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    }

    try {
      // Retrieve the user ID based on their email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      // console.log("User inside Calendar Route: ", user);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, {status: 404});
      }

      const userId = user.id;

      // Fetch the access token from Prisma
      let account: AccountType | null = await prisma.account.findFirst({
        where: {
          userId: userId,
          provider: 'google',
        },
        select: {
          id: true,
          access_token: true,
          refresh_token: true,
          expires_at: true,
          providerAccountId: true,
        }
      });

      // console.log("📆 Inside Calendar Route -> Account: ", account);

      if (!account || !account.access_token) {
        return NextResponse.json({ error: 'No access token found.' }, {status: 400});
      }

      const accessToken = account.access_token;


      // const oAuth2Client = google.auth.fromJSON({…account, refresh_token: account.refresh_token || undefined});
      //   oAuth2Client.setCredentials({
      //       access_token: account.access_token,
      //       refresh_token: account.refresh_token
      //   });


      console.log("📆 Inside Calendar Route -> Access Token: ", accessToken);

      // Define the time range for events
      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(now.getMonth() + 1);
      const timeMin = new Date(now.setDate(now.getDate() - 7)).toISOString();
      const timeMax = oneMonthFromNow.toISOString();

      // Fetch events from Google Calendar
      const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log("📆 Inside Calendar Route -> Response: ", response);

      // const data = await response.json();

      if (response) {
        NextResponse.json(response, {status: 200});
  }
  } catch (error) {
    NextResponse.json({status: 405});
  }
}
