import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(Request : Request, { params } : { params : { jobId : string } }) {
    try {
        const job = await prisma.job.findUnique({
            where : {
                id : Number(params.jobId)
            },

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
                },
                applications : true
            }
        })

        if(!job) {
            return NextResponse.json({
                error : "Job not found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            message : "Job retrieved successfully",
            data : job 
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

export async function PUT(Request : Request, { params } : { params : { jobId : string } }) {
    try {
        const data = await Request.json();

        const { title, description, requirements, location, jobType, companyName } = data;

        const job = await prisma.job.findFirst({
            where : {
                id : Number(params.jobId)
            }
        })

        if(!job) {
            return NextResponse.json({
                error : "Job not found"
            }, {
                status : 404
            })
        }

        const jobData = {
            title : job.title,
            description : job.description,
            requirements : job.requirements,
            location : job.location,
            jobType : job.jobType,
            companyName : job.companyName
        }

        if(title) {
            jobData.title = title;
        }

        if(description) {
            jobData.description = description;
        }

        if(requirements) {
            jobData.requirements = requirements;
        }

        if(location) {
            jobData.location = location;
        }

        if(jobType) {
            jobData.jobType = jobType;
        }

        if(companyName) {
            jobData.companyName = companyName;
        }

        await prisma.job.update({
            where : {
                id : Number(params.jobId)
            },
            data : jobData
        })

        return NextResponse.json({
            message : "Job updated successfully",
            data : jobData
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

export async function DELETE(Request : Request, { params } : { params : { jobId : string } }) {
    try {
        const job = await prisma.job.findUnique({
            where : {
                id : Number(params.jobId)
            }
        })

        if(!job) {
            return NextResponse.json({
                error : "Job not found"
            }, {
                status : 404
            })
        }

        await prisma.job.delete({
            where : {
                id : Number(params.jobId)
            }
        })

        // remove from user
        await prisma.user.update({
            where : {
                id : job.userid
            },

            data : {
                jobs : {
                    disconnect : {
                        id : job.id
                    }
                }
            }
        })

        return NextResponse.json({
            message : "Job deleted successfully"
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