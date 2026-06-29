"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-player to prevent Next.js errors
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function WelcomeBanner() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const videoUrl = "https://youtu.be/uZuFXgNfZmI";
  const thumbnailUrl = "https://img.youtube.com/vi/uZuFXgNfZmI/maxresdefault.jpg";

  return (
    <div className="w-full mb-8">
      {/* 1. THE BANNER (Matches the soft light peach color and sizing) */}
      <div className="bg-[#FFF9F6] rounded-3xl px-12 py-5 flex flex-row items-center justify-between border border-[#FFE2D1] shadow-[0_2px_12px_rgba(255,226,209,0.15)] w-full gap-8 h-[166px]">
        
        <div className="flex-1 text-left space-y-1.5 flex flex-col items-start justify-center h-full">
          <h2 className="text-[19px] font-semibold text-[#4A3E3D] tracking-tight leading-none">
            Welcome Aboard, TAMARAKANDI!
          </h2>
          <p className="text-[#8B7E7C] text-[13px] leading-relaxed max-w-[360px]">
            Fireflies is now ready to automate your meetings and streamline your workflows.
          </p>
        </div>

        {/* The Video Box inside the banner (Thick Device Screen Border) */}
        <div 
          onClick={() => setIsVideoOpen(true)}
          className="relative w-[210px] h-[118px] bg-slate-900 rounded-xl cursor-pointer overflow-hidden group shadow-md shrink-0 border-[6px] border-[#FCD5B5]"
        >
          <img 
            src={thumbnailUrl} 
            alt="Video Thumbnail"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition duration-300"
          />
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#5F25E6] hover:bg-[#4F12B3] text-white rounded-full p-2.5 shadow-lg group-hover:scale-105 transition transform duration-200 flex items-center justify-center">
              <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE MODAL (Matches the dark overlay and large video size) */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          
          <div className="relative w-full max-w-[900px] flex flex-col items-end">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 rounded-full p-2 mb-3 transition backdrop-blur-md"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* The Enlarged Video Player */}
            <div className="aspect-video w-full bg-black overflow-hidden rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <ReactPlayer
                src={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
