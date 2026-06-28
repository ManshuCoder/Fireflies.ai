"use client";

import React, { useState } from "react";
import { Mic, ArrowRight, Video, Plus, X, Sparkles, User, Play } from "lucide-react";

export default function VoiceAgentsPage() {
  const [activeSubTab, setActiveSubTab] = useState("Discover");
  const [showCloningAlert, setShowCloningAlert] = useState(true);

  const templates = [
    {
      name: "Screening Interview Agent",
      description: "Hire faster with automatic screening calls that assess candidate skills.",
      color: "bg-pink-100 text-pink-700",
    },
    {
      name: "Discovery Call Agent",
      description: "Qualify prospects with focused discovery calls that uncover needs and buying signals.",
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      name: "Progress Check-In Agent",
      description: "Keep teams aligned with quick check-ins that surface blockers and next steps.",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      name: "User Testimonial Agent",
      description: "Capture real customer stories and turn them into ready-to-use testimonials.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Performance Review Agent",
      description: "Run consistent one-on-one reviews and capture feedback, goals, and growth areas.",
      color: "bg-rose-100 text-rose-700",
    },
    {
      name: "User Research Agent",
      description: "Run one-on-one user interviews at scale and uncover real product insights.",
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Customer Support Agent",
      description: "Resolve issues faster with guided support calls that capture context and next steps.",
      color: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("Discover")}
          className={`px-6 py-3 text-xs font-bold transition-all relative ${
            activeSubTab === "Discover"
              ? "text-violet-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Discover
          {activeSubTab === "Discover" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("My Voice Agents")}
          className={`px-6 py-3 text-xs font-bold transition-all relative ${
            activeSubTab === "My Voice Agents"
              ? "text-violet-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          My Voice Agents
          {activeSubTab === "My Voice Agents" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></span>
          )}
        </button>
      </div>

      {/* Hero Banner with blue-purple gradient matching Image 3 */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-100">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white select-none">
            <Sparkles size={11} className="fill-white" />
            <span>50 free AI credits</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Experience Voice Agents</h2>
          <p className="text-xs font-medium opacity-90 leading-relaxed">
            Voice Agents handle your calls, ask the right questions, and deliver clear insights. Try calling an agent or build your own customized voice assistant.
          </p>
          <div className="flex gap-3 pt-2">
            <button className="rounded-xl bg-violet-700 px-5 py-2.5 text-xs font-bold hover:bg-violet-800 shadow shadow-violet-800/20 transition-all">
              Try It Live
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-sm transition-all">
              <Play size={12} className="fill-slate-800" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Voice Agent visual controller mockup */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl w-72 shrink-0 select-none">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-[10px] font-bold text-slate-400">Acme's Voice Agent</span>
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="py-6 text-center space-y-4">
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-inner">
              <Mic size={20} className="text-white" />
              <span className="absolute -inset-1 rounded-full border border-violet-500/30 animate-ping"></span>
            </div>
            <div className="text-[10px] font-bold text-indigo-400">How do you handle tight deadlines?</div>
          </div>
          <div className="flex justify-center gap-3 border-t border-slate-800 pt-3">
            <button className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors">
              <Mic size={14} />
            </button>
            <button className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700 transition-colors shadow shadow-red-600/30">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Cloning Dismissible alert */}
      {showCloningAlert && (
        <div className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 px-6 py-4.5 text-xs font-bold text-sky-800 shadow-sm animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="fill-sky-700 text-sky-700" />
            <span>Try Voice Cloning — Make your agent sound exactly like you in 30 seconds.</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-violet-600 hover:text-violet-800 hover:underline">
              Create Voice Agent
            </button>
            <button onClick={() => setShowCloningAlert(false)} className="text-sky-400 hover:text-sky-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Grid Greeting header */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold text-slate-800">
          TAMARAKANDI, set up your Voice Agent in 2 minutes
        </h3>
        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700 transition-all">
          <Plus size={15} />
          <span>Custom Agent</span>
        </button>
      </div>

      {/* Grid items */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-xs shrink-0 ${tpl.color}`}>
                  VA
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{tpl.name}</h4>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-slate-400">
                {tpl.description}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <button className="w-full rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                Set-Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
