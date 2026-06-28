"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Check, Link as LinkIcon, MessageSquare, Sparkles } from "lucide-react";

export default function AISkillsPage() {
  const [activeSubTab, setActiveSubTab] = useState("Discover");
  const [selectedSkill, setSelectedSkill] = useState("Automation Finder");

  const skillsList = [
    {
      name: "Automation Finder",
      desc: "Identify tasks that could benefit from automation.",
      views: "36.4k",
      enabled: true,
      color: "bg-[#8553f4]",
    },
    {
      name: "Process Improvement",
      desc: "Find bottlenecks and structural delays in team pipelines.",
      views: "31.7k",
      enabled: true,
      color: "bg-[#10b981]",
    },
    {
      name: "Feature Requirements",
      desc: "Extract user requested software capabilities.",
      views: "30.4k",
      enabled: false,
      color: "bg-[#858df4]",
    },
    {
      name: "Infrastructure Scaling",
      desc: "Track software architecture needs and metrics.",
      views: "10.7k",
      enabled: false,
      color: "bg-[#f59e0b]",
    },
    {
      name: "Infrastructure Costs",
      desc: "Calculate service run-time overhead metrics.",
      views: "7.5k",
      enabled: false,
      color: "bg-[#06b6d4]",
    },
    {
      name: "Alert Thresholds",
      desc: "Log server error rates and alerting specifications.",
      views: "7.1k",
      enabled: false,
      color: "bg-[#10b981]",
    },
    {
      name: "Resource Allocation",
      desc: "Review sprint deliverables and task timelines.",
      views: "3.6k",
      enabled: false,
      color: "bg-[#2dd4bf]",
    },
    {
      name: "Test Cases",
      desc: "Determine unit test coverage recommendations.",
      views: "2.4k",
      enabled: false,
      color: "bg-[#06b6d4]",
    },
    {
      name: "Refactoring Opportunities",
      desc: "Surface technical debt and performance optimizations.",
      views: "1.4k",
      enabled: false,
      color: "bg-[#ec4899]",
    },
  ];

  const currentSkillData = skillsList.find((s) => s.name === selectedSkill) || skillsList[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-slate-800">
      {/* Top Header subtabs bar with Create Skill Button */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-0.5">
        <div className="flex">
          {["Discover", "Active Skills (2)", "Feed"].map((tabName) => {
            const isActive = activeSubTab === tabName;
            return (
              <button
                key={tabName}
                onClick={() => setActiveSubTab(tabName)}
                className={`px-5 py-3 text-xs font-bold transition-all relative ${
                  isActive
                    ? "text-violet-600 font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tabName}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => alert("Create Skill modal!")}
          className="flex items-center gap-1.5 rounded-lg bg-[#5F25E6] hover:bg-[#4F12B3] text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <span>+ Create Skill</span>
        </button>
      </div>

      {/* Main Split panel */}
      <div className="flex gap-6 items-start">
        {/* Left Column list */}
        <div className="w-[45%] flex flex-col space-y-4">
          {/* Dropdown & search icon square */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer">
              <span className="text-slate-400 font-mono font-semibold">&lt;&gt;</span>
              <span>Engineering</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
              <Search size={14} />
            </button>
          </div>

          {/* Scrollable list items */}
          <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {skillsList.map((skill) => {
              const isSelected = selectedSkill === skill.name;
              return (
                <div
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill.name)}
                  className={`flex items-center justify-between rounded-2xl border p-4.5 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-violet-500 bg-white ring-1 ring-violet-500 shadow-sm"
                      : "border-slate-100 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Star Icon container */}
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-inner ${skill.color}`}>
                      <Sparkles size={16} className="fill-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                        <span>⚡</span>
                        <span>{skill.views}</span>
                      </span>
                    </div>
                  </div>

                  {/* Switch toggle */}
                  <button
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none ${
                      skill.enabled ? "bg-[#5F25E6]" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        skill.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column details */}
        <div className="w-[55%] space-y-6">
          {/* Main Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-white shadow-inner ${currentSkillData.color}`}>
                <Sparkles size={24} className="fill-white" />
              </div>

              <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-[10px] font-extrabold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
                <LinkIcon size={12} />
                <span>Copy Link</span>
              </button>
            </div>

            {/* Title & Desc */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{currentSkillData.name}</h3>
              <p className="text-[13px] font-semibold leading-relaxed text-slate-500">
                {currentSkillData.desc}
              </p>
            </div>

            {/* Logo Metadata */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <div className="h-4.5 w-4.5 rounded bg-pink-600 text-white font-black text-[9px] flex items-center justify-center shadow-sm">
                F
              </div>
              <span>Fireflies</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <span>⚡</span>
                <span>{currentSkillData.views}</span>
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="rounded-xl bg-[#5F25E6] hover:bg-[#4F12B3] px-5 py-2.5 text-xs font-bold text-white shadow shadow-violet-200 transition-all cursor-pointer">
                  Enable
                </button>
                <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-violet-700 hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer">
                  <Sparkles size={12} className="fill-violet-700 text-violet-700" />
                  <span>Try Skill</span>
                </button>
              </div>

              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
                Edit
              </button>
            </div>
          </div>

          {/* Feedback Trigger */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-1">
            <MessageSquare size={14} />
            <span>Share Feedback</span>
          </div>

          {/* Slack integration promo banner */}
          <div className="rounded-2xl bg-slate-50/70 border border-slate-100/60 p-4.5 flex justify-between items-center text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              {/* Slack Mini logo mock */}
              <div className="h-5 w-5 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-[10px] text-red-500 shadow-sm shrink-0">
                S
              </div>
              <div className="leading-normal">
                <span className="font-extrabold text-slate-800">Get insights on Slack</span>
                <span className="text-slate-400 font-bold"> — Receive skills output to your Slack channel.</span>
              </div>
            </div>
            <a href="#" className="text-violet-600 hover:text-violet-800 font-extrabold cursor-pointer flex items-center gap-0.5">
              <span>Connect</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
