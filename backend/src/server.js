import express from "express"
import imagesRoute from "./routes/imagesRoute.js";
import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors({origin: "*"}));



app.get("/", (req, res) => {
    res.send("Backend running here")
})

app.use("/images", imagesRoute);
app.listen(4000, () => {
    console.log("Server running on http//localhost:4000");
})