"use client";
import { Upload } from "lucide-react";
import * as React from "react";

const FilUploadComponent: React.FC = () => {
  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async (file: File) => {
    const formdata = new FormData();
    formdata.append("pdf", file);

    setUploading(true);
    try {
      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formdata,
      });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "application/pdf";
    el.onchange = () => {
      if (el.files && el.files.length > 0) {
        handleFileUpload(el.files[0]);
      }
    };
    el.click();
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center">
      {/* Hero Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-700">Welcome to PDF Chat</h1>
        <p className="mt-2 text-gray-300">
          Upload your PDF files and start chatting with them instantly!
        </p>
      </header>

      {/* Upload Section */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-xl shadow-xl hover:shadow-2xl border border-red-700 cursor-pointer transition-all duration-300"
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 mb-2 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-lg font-semibold text-red-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload className="h-10 w-10 mb-2 text-red-600" />
            <h2 className="text-xl font-bold text-white">Upload your PDF</h2>
            <p className="text-sm text-gray-400">Click or drag and drop a PDF file here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilUploadComponent;
