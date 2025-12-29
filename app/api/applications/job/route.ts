import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(request : Request, { params } : { params : { jobId : string } }) {
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