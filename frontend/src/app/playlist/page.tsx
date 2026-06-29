"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function PlaylistPage() {
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreatePlaylist = () => {
    alert("Creating new playlist...");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full bg-white -m-8 p-8 flex flex-col justify-between">
      {/* Top Header Actions Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-12 shrink-0">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setActiveTab("my")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "my"
                ? "border border-violet-600 text-violet-700 bg-white"
                : "border border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            My Playlists
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "border border-violet-600 text-violet-700 bg-white"
                : "border border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All Playlists
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search playlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-[11px] font-semibold text-slate-800 placeholder-slate-450 outline-none focus:border-violet-500"
            />
          </div>
          <button
            onClick={handleCreatePlaylist}
            className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white py-1.5 px-4 text-xs font-bold shadow-sm shadow-violet-100 flex items-center gap-1.5 cursor-pointer border-0"
          >
            <Plus size={14} />
            <span>Create playlist</span>
          </button>
        </div>
      </div>

      {/* Centered Graphic Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
        {/* Mock Waveform card illustration */}
        <div className="w-56 h-32 rounded-2xl border border-slate-100 bg-[#f8fafc]/60 flex flex-col items-center justify-center relative shadow-sm mb-8">
          {/* Soundwave/Playlist icon inside */}
          <div className="h-10 w-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5 text-violet-600 fill-none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 10l12-3" />
            </svg>
          </div>
          {/* Mock lines underneath */}
          <div className="absolute bottom-4 left-6 h-1.5 w-16 bg-slate-200/70 rounded-full"></div>
          <div className="absolute bottom-4 left-24 h-1.5 w-8 bg-slate-200/70 rounded-full"></div>
        </div>

        {/* Heading & Details */}
        <h3 className="text-[17px] font-bold text-slate-800 tracking-tight mb-2">
          Organize soundbites with playlists
        </h3>
        <p className="text-xs text-slate-400 font-semibold max-w-[360px] leading-relaxed mb-8">
          Playlists helps you keep your favourite soundbites organized <br /> and easily sharable across team.
        </p>

        {/* Action button */}
        <button
          onClick={handleCreatePlaylist}
          className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-5 text-xs font-bold shadow-sm shadow-violet-100 cursor-pointer border-0"
        >
          Create playlist
        </button>
      </div>
    </div>
  );
}
