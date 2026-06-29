"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SoundbitesPage() {
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-[calc(100vh-140px)] w-full bg-white -m-8 p-8 flex flex-col">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-8">
        0 New Soundbites
      </h2>

      {/* Tabs & Search Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Soundbites
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All
          </button>
        </div>

        <div className="relative w-48">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-[11px] font-semibold text-slate-800 placeholder-slate-450 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Empty State / Blank content (exactly as shown in mockup 1) */}
      <div className="flex-1 bg-white" />
    </div>
  );
}
