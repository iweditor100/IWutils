import jwt from "jsonwebtoken"
import { prisma } from "../../prisma/prismaClient";
export const authMiddleware = async(req, res, next) => {
    try {
        // extract the  auth header first; 
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                success: false,
                message: "authorization header missing"
            });
        }


        // Must be: Bearer <token>
        const parts = authHeader.split(" ");
        if(parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format, check the token!"
            })
        }


        const token = parts[1];
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Access Token missing in authorization headers"
            })
        }


        // Verifying the token: 
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SERVICE, {
                clockTolerance: 5, //Industry standard.
            })
        } catch(err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token"
            })
        }


        // User existence check:
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
        });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or removed!"
            })
        }


        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
        }


        // hand over to next : 
        next();
    } catch(err) {
        console.error("authMiddleware error: ", err);
        return res.status(500).json({
            success: false,
            message: "Authentication middleware error!"
        })
    }
}