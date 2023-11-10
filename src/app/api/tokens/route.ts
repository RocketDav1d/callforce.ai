
// // src/app/api/tokens/route.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from '../../../lib/db';  // Adjust the path as needed
// import authOptions from '@/lib/auth'
// import { getServerSession } from 'next-auth'
// import { NextResponse } from "next/server";
// import axios from 'axios'



// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log('Tokens API Route Hit');


//   console.log("Cookies: ", req.cookies)
//   const session = await getServerSession(authOptions);
//   console.log("Session: ", session);

//   if (!session) {
//     return NextResponse.json({message: "User not authenticated"}, {status: 401})
//   }

//   const userEmail = session.user.email;
//   console.log("User Email: ", userEmail);

//   if (!userEmail) {
//     return NextResponse.json({message: "User not authenticated"}, {status: 409})
//   }


//   try {
//     // Retrieve the user ID based on their email
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });
//     console.log("User: ", user);

//     if (!user) {
//       return NextResponse.json({message: "User not found"}, {status: 404})
//     }

//     const userId = user.id;

//     // Fetch the associated account using the user ID
//     const account = await prisma.account.findFirst({
//       where: {
//         userId: userId,
//         provider: 'hubspot',
//       },
//       select: {
//         access_token: true,
//         refresh_token: true
//       }
//     });

//     console.log("Account: ", account);

//     if (!account) {
//     return NextResponse.json({message: "Tokens not found"}, {status: 404})
//     }

//     const currentTime = Math.floor(Date.now() / 1000);
//     if (account.expires_at < currentTime) {
//       console.log("Access token is expired. Refreshing token...");


//     return NextResponse.json({"account": account}, {status: 200})
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({message: "Internal Server Error"}, {status: 500})
//   }
// }

// export { handler as GET }

type AccountType = {
  id: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  providerAccountId: string;
};

type HubSpotTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};


import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/db';  // Adjust the path as needed
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import axios from "axios";
import qs from 'qs';
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {

  console.log('Tokens API Route Hit');

  const session = await getServerSession(authOptions);
  console.log("Session inside Tokens Route: ", session);

  if (!session) {
    return NextResponse.json({message: "User not authenticated"}, {status: 401})
  }

  const userEmail = session.user.email;
  console.log("User Email: ", userEmail);

  if (!userEmail) {
    return NextResponse.json({message: "User not authenticated"}, {status: 409})
  }

  try {
    // Retrieve the user ID based on their email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    console.log("User inside Tokens Route: ", user);

    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404})
    }

    const userId = user.id;

    // Fetch the associated account using the user ID
    let account: AccountType | null = await prisma.account.findFirst({
      where: {
        userId: userId,
        provider: 'hubspot',
      },
      select: {
        id: true,
        access_token: true,
        refresh_token: true,
        expires_at: true,
        providerAccountId: true,
      }
    });

    console.log("Account inside Tokens Route: ", account);

    if (!account) {
      return NextResponse.json({message: "Tokens not found"}, {status: 404})
    }

    // new code
    const currentTime = Math.floor(Date.now() / 1000);
    if (account.expires_at && account.expires_at < currentTime) {
      console.log("Access token is expired. Refreshing token...");

      // Implement your logic to refresh the access token here
      // The following is just an example and you should replace it with the actual logic
      const response = await axios.post('https://api.hubapi.com/oauth/v1/token', qs.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
        refresh_token: account.refresh_token,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const newTokenData = response.data;
      console.log("New Token Data inside Tokens Route: ", newTokenData);

      account = await prisma.account.update({
        where: {
          // provider_providerAccountId: {
          //   provider: 'hubspot',
          //   providerAccountId: 'yourProviderAccountId', // Replace with the actual providerAccountId
          // },
          id: account.id, 
        },
        data: {
          access_token: newTokenData.access_token,
          expires_at: currentTime + newTokenData.expires_in,
          refresh_token: newTokenData.refresh_token || account.refresh_token,
        },
        select: {
          id: true,
          access_token: true,
          refresh_token: true,
          expires_at: true,
          providerAccountId: true,

        }
      });
    }

    return NextResponse.json({"account": account}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
  }
}

// export { handler as GET }