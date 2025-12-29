import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { applicationSchema } from "@/lib/zod";


export async function GET(request : Request, { params } : { params : { applicationId : string } }) {
    try {
        const application = await prisma.application.findUnique({
            where : {
                id : Number(params.applicationId)
            },
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
                }
            }
        });

        if(!application) {
            return NextResponse.json({
                error : "Application not found"
            }, {
                status : 404
            })
        }

        return NextResponse.json({
            message : "Application retrieved successfully",
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

// application status can be updated : Accepted or Rejected
export async function PUT(request : Request, { params } : { params : { applicationId : string } }) {
    try {

        const data = await request.json();

        const { status } = applicationSchema.parse(data);

        if(!status) {
            return NextResponse.json({
                error : "Missing status"
            }, {
                status : 400
            })
        }

        const application = await prisma.application.findUnique({
            where : {
                id : Number(params.applicationId)
            }
        });

        if(!application) {
            return NextResponse.json({
                error : "Application not found"
            }, {
                status : 404
            })
        }

        const applicationData = {
            status : status
        }

        await prisma.application.update({
            where : {
                id : Number(params.applicationId)
            },
            data : applicationData
        })

        return NextResponse.json({
            message : "Application updated successfully",
            data : applicationData
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

export async function DELETE(request : Request, { params } : { params : { applicationId : string } }) {
    try {
        const application = await prisma.application.findUnique({
            where : {
                id : Number(params.applicationId)
            }
        });

        if(!application) {
            return NextResponse.json({
                error : "Application not found"
            }, {
                status : 404
            })
        }

        await prisma.application.delete({
            where : {
                id : application.id
            }
        });

        // remove from user
        await prisma.user.update({
            where : {
                id : application.userId
            },

            data : {
                applications : {
                    disconnect : {
                        id : application.id
                    }
                }
            }
        })

        return NextResponse.json({
            message : "Application deleted successfully"
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