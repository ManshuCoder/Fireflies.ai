"use client";

import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export default function TopicsTrackerPage() {
  const [activeTab, setActiveTab] = useState<"my" | "workspace" | "teammate">("my");
  const [topicName, setTopicName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [enableForTeammates, setEnableForTeammates] = useState(false);

  return (
    <div className="min-h-[calc(100vh-140px)] w-full bg-white -m-8 p-8 flex flex-col items-center">
      {/* Premium Header and Card Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center mt-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Topic Tracker
          </h2>
          <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Premium
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 font-semibold max-w-lg leading-relaxed mb-8">
          Creating topics helps you search and highlight relevant parts of meetings quickly in the smart search panel
        </p>

        {/* Input Form Box */}
        <div className="w-full text-left space-y-4 mb-10">
          <input
            type="text"
            placeholder="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            className="w-full bg-[#f1f5f9]/70 rounded-lg p-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-transparent focus:border-violet-500"
          />

          <textarea
            rows={4}
            placeholder="Type key words here and press ENTER"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full bg-[#f1f5f9]/70 rounded-lg p-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-transparent focus:border-violet-500 resize-none"
          />

          {/* Toggle Switch and Add button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Enable for teammates</span>
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setEnableForTeammates(!enableForTeammates)}
                className={`w-9 h-5 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer border-0 ${
                  enableForTeammates ? "bg-violet-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    enableForTeammates ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              disabled
              className="bg-[#ECE9FF] text-[#BEB6FF] rounded-lg px-6 py-2 text-xs font-bold cursor-not-allowed border-0"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="w-full border-b border-slate-100 flex items-center justify-between pb-3.5 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("my")}
              className={`text-xs font-bold transition-all pb-3.5 -mb-3.5 cursor-pointer ${
                activeTab === "my"
                  ? "text-violet-700 border-b-2 border-violet-600 font-extrabold"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              My Topics
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`text-xs font-bold transition-all pb-3.5 -mb-3.5 cursor-pointer ${
                activeTab === "workspace"
                  ? "text-violet-700 border-b-2 border-violet-600 font-extrabold"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Workspace Topics
            </button>
            <button
              onClick={() => setActiveTab("teammate")}
              className={`text-xs font-bold transition-all pb-3.5 -mb-3.5 cursor-pointer ${
                activeTab === "teammate"
                  ? "text-violet-700 border-b-2 border-violet-600 font-extrabold"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Teammate Topics
            </button>
          </div>

          <ArrowUpDown size={14} className="text-slate-400 cursor-pointer" />
        </div>

        {/* Sample terms panel box */}
        <div className="w-full rounded-2xl border border-slate-150/70 p-5 bg-white text-left space-y-4 mb-8">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800">Sample terms</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1.5">
              <span>✓</span>
              <span>Enabled by team admin</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {["follow up", "next steps", "helpful", "meetings"].map((tag) => (
              <span
                key={tag}
                className="bg-slate-100/80 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* View more Action Button */}
        <button className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-6 text-xs font-bold shadow-sm shadow-violet-100 flex items-center justify-center cursor-pointer border-0 mt-2">
          + View more
        </button>

      </div>
    </div>
  );
}
