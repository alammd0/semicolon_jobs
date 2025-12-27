import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(request : Request) {
    try {
        const data = await request.json();
        const { email, password } = await request.json();

        if(!email || !password) {
            return NextResponse.json({
                error : "Missing required fields"
            }, {
                status : 400
            })
        }

        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        });

        if (!user) {
            return NextResponse.json({
                error : "User not found"
            }, {
                status : 400
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({
                error : "Invalid password"
            }, {
                status : 400
            })
        }

        // create a new access token
        const payload = {
            id : user.id,
            name : user.name,
            role : user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn : "1h"
        });

        return NextResponse.json({
            message : "Login successful",
            data : {
                token : token
            }
        }, {
            status : 200
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