import express from "express"
import {  OAuth2Client  } from 'google-auth-library'
import {prisma} from '../../prisma/prismaClient.js'
import { createAccessToken, createRefreshToken } from "../utils/token.js"
import jwt from "jsonwebtoken"

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async(req, res) => {
    try {
        const { credential } = req.body;


        // verifying the google id token: 
        const ticket = await client.verifyIdToken({
            idToken: credential, 
            audience: process.env.GOOGLE_CLIENT_ID,
        });


        const payload = ticket.getPayload();
        const {sub, email, name, picture} = payload;



        // Check if user exists  in the db 
        let user = await prisma.user.findUnique({
            where: {email}
        })



        if(!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email, 
                    picture, 
                    googleId: sub
                }
            })
        }


        // Generate token: 
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);


        // Set secure httpOnly cookie for refresh token: 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        
        // Send response: 
        res.json({
            message: "Login Success",
            accessToken,
            user
        })
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: "Invalid Google Token" });

    }
})


router.get("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SERVICE, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = createAccessToken({ id: user.id });

        res.json({ accessToken });
    });
})



router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.json({
        message: "Logout Success!"
    })
})


export default router;