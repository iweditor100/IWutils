import dotenv from 'dotenv'
dotenv.config(); 
import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser';

import imagesRoute from "./routes/imagesRoute.js";
import authRoutes from "./routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));



app.get("/", (req, res) => {
    res.send("Backend running here")
})

// Routes: 
app.use("/images", imagesRoute);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})