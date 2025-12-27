import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(Request : Request, { params } : { params : { jobId : string } }) {
    try {

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

    }
    catch (error){
        return NextResponse.json({
            error : error
        }, {
            status : 500
        })
    }
}