import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { JobType } from "@prisma/client";

export async function GET(request : Request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get("query") || "";
        const location = searchParams.get("location");
        const jobTypeParam = searchParams.get("jobType");
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;

        const skip = (Number(page) - 1) * Number(limit);

        const jobType = jobTypeParam && Object.values(JobType).includes(jobTypeParam as JobType)
                        ? (jobTypeParam as JobType) : undefined;


        const jobs = await prisma.job.findMany({
            where : {
                AND : [
                    query ? {
                        OR: [
                            { 
                                title: { 
                                    contains: query, mode: "insensitive" 
                                } 
                            },
                            { 
                                description: { 
                                    contains: query, mode: "insensitive" 
                                } 
                            },
                        ],
                    } : {},

                    location ? {
                        location
                    } : {},

                    jobType ? {
                        jobType : jobType
                    } : {}
                ]
            },
            skip : skip,
            take : Number(limit),
            orderBy : {
                created : "desc"
            }
        });

        if(!jobs) {
            return NextResponse.json({
                error : "No jobs found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            message : "Jobs retrieved successfully",
            data : jobs
        }, {
            status : 200
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