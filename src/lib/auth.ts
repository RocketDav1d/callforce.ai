import { NextAuthOptions } from "next-auth"
import HubspotProvider from "next-auth/providers/hubspot";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import bcrypt from "bcrypt";



export const authOptions: NextAuthOptions = {
    // newly added
    // cookies: {
    //         sessionToken: {
    //             name: "next-auth.session-token",
    //             options: {
    //                 secure: process.env.NODE_ENV === 'production',
    //             },
    //         },
    //     },
    // old stuff
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in"
    },
    // Configure one or more authentication providers
    providers: [
        HubspotProvider({
        clientId: process.env.HUBSPOT_CLIENT_ID!,
        clientSecret: process.env.HUBSPOT_CLIENT_SECRET!
        }),
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // async profile(profile) {
        //     return {
        //         id: profile.id,
        //         name: profile.name,
        //         email: profile.email,
        //         image: profile.picture,
        //         username: profile.email
        //     }
        // }
        }),
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text", placeholder: "john@mail.com" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                return null
            }

            const existingUser = await prisma.user.findUnique({
                where: {email: credentials?.email}
            });
            if(!existingUser) {
                return null
            }

            if (existingUser.password) {
                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);
                if(!passwordMatch) {
                    return null
                }
            }


            // console.log(existingUser)

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email
            }

            }
        })

  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
    return baseUrl + '/admin';
        },
    async jwt({ token, user}) {
        // console.log("JWT callback", { token });

        // console.log(token)
        if (user) {
            return {
                ...token,
                username: user.username,
                // name: user.name,
            }
        }
        return token
      },
    async session({ session, token }) {
        // console.log(session)
        return {
            ...session,
            user: {
                ...session.user,
                username: token.username,
                // name: token.name,
            },
        }
    },
  }
}

export default authOptions