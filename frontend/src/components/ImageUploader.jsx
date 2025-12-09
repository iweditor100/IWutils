import axios from "axios";
import { useState } from "react";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

export default function ImageUploader() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [allUploaded, setAllUploaded] = useState(false);


    // NEW: State to hold clicked preview image
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        // Reset everything when new images are selected
        setAllUploaded(false);
        setUploading(false);

        const selected = Array.from(e.target.files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: "pending", // always reset
            response: null,
        }));

        setFiles(selected);
    };


    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select some images!");
            return;
        }

        setUploading(true);

        const uploadPromises = files.map(async (fileObj, index) => {
        const formData = new FormData();
        formData.append("image", fileObj.file);

        setFiles((prev) => {
            const updated = [...prev];
            updated[index].status = "uploading";
            return updated;
        });

        return axios
            .post(`${BACKEND_API}/images/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },

                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);

                    setFiles((prev) => {
                        const updated = [...prev];
                        updated[index].progress = percent;
                        return updated;
                    });
                },
            })
            .then((res) => {
                setFiles((prev) => {
                    const updated = [...prev];
                    updated[index].status = "success";
                    updated[index].response = res.data;
                    return updated;
                });
            })
            .catch((err) => {
                console.error("Upload failed: ", err);
                setFiles((prev) => {
                    const updated = [...prev];
                    updated[index].status = "error";
                    updated[index].response = { error: true };
                    return updated;
                });
            });
        });

        await Promise.all(uploadPromises);
        
        setFiles(prev => {
            const isAllUploaded = prev.every(f => f.status === "success");
            setAllUploaded(isAllUploaded);
            return prev;
        })
        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl space-y-6">

            <h1 className="text-3xl font-semibold text-center">
            Image Upload With Preview + Loading Overlay
            </h1>

            {/* File Input */}
            <label className="border-2 border-dashed border-gray-600 rounded-lg p-10 flex flex-col items-center cursor-pointer">
                <span className="text-gray-300 mb-3">{files.length > 0 ? "Click to select new images" : "Click to select images"}</span>
                <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    onClick={() => setAllUploaded(false)}
                />
            </label>

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="flex flex-col gap-4 w-full">
                    {files.map((fileObj, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg cursor-pointer relative"
                            onClick={() => setPreviewImage(fileObj.preview)}
                        >
                        {/* Left: Smaller Image */}
                        <img
                            src={fileObj.preview}
                            alt="preview"
                            className="w-24 h-24 object-cover rounded-md"
                        />

                        {/* Middle: Progress + Overlay */}
                        <div className="flex-1 relative">

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-600 h-3 rounded-md overflow-hidden">
                            <div
                                className="h-3 bg-blue-500"
                                style={{ width: `${fileObj.progress}%` }}
                            ></div>
                            </div>

                            {/* Uploading Overlay Spinner */}
                            {fileObj.status === "uploading" && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            )}
                        </div>

                        {/* Right: Status Label */}
                        <div className="min-w-[80px] text-right">
                            {fileObj.status === "success" && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Uploaded
                            </span>
                            )}
                            {fileObj.status === "error" && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Failed
                            </span>
                            )}
                            {fileObj.status === "pending" && (
                            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                                Pending
                            </span>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>

            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={uploading || allUploaded}
                className={`w-full py-3 rounded-lg text-white font-medium transition 
                ${uploading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
                {uploading ? "Uploading..." : allUploaded ? "All Images uploaded!" : "Upload all files"}
            </button>
            

        </div>

        {/* NEW: Preview Modal */}
        {previewImage && (
            <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setPreviewImage(null)}
            >
            <img
                src={previewImage}
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg animate-fadeIn"
            />

            <button
                className="absolute top-6 right-6 text-white text-3xl"
                onClick={() => setPreviewImage(null)}
            >
                ✕
            </button>
            </div>
        )}
        </div>
    );
}
