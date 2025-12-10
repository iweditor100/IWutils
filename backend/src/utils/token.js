import jwt from "jsonwebtoken"


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