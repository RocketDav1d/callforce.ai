import { NextResponse, NextRequest } from "next/server";
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/db';  // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';





export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    console.log('POST inside extract route', body);

    // const { s3_key, hubspot_access_token, hubspot_refresh_token } = body;
    const { s3_key } = body;

    // console.log({ s3_key, hubspot_access_token, hubspot_refresh_token });

    // || !hubspot_access_token || !hubspot_refresh_token
    if (!s3_key) {
      return NextResponse.json({ error: 'Missing required parameters' }, {status: 400});
    }

    console.log('Inside extract route');


    // hubspot_access_token,
    // hubspot_refresh_token,
    const response = await fetch('http://127.0.0.1:8000/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s3_key,
        userId,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Hi there - Request failed with status ${response.status}` }, {status: response.status});
    }
    console.log("Response inside extract route: ", response);
    const data = await response.json();
    const chatId = uuidv4();
    return NextResponse.json({ ...data, chatId: chatId }, {status: 200 });
} catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, {status: 500});
  }
}








// export async function POST(req: Request) {
//     const body = await req.json();
//     console.log('POST', body)

//         try {
//             const parsedBody = JSON.parse(body);

//             console.log("Parsed Body: ", parsedBody);

//             const { s3_key, hubspot_access_token, hubspot_refresh_token } = req.body;

//             console.log("inside extract route")

//             console.log({ "s3_key": s3_key, 
//                         "hubspot_access_token": hubspot_access_token, 
//                         "hubspot_refresh_token": hubspot_refresh_token });
    
//             const response = await fetch('http://127.0.0.1:8000/extract', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 s3_key,
//                 hubspot_access_token,
//                 hubspot_refresh_token,
//             }),
//             });
    
//             if (!response.ok) {
//             throw new Error(`Request failed with status ${response.status}`);
//             }
    
//             const data = await response.json();
//             res.status(200).json(data);
//         } 
//         catch (error) {
//             console.error('Request error:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }

// }






// old shit -> 


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//     console.log("Inside extract route:", req.method, "<");

//     if (req.method?.toLowerCase() === 'POST') {
//       console.log('POST', req.body)
//       const rawBody = await getRawBody(req.body);
//       const body = JSON.parse(rawBody.toString());
//       console.log('Body:', body);
//       res.status(200).json({ status: 'success' });
//     } else {
//       res.status(405).json({ error: 'Method not allowed' });
//     }
//   }
    








// export const POST = async (req: { method: string; json: () => any; }) => {
//     if (req.method === 'POST') {

//         const body = await req.json()
//         console.log('PATCH', body)
//         const access_token = body.s3_key;
//         console.log("Access Token: ", access_token);
//     }
// }

// export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

//     console.log("inside GET handler with method:", req.method, "<");

//     res.status(200).json({ message: 'Handler reached!' });
//   }
