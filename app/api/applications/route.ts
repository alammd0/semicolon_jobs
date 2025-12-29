import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import verifyToken from "@/lib/verifyToken";


// this is for getting all applications
export async function GET(request : Request) {
    try {
        const application = await prisma.application.findMany({
            select : {
                id : true,
                status : true,
                created : true,
                user : {
                    select : {
                        id : true,
                        name : true,
                    }
                },
                job : {
                    select : {
                        title : true,
                        location : true,
                        jobType : true,
                        companyName : true
                    }
                }
            }
        });

        if(!application) {
            return NextResponse.json({
                error : "No applications found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            message : "Applications retrieved successfully",
            data : application
        }, {
            status : 200
        })
    }
    catch (error){
        return NextResponse.json({
            error : error
        }, {
            status : 500
        })
    }
}

// TODO
export async function POST(request : Request, { params } : { params : { jobId : string } }) {
    try {
        
        const token = request.headers.get("authorization");

        if(!token) {
            return NextResponse.json({
                error : "Missing authorization token"
            }, {
                status : 401
            })
        }

        const decoded = verifyToken(token);

        if(!decoded) {
            return NextResponse.json({
                error : "Invalid authorization token"
            }, {
                status : 401
            })
        }

        const userId = decoded.id;

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            },
            select : {
                id : true,
                name : true,
                role : true
            }
        })

        if(!user) {
            return NextResponse.json({
                error : "Invalid user"
            }, {
                status : 401
            })
        }
        
        const application = await prisma.application.create({
            data : {
                status : "PENDING",
                userId : Number(user.id),
                jobId : Number(params.jobId)
            }
        })

        // update user
        await prisma.user.update({
            where : {
                id : userId
            },

            data : {
                applications : {
                    connect : {
                        id : application.id
                    }
                }
            }
        });

        return NextResponse.json({
            message : "Application created successfully",
            data : application
        })
    }
    catch(error){
        return NextResponse.json({
            error : error
        }, {
            status : 500
        })
    }
}