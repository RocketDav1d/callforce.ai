import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';

// Define a schema for input validation

const UserSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
})


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = UserSchema.parse(body);

        // check if email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: {email: email}
        });
        if (existingUserByEmail) {
            return NextResponse.json({
                user: null,
                message: "User wiuth this mail already exists"
            }, {status: 409})
        }

        // check if email already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: {username: username}
        });
        if (existingUserByUsername) {
            return NextResponse.json({
                user: null,
                message: "User wiuth this username already exists"
            }, {status: 409})
        }

        const hashedPassword = await hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const { password: newUserPasswor, ...rest } = newUser;

        return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "something went wrong"}, {status: 500})
    }
}