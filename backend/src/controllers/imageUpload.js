import fs from "fs";
import path from "path";
import Busboy from "busboy";

const UPLOAD_DIR = "D:/yogi/IW Uploads";

// Ensure upload folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadImages = (req, res) => {
    try {
        const busboy = Busboy({ headers: req.headers });
        const savedFiles = [];
        const uploadPromises = [];
        busboy.on("file", (fieldname, file, info) => {
            const { filename } = info;
            const safeName = path.basename(filename);
            const filePath = path.join(UPLOAD_DIR, safeName);

            const start = Date.now();
            console.log(`Started writing: ${safeName}`);

            const writeStream = fs.createWriteStream(filePath);

            const promise = new Promise((resolve, reject) => {
                file.pipe(writeStream);

                writeStream.on("close", () => {
                    const end = Date.now();
                    const timeTaken = end - start;
                    console.log(`Finished writing: ${safeName} after ${timeTaken}ms`);

                    savedFiles.push({
                        filename: safeName,
                        saved_to: filePath,
                        timeTaken,
                    });

                    resolve();
                });

                writeStream.on("error", (err) => {
                    console.error(`Write error for ${safeName}:`, err);
                    reject(err);
                });
            });

            uploadPromises.push(promise);
        });

        busboy.on("finish", async () => {
            try {
                await Promise.all(uploadPromises);
                return res.json({
                    message: "files uploaded successfully",
                    uploaded: savedFiles,
                });
            } catch (err) {
                console.error("Promise error:", err);
                return res.status(500).json({
                    message: "Upload failed during file write stage",
                    error: err.message,
                });
            }
        });

        req.pipe(busboy);
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
            message: "Upload failed",
            error: err.message,
        });
    }
};
