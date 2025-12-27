import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jobSchema } from "@/lib/zod";
import verifyToken from "@/lib/verifyToken";


export async function GET(request : Request) {
    try {
        const allJobs = await prisma.job.findMany({
            select : {
                id : true,
                title : true,
                description : true,
                location : true,
                jobType : true,
                companyName : true,
                created : true,
                user : {
                    select : {
                        id : true,
                        name : true,
                    }
                }
            }
        });

        if(!allJobs) {
            return NextResponse.json({
                error : "No jobs found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            message : "Jobs retrieved successfully",
            data : allJobs
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

export async function POST(request : Request) {
    try {
        const data = await request.json();

        const { title, description, requirements, location, jobType, companyName } = jobSchema.parse(data);

        if(!title || !description || !requirements || !location || !jobType || !companyName) {
            return NextResponse.json({
                error : "Missing required fields"
            }, {
                status : 400
            })
        }

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

        const job = await prisma.job.create({
            data : {
                title : title,
                description : description,
                requirements : requirements,
                location : location,
                jobType : jobType,
                companyName : companyName,
                userid : Number(user.id)
            }
        })

        return NextResponse.json({
            message : "Job created successfully",
            data : {
                id : job.id,
                title : job.title,
                description : job.description,
                requirements : job.requirements,
                location : job.location,
                jobType : job.jobType,
                companyName : job.companyName,
                created : job.created,
                user : {
                    id : user.id,
                    name : user.name
                }
            }
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