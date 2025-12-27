import z from "zod";


// Auth Related
export const signupSchema = z.object({
    name : z.string(),
    email : z.email(),
    password : z.string(),
    role : z.enum(["JOB_SEEKER", "EMPLOYEE", "ADMIN"])
})

export const loginSchema = z.object({
    email : z.email(),
    password : z.string()
})

// JOb Related 
export const jobSchema = z.object({
    title : z.string(),
    description : z.string(),
    requirements : z.string(),
    location : z.string(),
    jobType : z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT"]),
    companyName : z.string()
})