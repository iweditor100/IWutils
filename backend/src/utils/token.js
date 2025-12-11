import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

// creating token utilities: 
export const createAccessToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SERVICE,
        { expiresIn : "15m" }
    );
};



export const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SERVICE,
        { expiresIn : "7d" },
    );
}


// hashing token utilities: 
export const hashToken = async (token) => {
    return await bcrypt.hash(token, 10);
}

export const compareToken = async (token, hash) => {
    return await bcrypt.compare(token, hash);
}