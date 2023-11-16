// pages/calls/_middleware.js

// import { NextResponse, NextRequest } from 'next/server';
// import { JWT, getToken } from 'next-auth/jwt';
// import prisma from '@/lib/db'; // Adjust this import to match your prisma client path
export { default } from "next-auth/middleware"











// interface Session extends JWT {
//     user: {
//         name: string;
//         email: string;
//         image: string;
//         username: string | null;
//       }
// }

  

// export async function middleware(req: NextRequest) {
//     console.log("📞 Inside Calls Middleware");
//     // const session = await getToken({ req, secret: process.env.SECRET }) as Session
//     // console.log("Session inside middleware:", session); // Debugging
//     const callId = req.nextUrl.pathname.split('/').pop();
//     console.log("Call ID inside middleware:", callId); // Debugging

//     const url = `${req.nextUrl.origin}/api/access-check?callId=${callId}`;
//     console.log('Fetching URL:', url);  // Debugging log
//     const accessCheckResponse = await fetch(url, {
//         headers: {
//           'Cookie': req.headers.get('cookie') || ''
//         }
//       });
//     const result = await accessCheckResponse.json();

//     if (!result.canAccess) {
//         return NextResponse.redirect(new URL('/unauthorized', req.url));
//       }

//     return NextResponse.next();
// }



// export const config = {
//     matcher: '/calls/:path*',
//   }
  