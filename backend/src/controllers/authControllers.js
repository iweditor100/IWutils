import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/prismaClient.js";
import { createAccessToken, createRefreshToken, hashToken, compareToken } from "../utils/token.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// GOOGLE LOGIN
export const googleLogin = async (req, res) => {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub, email, name, picture } = ticket.getPayload();

    // find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name,
                email,
                picture,
                googleId: sub
            }
        });
    }

    // create tokens
    const newRefreshToken = createRefreshToken(user);
    const newAccessToken = createAccessToken(user);
    const hashed = await hashToken(newRefreshToken);

    // delete old refresh tokens
    await prisma.refreshToken.deleteMany({
        where: { userId: user.id }
    });

    // store hashed refresh token
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: hashed,
            expiresAt: new Date(Date.now() + 7 * 24 * 3600000) // 7 days
        }
    });

    // set cookie
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 3600000
    });

    return res.json({
        message: "Login Success",
        accessToken: newAccessToken,
        user
    });
};



// REFRESH TOKEN (ROTATION)
export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    // 1. Verify Signature
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SERVICE);
    } catch (e) {
        return res.sendStatus(403);
    }

    // 2. Find Token in DB (by User ID)
    const stored = await prisma.refreshToken.findFirst({
        where: { userId: decoded.id }
    });

    if (!stored) return res.sendStatus(403); // No token record for this user

    // 3. Security: Compare Hash (Make sure this is the VALID token we issued)
    const isValid = await compareToken(token, stored.tokenHash);
    if (!isValid) return res.sendStatus(403);

    // 4. User Check
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.sendStatus(404);

    // 5. Stable Refresh: Issue new Access Token (Keep Refresh Token alive)
    const newAccessToken = createAccessToken(user);

    return res.json({
        message: "Refreshed",
        accessToken: newAccessToken,
        user
    });
};



// LOGOUT
export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SERVICE);
            await prisma.refreshToken.deleteMany({
                where: { userId: decoded.id }
            });
        } catch {
            console.log("Error in logout controller while deleting refresh token");
        }
    }

    res.clearCookie("refreshToken");

    return res.json({
        message: "Logout Success"
    });
};
