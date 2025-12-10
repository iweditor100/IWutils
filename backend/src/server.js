import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser';

import imagesRoute from "./routes/imagesRoute.js";
import authRoutes from "./routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser);

app.use(cors({
    origin: "http://localhost:4001",
    credentials: true
}));



app.get("/", (req, res) => {
    res.send("Backend running here")
})

// Routes: 
app.use("/images", imagesRoute);
app.use("/auth", authRoutes);


app.listen(4000, () => {
    console.log("Server running on http//localhost:4000");
})