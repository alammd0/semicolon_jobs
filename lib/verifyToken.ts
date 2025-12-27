import { CustomJwtPayload } from "@/types/jwt";
import jwt from "jsonwebtoken";

export default function verifyToken(token : string) : CustomJwtPayload | false {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        return decoded
    }
    catch (error) {
        return false
    }
}