"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function WelcomeBanner() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="w-full mb-8 select-none">
      {/* 1. THE BANNER */}
      <div className="bg-[#FFF9F6] rounded-3xl px-12 py-5 flex flex-row items-center justify-between border border-[#FFE2D1] shadow-[0_2px_12px_rgba(255,226,209,0.15)] w-full gap-8 h-[166px]">
        
        <div className="flex-1 text-left space-y-1.5 flex flex-col items-start justify-center h-full">
          <h2 className="text-[19px] font-semibold text-[#4A3E3D] tracking-tight leading-none">
            Welcome Aboard, TAMARAKANDI!
          </h2>
          <p className="text-[#8B7E7C] text-[13px] leading-relaxed max-w-[360px]">
            Fireflies is now ready to automate your meetings and streamline your workflows.
          </p>
        </div>

        {/* The Video Mockup Card */}
        <div 
          onClick={() => setIsVideoOpen(true)}
          className="relative w-[210px] h-[118px] rounded-xl cursor-pointer overflow-hidden group shadow-md shrink-0 border-[6px] border-[#FCD5B5] bg-gradient-to-br from-indigo-950 via-[#1C0E4B] to-purple-950 flex flex-col justify-between p-2.5 transition-all duration-300 hover:scale-[1.02]"
        >
          {/* Header UI */}
          <div className="flex items-center gap-1.5 opacity-95">
            <div className="h-4 w-4 rounded-full bg-pink-600 text-white font-extrabold text-[8px] flex items-center justify-center shadow">
              F
            </div>
            <span className="text-[9px] font-bold text-white tracking-tight truncate w-32">
              Fireflies Product Demo
            </span>
          </div>

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-[#5F25E6] hover:bg-[#4F12B3] text-white rounded-full p-2 shadow-lg group-hover:scale-110 transition duration-200 flex items-center justify-center">
              <Play size={14} className="fill-white text-white ml-0.5" />
            </div>
          </div>

          {/* Footer UI (Progress Bar & Mini Avatar) */}
          <div className="flex items-center justify-between w-full z-10 pt-1.5">
            {/* Progress line */}
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden mr-2">
              <div className="w-1/3 h-full bg-[#5F25E6] rounded-full"></div>
            </div>
            {/* Avatar thumbnail */}
            <div className="h-4 w-4 rounded-full border border-white/20 bg-slate-800 overflow-hidden flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE VIDEO OVERLAY MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[800px] bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] aspect-video">
            
            {/* Close Button at top-right of container */}
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition duration-200 z-50 border border-white/10"
              aria-label="Close video"
            >
              <X size={18} />
            </button>

            {/* YouTube IFrame Embed with Autoplay */}
            <iframe
              src="https://www.youtube.com/embed/uZuFXgNfZmI?autoplay=1"
              title="Welcome Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
