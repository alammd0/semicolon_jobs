import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signupSchema } from "@/lib/zod";
import bcrypt from "bcryptjs"

export async function POST(request : Request) {
    try {

        const data = await request.json();
        const { name, email, password, role } = signupSchema.parse(data);

        if(!name || !email || !password || !role) {
            return NextResponse.json({
                error : "Missing required fields"
            }, {
                status : 400
            })
        }

        const existingUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if (existingUser) {
            return NextResponse.json({
                error : "User already exists"
            }, {
                status : 400
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data : {
                name : name,
                email : email,
                password : hashedPassword,
                role : role
            }
        })

        return NextResponse.json({
            message : "User created successfully",
            data : {
                id : user.id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        }, {
            status : 201
        })
    }
    catch (error) {
        return NextResponse.json({
            error : error
        }, {
            status : 500
        })
    }
}