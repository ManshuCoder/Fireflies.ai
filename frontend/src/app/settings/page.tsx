"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Crown,
  Smile,
  X,
  Search,
  UserPlus,
  Sliders,
  Bell,
  Cpu,
  Tv,
  HelpCircle,
  Code,
  Cookie,
  Users,
  Video,
  Layers,
  Settings,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"personal" | "team">("personal");
  const [personalSubTab, setPersonalSubTab] = useState("recording");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "team") {
        setActiveTab("team");
      }
    }
  }, []);
  const [showFeedback, setShowFeedback] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [starRating, setStarRating] = useState(0);

  // Form states (interactive toggles)
  const [autoRecord, setAutoRecord] = useState(true);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);
  const [publicAccess, setPublicAccess] = useState(false);
  const [autoRequest, setAutoRequest] = useState(false);

  const personalSubItems = [
    { id: "recording", label: "Recording & Privacy", icon: Sliders },
    { id: "compliance", label: "Compliance Notification", icon: Bell },
    { id: "ai", label: "AI settings", icon: Cpu },
    { id: "live", label: "Live meeting", icon: Tv },
    { id: "kb", label: "Knowledge base", icon: HelpCircle },
    { id: "dev", label: "< Developer settings", icon: Code },
    { id: "cookies", label: "Cookies & analytics", icon: Cookie },
  ];

  const teamSubItems = [
    { id: "recording", label: "Recording & Privacy", icon: Sliders },
    { id: "compliance", label: "Compliance Notification", icon: Bell },
    { id: "ai", label: "AI settings", icon: Cpu },
    { id: "live", label: "Live meeting", icon: Tv },
    { id: "integrations", label: "Integration Permissions", icon: Layers },
    { id: "rules", label: "Rules", icon: Settings },
  ];

  const currentSubItems = activeTab === "personal" ? personalSubItems : teamSubItems;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white select-none relative overflow-hidden">
      {/* Left Settings Sub Navigation Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </Link>

          {/* Tab toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full">
            <button
              onClick={() => {
                setActiveTab("personal");
                setPersonalSubTab("recording");
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === "personal"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => {
                setActiveTab("team");
                setPersonalSubTab("recording");
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === "team"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Team
            </button>
          </div>

          {/* Sub Navigation List */}
          <div className="space-y-1 pt-2">
            {currentSubItems.map((item) => {
              const Icon = item.icon;
              const isActive = personalSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPersonalSubTab(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition-all text-left ${
                    isActive
                      ? "bg-violet-50 text-violet-700 font-extrabold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Items (Members and groups, Account, Support) */}
        <div className="border-t border-slate-100 pt-4 mt-6 space-y-1">
          {[
            { id: "members", label: "Members and groups", icon: Users },
            { id: "account", label: "Account", icon: Sliders },
            { id: "support", label: "Support", icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = personalSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPersonalSubTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4.5 py-2.5 text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-extrabold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content Area Pane */}
      <div className="flex-1 overflow-y-auto p-8 pb-20 bg-white min-w-0">
        {activeTab === "personal" ? (
          personalSubTab === "recording" ? (
            <>
              {/* Recording Card Section */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Recording</h3>
                
                <div className="space-y-4 max-w-2xl">
                  {/* Auto-record */}
                  <div className="flex items-start justify-between border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span>Auto-record meetings</span>
                        <HelpCircle size={13} className="text-slate-400 cursor-pointer" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        Fireflies notetaker will join and record your calendar events.
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoRecord(!autoRecord)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        autoRecord ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        autoRecord ? "translate-x-4" : "translate-x-0"
                      }`}></div>
                    </button>
                  </div>
                  
                  {autoRecord && (
                    <div className="space-y-1 max-w-md animate-in fade-in duration-200">
                      <select className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                        <option>Record all calendar events with a meeting link</option>
                        <option>Record only meetings I own</option>
                        <option>Record only meetings I invite Fred to</option>
                      </select>
                    </div>
                  )}

                  {/* Capture video */}
                  <div className="flex items-start justify-between border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span>Capture meeting video</span>
                        <Crown size={12} className="text-violet-600 fill-violet-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        Record video along with meeting audio transcripts.
                      </p>
                    </div>
                    <button
                      onClick={() => setCaptureVideo(!captureVideo)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        captureVideo ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        captureVideo ? "translate-x-4" : "translate-x-0"
                      }`}></div>
                    </button>
                  </div>

                  {/* Auto delete */}
                  <div className="flex items-start justify-between border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span>Auto-delete meetings</span>
                        <Crown size={12} className="text-violet-600 fill-violet-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        Automatically delete meetings after a set retention period.
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoDelete(!autoDelete)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        autoDelete ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        autoDelete ? "translate-x-4" : "translate-x-0"
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy & Access Section */}
              <div className="space-y-5 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Privacy & Access</h3>
                
                <div className="space-y-4 max-w-2xl">
                  {/* Meeting privacy */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800">Meeting privacy</div>
                    <p className="text-[10px] text-slate-400 font-semibold">Defaults apply to all new meetings.</p>
                    <select className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                      <option>Teammates & anyone with link</option>
                      <option>Only me (Private)</option>
                      <option>Everyone in my domain</option>
                    </select>
                  </div>

                  {/* Public meeting access */}
                  <div className="flex items-start justify-between border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <span>Public meeting access</span>
                        <Crown size={12} className="text-violet-600 fill-violet-200" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal font-sans">
                        Allow anyone to view public meetings without logging in.
                      </p>
                    </div>
                    <button
                      onClick={() => setPublicAccess(!publicAccess)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        publicAccess ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        publicAccess ? "translate-x-4" : "translate-x-0"
                      }`}></div>
                    </button>
                  </div>

                  {/* Auto-request access */}
                  <div className="flex items-start justify-between border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">Auto-request access</div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        Automatically request access to private meetings you attend.
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoRequest(!autoRequest)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        autoRequest ? "bg-violet-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        autoRequest ? "translate-x-4" : "translate-x-0"
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Notification Section */}
              <div className="space-y-5 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Email Notification</h3>
                
                <div className="space-y-5 max-w-2xl">
                  {/* Meeting recap email */}
                  <div className="border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl space-y-3.5">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">Meeting recap email</div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                        Send a recap email to selected recipients after each meeting is processed.
                      </p>
                    </div>
                    <select className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                      <option>Everyone on the invite</option>
                      <option>Only teammates</option>
                      <option>Only me</option>
                    </select>
                    <div className="space-y-1 pt-1.5">
                      <div className="text-[10px] font-bold text-slate-500">What to include</div>
                      <select className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                        <option>Overview</option>
                        <option>Overview + Action Items</option>
                        <option>Full Transcript</option>
                      </select>
                    </div>
                  </div>

                  {/* Meeting prep email */}
                  <div className="border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl space-y-3.5">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">Meeting-prep email</div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal font-sans">
                        Send a prep email 1 hour before each recurring meeting with context from past interactions.
                      </p>
                    </div>
                    <select className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                      <option>All participants</option>
                      <option>Only teammates</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recording Rules Section (Screenshot 1) */}
              <div className="space-y-5 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Recording Rules</h3>
                
                <div className="space-y-4 max-w-2xl">
                  {/* Recording rules card */}
                  <div className="flex items-start gap-4 border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
                      <Video size={16} />
                    </div>
                    <div className="space-y-2.5 flex-1">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Recording rules</div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">
                          Notetaker will record meetings if the calendar meeting title has mentioned keywords or emails id or domains.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <span>+ Record Rules</span>
                      </button>
                    </div>
                  </div>

                  {/* Restriction rules card */}
                  <div className="flex items-start gap-4 border border-slate-100 bg-slate-50/20 p-4.5 rounded-2xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
                      <Sliders size={16} />
                    </div>
                    <div className="space-y-2.5 flex-1">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Restriction rules</div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">
                          Notetaker will not record meetings if the calendar meeting title has mentioned keywords or emails id or domains.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <span>+ Restriction Rules</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-400 font-bold text-xs">
              {personalSubItems.find((t) => t.id === personalSubTab)?.label} Settings panel is ready.
            </div>
          )
        ) : (
          /* Team Settings Page (Screenshot 3) */
          <div className="flex flex-col gap-6 overflow-hidden max-w-4xl">
            {/* Top toggle filters row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex gap-2">
                {["1 Teammate", "0 User Groups", "Advanced Settings"].map((tabName, i) => (
                  <button
                    key={i}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                      i === 0
                        ? "bg-slate-100 text-slate-900 border-slate-200 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 border-transparent"
                    }`}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search teammates"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-violet-500"
                />
              </div>

              <button className="flex items-center gap-1.5 rounded-xl bg-violet-600 py-2.5 px-4.5 text-xs font-bold text-white shadow hover:bg-violet-700 transition-all cursor-pointer">
                <UserPlus size={14} />
                <span>Invite Teammate</span>
              </button>
            </div>

            {/* List Header */}
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mt-2">
              All teammates (1)
            </div>

            {/* Teammates List */}
            <div className="flex-1 overflow-y-auto space-y-3.5">
              <div className="flex items-center justify-between border border-slate-100 p-4.5 rounded-2xl bg-white shadow-sm hover:border-slate-200 transition-all max-w-2xl">
                <div className="flex items-center gap-4">
                  {/* Red Square Avatar */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-white font-extrabold text-lg shadow-inner">
                    T
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">TAMARAKANDI HIMANSHU</span>
                      <span className="rounded-lg bg-cyan-50 px-2 py-0.5 text-[9px] font-extrabold text-cyan-600 border border-cyan-100">
                        ADMIN
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Mail size={11} className="text-slate-300" />
                      <span>tamarakandi.2201206cs@iitbh.ac.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating feedback box bottom-left popup (Screenshot 3 & 4) */}
      {showFeedback && (
        <div className="absolute bottom-6 left-6 z-40 bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200 max-w-[280px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-100 shrink-0">
            <Smile size={20} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[11px] font-bold text-slate-800">Did you like the settings?</div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-[10px] font-extrabold text-violet-600 hover:text-violet-800 underline transition-colors block text-left cursor-pointer"
            >
              Share Feedback
            </button>
          </div>
          <button
            onClick={() => setShowFeedback(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Share Feedback Modal popup (Screenshot 1) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left space-y-4.5">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-800">Share Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Explanation text */}
            <div className="space-y-1 text-[10px] font-semibold text-slate-500 leading-relaxed">
              <p>We'd love to hear your thoughts! Share your feedback with us and help us improve our product.</p>
              <div className="font-bold text-slate-400 mt-1">
                Need support? <a href="#" className="text-violet-600 hover:underline">Chat with our team</a>
              </div>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Type:</label>
              <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                <option>I want to share something I liked</option>
                <option>I want to request a feature</option>
                <option>I want to report a bug</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Category:</label>
              <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-violet-500 cursor-pointer">
                <option>New Settings</option>
                <option>Transcripts Feed</option>
                <option>AI Skills</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Rate your experience:</label>
              <div className="flex gap-1.5 text-xl select-none">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setStarRating(starVal)}
                    className={`transition-all hover:scale-115 cursor-pointer outline-none ${
                      starRating >= starVal ? "text-amber-400" : "text-slate-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1">
              <textarea
                rows={3}
                placeholder="Share anything you would like..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3.5 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="rounded-xl border border-slate-200 py-2 px-4.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Feedback submitted. Thank you!");
                  setShowFeedbackModal(false);
                }}
                className="rounded-xl bg-violet-600 py-2 px-4.5 text-xs font-bold text-white hover:bg-violet-700 shadow shadow-violet-200 transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
