import express from 'express'
import multer from "multer";
import { uploadImages } from '../controllers/imageUpload.js';


const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});


router.post("/upload", uploadImages);

export default router;





