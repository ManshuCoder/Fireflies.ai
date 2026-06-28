"use client";

import React, { useState, useRef } from "react";
import { Upload, FileAudio, FileVideo, Inbox, Loader2, CheckCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "audio" | "video";
  date: string;
  status: "Completed" | "Processing";
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Check type
    const validExtensions = [".mp3", ".m4a", ".wav", ".mp4", ".webm"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert("Invalid file type. Please upload MP3, M4A, WAV, MP4 or WEBM.");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const isVideo = [".mp4", ".webm"].includes(fileExtension);
            const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + " MB";
            
            const newUploaded: UploadedFile = {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: fileSizeFormatted,
              type: isVideo ? "video" : "audio",
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }),
              status: "Completed"
            };

            setUploadedFiles((prevFiles) => [newUploaded, ...prevFiles]);
            setIsUploading(false);
            setSelectedFile(null);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full select-none bg-white p-8 space-y-8 flex flex-col font-sans text-slate-800">
      
      {/* Centered Content Container */}
      <div className="max-w-[860px] mx-auto w-full space-y-10">
        
        {/* Title */}
        <div className="shrink-0 text-left">
          <h2 className="text-base font-bold text-gray-500 tracking-wide uppercase">Uploads</h2>
        </div>

        {/* Main Upload Box Container */}
        <div className="w-full shrink-0">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`relative border-2 border-dashed rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              dragActive 
                ? "border-violet-500 bg-violet-50/20" 
                : "border-indigo-200 bg-white hover:border-violet-400"
            }`}
          >
            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.m4a,.wav,.mp4,.webm"
              onChange={handleFileChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4 py-4 w-full max-w-xs mx-auto">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-600" />
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800">Uploading {selectedFile?.name}...</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-violet-600 h-1.5 rounded-full transition-all duration-150" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Upload Symbol */}
                <div className="text-blue-500">
                  <Upload size={24} className="stroke-[1.5]" />
                </div>

                {/* Title & Desc */}
                <div className="space-y-1.5 mt-4">
                  <h3 className="text-[15px] font-bold text-gray-805">
                    Upload a file to generate a transcript
                  </h3>
                  <p className="text-[11px] leading-relaxed text-gray-400 max-w-lg">
                    Browse or drag and drop <span className="font-semibold text-gray-500">MP3, M4A, WAV, MP4</span> or <span className="font-semibold text-gray-500">WEBM</span> files. (Max video size: 100 MB, Max audio size: 500 MB)
                  </p>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className="mt-5 rounded-lg bg-[#5f25e6] hover:bg-[#4f12b3] py-2 px-6 text-xs font-bold text-white shadow-sm shadow-violet-200 transition-all cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Uploads List Area */}
        <div className="flex-1 flex flex-col w-full pt-4">
          {uploadedFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-4 text-center">
              {/* Folder Empty Icon */}
              <div className="text-gray-300">
                <Inbox size={42} className="stroke-[1.2]" />
              </div>
              <h4 className="text-[16px] font-bold text-slate-800">
                You have no recent uploads!
              </h4>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recent Uploads
              </h4>
              
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between border border-slate-100 bg-white rounded-2xl p-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        file.type === "video" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {file.type === "video" ? <FileVideo size={18} /> : <FileAudio size={18} />}
                      </div>
                      
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800">{file.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {file.date} &bull; {file.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        {file.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
