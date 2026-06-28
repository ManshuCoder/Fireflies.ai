"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WelcomeBanner from "@/components/WelcomeBanner";
import {
  Calendar,
  Upload,
  Download,
  Plus,
  ArrowRight,
  Monitor,
  Smartphone,
  Sparkles,
  List,
  Video,
  ChevronRight,
  Play,
  X,
  FileText,
  Loader2,
  Clock,
  Users,
  Zap,
  Mail,
  Lock,
  Globe,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";

interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: number;
  participants: string;
  summary: string;
  outline: string;
  created_at: string;
}

const CalendarCogIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="18" cy="16" r="3" />
    <path d="M18 13v1M18 18v1M15 16h1M20 16h1" />
  </svg>
);

export default function HomePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Ingestion state
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [autoJoinEnabled, setAutoJoinEnabled] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<"autoJoin" | "emailRecap" | "privacy" | "language" | null>(null);
  const [selectedAutoJoin, setSelectedAutoJoin] = useState("All meetings with web-conf link");
  const [selectedEmailRecap, setSelectedEmailRecap] = useState("Everyone on the invite");
  const [selectedPrivacy, setSelectedPrivacy] = useState("Teammates & Anyone with Link");
  const [selectedLanguage, setSelectedLanguage] = useState("English (Global)");
  const [languageSearchQuery, setLanguageSearchQuery] = useState("");
  const [logsTab, setLogsTab] = useState<"Recent" | "Upcoming" | "AI Feed">("Recent");
  const [activeSkills, setActiveSkills] = useState<string[]>(["1:1", "Idea Generator"]);
  const toggleSkill = (skill: string) => {
    if (activeSkills.includes(skill)) {
      setActiveSkills(activeSkills.filter((s) => s !== skill));
    } else {
      setActiveSkills([...activeSkills, skill]);
    }
  };
  const [modalMode, setModalMode] = useState<"upload" | "paste">("upload");
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form states
  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().substring(0, 16));
  const [durationInput, setDurationInput] = useState("30");
  const [participantsInput, setParticipantsInput] = useState("");
  const [pastedTranscript, setPastedTranscript] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/meetings?sort_by=recency");
      if (!res.ok) throw new Error("Failed to load meetings");
      const data = await res.json();
      setMeetings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput || !participantsInput) {
      alert("Please fill in Title and Participants.");
      return;
    }

    try {
      setUploadProgress(true);
      const formData = new FormData();
      formData.append("title", titleInput);
      formData.append("participants", participantsInput);
      formData.append("date", dateInput);
      formData.append("duration", (parseInt(durationInput) * 60).toString());

      if (modalMode === "upload") {
        if (!selectedFile) {
          alert("Please select a transcript file.");
          setUploadProgress(false);
          return;
        }
        formData.append("file", selectedFile);
      } else {
        if (!pastedTranscript) {
          alert("Please paste the transcript content.");
          setUploadProgress(false);
          return;
        }
        const blob = new Blob([pastedTranscript], { type: "text/plain" });
        formData.append("file", blob, "transcript.txt");
      }

      const res = await fetch("http://localhost:8000/api/meetings/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create meeting");
      }

      const newMeeting = await res.json();
      setMeetings([newMeeting, ...meetings]);
      setShowModal(false);
      
      // Reset form
      setTitleInput("");
      setParticipantsInput("");
      setPastedTranscript("");
      setSelectedFile(null);
    } catch (err: any) {
      alert(err.message || "Error processing transcript");
    } finally {
      setUploadProgress(false);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white -m-8 select-none overflow-y-auto scroll-nice flex flex-col bg-gradient-to-b from-blue-50 via-orange-50/30 to-white bg-[length:100%_400px] bg-no-repeat">
      {/* 1. Welcome Banner Header card Container */}
      <div className="w-full pt-12 px-8 shrink-0">
        <div className="max-w-[860px] mx-auto w-full">
          <WelcomeBanner />
        </div>
      </div>

      {/* Centered Content Column (White Background) */}
      <div className="max-w-[860px] mx-auto w-full px-8 py-10 space-y-10 pb-16 bg-white flex-1">
        {/* 2. Quick Start section */}
        <div className="space-y-4">
        <div>
          <h3 className="text-[15px] font-extrabold text-slate-800 tracking-tight">Quick Start</h3>
          <p className="text-[12.5px] font-semibold text-slate-500 mt-1">
            Capture your first meeting or upload a recording to see Fireflies in action.
          </p>
        </div>

        {/* 3 columns grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Schedule card */}
          <div 
            onClick={() => setShowScheduleModal(true)}
            className="group flex items-center justify-between rounded-xl border-0 bg-pink-50/70 py-4 px-5 cursor-pointer hover:bg-pink-100/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Calendar size={20} className="text-[#FF2E93] shrink-0" />
              <span className="text-[14px] font-medium text-gray-700">Schedule Meeting</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:text-[#FF2E93] transition-colors" />
          </div>

          {/* Upload card */}
          <div
            onClick={() => setShowModal(true)}
            className="group flex items-center justify-between rounded-xl border-0 bg-emerald-50/70 py-4 px-5 cursor-pointer hover:bg-emerald-100/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Upload size={20} className="text-[#059669] shrink-0" />
              <span className="text-[14px] font-medium text-gray-700">Upload File</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:text-[#059669] transition-colors" />
          </div>

          {/* Capture card */}
          <div 
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("capture", "true");
              window.history.pushState({}, "", url.toString());
              window.dispatchEvent(new Event("popstate"));
            }}
            className="group flex items-center justify-between rounded-xl border-0 bg-purple-50/70 py-4 px-5 cursor-pointer hover:bg-purple-100/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Plus size={20} className="text-[#7C3AED] shrink-0" />
              <span className="text-[14px] font-medium text-gray-700">Capture Meeting</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:text-[#7C3AED] transition-colors" />
          </div>
        </div>
      </div>

      {/* 3. Recent Meetings logs list */}
      <div className="space-y-4 min-h-[280px]">
        <div className="flex items-center justify-between pb-1">
          {/* Capsule Tab Container */}
          <div className="bg-[#F1F5F9] rounded-xl p-1 flex gap-1 items-center shrink-0">
            {(["Recent", "Upcoming", "AI Feed"] as const).map((tab) => {
              const isActive = logsTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLogsTab(tab)}
                  className={`text-xs font-semibold px-4.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <CalendarCogIcon className="h-[18px] w-[18px] text-slate-450 shrink-0" />
            <span>Settings</span>
          </button>
        </div>

        {/* Logs list container */}
        <div className="space-y-3">
          {logsTab === "Recent" ? (
            loading ? (
              <div className="flex items-center justify-center py-10 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                <span className="text-xs font-semibold text-slate-400">Loading recent logs...</span>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-semibold bg-white border border-slate-100 rounded-2xl">
                No meetings found. Upload a transcript to see it listed here!
              </div>
            ) : (
              meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/meetings/${meeting.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4.5 hover:border-violet-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4.5">
                    {/* Brand Logo icon */}
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="h-7 w-7 object-contain bg-slate-50 p-1.5 rounded-lg border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {meeting.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                        {formatDate(meeting.date)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>
              ))
            )
          ) : logsTab === "Upcoming" ? (
            <div className="flex flex-col items-center py-6 text-center animate-in fade-in duration-200">
              {/* Calendar Card Placeholder */}
              <div className="w-full max-w-[340px] rounded-2xl border border-slate-150 bg-white p-4.5 shadow-sm flex items-center gap-3.5 text-left mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200/50 shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-28 bg-slate-100 rounded-full"></div>
                  <div className="h-2.5 w-20 bg-slate-50 rounded-full"></div>
                </div>
              </div>

              {/* Empty state text */}
              <h4 className="text-sm font-extrabold text-slate-800 mt-2">
                No upcoming meeting scheduled
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 max-w-sm mt-1 leading-relaxed">
                Schedule a meeting on your calendar or transcribe a live meeting.
              </p>

              {/* Capture Button */}
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("capture", "true");
                  window.history.pushState({}, "", url.toString());
                  window.dispatchEvent(new Event("popstate"));
                }}
                className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-[#5f25e6] hover:bg-[#4f12b3] px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-violet-200 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Capture</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center animate-in fade-in duration-200">
              {/* Pink Plus Circle */}
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-50 text-pink-500 mb-4 shrink-0 shadow-inner">
                <Plus size={18} />
              </div>

              {/* Heading */}
              <h4 className="text-[13px] font-extrabold text-slate-805">
                Extract specific insights from your meetings ✨
              </h4>

              {/* Recommended Skills Box */}
              <div className="w-full max-w-[500px] mt-6 rounded-3xl border border-[#ECFDF5] bg-[#F0FDF4]/30 p-5 text-left space-y-4 shadow-sm">
                
                {/* Recommended Skills Label Header */}
                <div className="flex items-center gap-2 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
                  <Sparkles size={13} className="text-emerald-600 fill-emerald-100" />
                  <span>Recommended Skills</span>
                </div>

                {/* Skills List */}
                <div className="space-y-2.5">
                  {/* Idea Generator Skill */}
                  <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Idea Generator</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Zap size={11} className="fill-slate-100 text-slate-350" />
                        <span>211.6k</span>
                      </div>
                      {/* Switch Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSkill("Idea Generator")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          activeSkills.includes("Idea Generator") ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            activeSkills.includes("Idea Generator") ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Daily Standups Skill */}
                  <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-50 text-[#5f25e6] shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Daily Standups</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Zap size={11} className="fill-slate-100 text-slate-350" />
                        <span>131.1k</span>
                      </div>
                      {/* Switch Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSkill("Daily Standups")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          activeSkills.includes("Daily Standups") ? "bg-[#5f25e6]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            activeSkills.includes("Daily Standups") ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* 1:1 Skill (No Zap or Usage Count) */}
                  <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">1:1</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      {/* Switch Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSkill("1:1")}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          activeSkills.includes("1:1") ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            activeSkills.includes("1:1") ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* View All Link */}
                <div className="pt-1.5">
                  <Link
                    href="/skills"
                    className="text-[11px] font-bold text-slate-500 hover:text-[#5f25e6] transition-colors flex items-center gap-1"
                  >
                    <span>View All</span>
                    <span>&gt;</span>
                  </Link>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>

      {/* 4. Try More section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 tracking-tight">Try More</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Desktop App card */}
          <div className="rounded-2xl border-none bg-[#F7F7F8] p-6 shadow-none flex flex-col gap-4.5 items-start text-left hover:bg-[#F1F1F3] transition-all">
            <Monitor size={22} className="text-blue-600 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-slate-805">Desktop App</h4>
              <p className="text-xs font-semibold leading-relaxed text-slate-400">
                Capture conversations without any bot present in your meeting.
              </p>
            </div>
            <button className="flex items-center justify-center gap-1.5 rounded-md bg-[#5f25e6] hover:bg-[#4f12b3] py-2 px-5 text-center text-xs font-bold text-white shadow-sm shadow-violet-200 transition-all cursor-pointer">
              <Download size={14} />
              <span>Download</span>
            </button>
          </div>

          {/* Mobile App card */}
          <div className="rounded-2xl border-none bg-[#F7F7F8] p-6 shadow-none flex flex-col gap-4.5 items-start text-left hover:bg-[#F1F1F3] transition-all">
            <Smartphone size={22} className="text-pink-700 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-slate-805">Mobile App</h4>
              <p className="text-xs font-semibold leading-relaxed text-slate-400">
                Record in-person conversations and review meetings on the go.
              </p>
            </div>
            
            {/* Badges */}
            <div className="flex gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-2 shadow-sm border border-slate-100/50 hover:bg-slate-50 transition-all cursor-pointer">
                <img
                  src="/app_store_logo.png"
                  alt="App Store"
                  className="h-5 w-5 object-contain"
                />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-2 shadow-sm border border-slate-100/50 hover:bg-slate-50 transition-all cursor-pointer">
                <img
                  src="/play_store_logo.png"
                  alt="Google Play"
                  className="h-5 w-5 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Upload Modal (same as Meetings dashboard) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Upload size={16} />
                </div>
                <h2 className="text-base font-bold text-slate-950">Add New Meeting & Transcript</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setModalMode("upload")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  modalMode === "upload"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Upload Transcript File
              </button>
              <button
                onClick={() => setModalMode("paste")}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  modalMode === "paste"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Paste Transcript Text
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sync & Design Review"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Meeting Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Participants (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah, Mike, John"
                  value={participantsInput}
                  onChange={(e) => setParticipantsInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                />
              </div>

              {modalMode === "upload" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Upload Transcript File (.vtt, .json, .txt)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-violet-400 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".vtt,.json,.txt"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-xs font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : "Select or drag & drop a file"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Supported formats: VTT, JSON, or plain TXT caption logs.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Paste Transcript Content
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Speaker A (00:00): Hello, how is the project?&#10;Speaker B (00:05): Going great, we are building it now!"
                    value={pastedTranscript}
                    onChange={(e) => setPastedTranscript(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 font-mono"
                  ></textarea>
                </div>
              )}

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 hover:bg-violet-700 disabled:bg-violet-400"
                >
                  {uploadProgress ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 fill-white" />
                      <span>Ingest & Summarize</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-[460px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Schedule Meeting
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] font-semibold leading-relaxed text-slate-400">
              Your AI Notetaker will be invited to the calendar meeting to record, transcribe and summarize.
            </p>

            {/* Platform Options */}
            <div className="space-y-3 pt-2">
              {/* Google Calendar button */}
              <button
                onClick={() => {
                  alert("Opening Google Calendar integration...");
                  setShowScheduleModal(false);
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3.5 px-4 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-xs font-bold text-slate-700"
              >
                <img
                  src="/google_calendar.png"
                  alt="Google Calendar"
                  className="h-4.5 w-4.5 object-contain"
                />
                <span>Google Calendar</span>
              </button>

              {/* Microsoft Outlook button */}
              <button
                onClick={() => {
                  alert("Opening Microsoft Outlook integration...");
                  setShowScheduleModal(false);
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3.5 px-4 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-xs font-bold text-slate-700"
              >
                <img
                  src="/outlook.png"
                  alt="Microsoft Outlook"
                  className="h-4.5 w-4.5 object-contain"
                />
                <span>Microsoft Outlook</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Meeting Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-[460px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Meeting Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form list */}
            <div className="space-y-4 pt-1">
              
              {/* Auto-join Calendar meetings */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/google_calendar.png"
                      alt="Google Calendar"
                      className="h-4.5 w-4.5 object-contain"
                    />
                    <span className="text-[11.5px] font-bold text-slate-700">Auto-join calendar meetings</span>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setAutoJoinEnabled(!autoJoinEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoJoinEnabled ? "bg-[#5f25e6]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        autoJoinEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {/* Dropdown Box */}
                <div 
                  onClick={() => setActiveDropdown(activeDropdown === "autoJoin" ? null : "autoJoin")}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{selectedAutoJoin}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {/* Options List */}
                {activeDropdown === "autoJoin" && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-150 bg-white py-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    {["All meetings with web-conf link", "Only meetings that I own", "Only meetings with teammates", "Only when I invite fred@fireflies.ai"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedAutoJoin(opt);
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>{opt}</span>
                        {selectedAutoJoin === opt && <Check size={14} className="text-[#5f25e6] font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send email recap to */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#5f25e6]" />
                  <span className="text-[11.5px] font-bold text-slate-700">Send email recap to</span>
                </div>
                {/* Dropdown Box */}
                <div 
                  onClick={() => setActiveDropdown(activeDropdown === "emailRecap" ? null : "emailRecap")}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{selectedEmailRecap}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {/* Options List */}
                {activeDropdown === "emailRecap" && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-150 bg-white py-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    {["Everyone on the invite", "Only me and participants from my Fireflies team", "Only me"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedEmailRecap(opt);
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>{opt}</span>
                        {selectedEmailRecap === opt && <Check size={14} className="text-[#5f25e6] font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Meeting privacy */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#5f25e6]" />
                  <span className="text-[11.5px] font-bold text-slate-700">Meeting privacy</span>
                </div>
                {/* Dropdown Box */}
                <div 
                  onClick={() => setActiveDropdown(activeDropdown === "privacy" ? null : "privacy")}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{selectedPrivacy}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {/* Options List */}
                {activeDropdown === "privacy" && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-150 bg-white py-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    {["Teammates & Anyone with Link", "Teammates and Participants", "Teammates", "Participants", "Only Owner"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedPrivacy(opt);
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>{opt}</span>
                        {selectedPrivacy === opt && <Check size={14} className="text-[#5f25e6] font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Meeting language */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#5f25e6]" />
                  <span className="text-[11.5px] font-bold text-slate-700">Meeting language</span>
                </div>
                {/* Dropdown Box */}
                <div 
                  onClick={() => setActiveDropdown(activeDropdown === "language" ? null : "language")}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{selectedLanguage}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {/* Searchable Options List */}
                {activeDropdown === "language" && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-150 bg-white py-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150 max-h-52 overflow-y-auto scroll-nice">
                    {/* Search Field */}
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
                      <Search size={13} className="text-slate-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={languageSearchQuery}
                        onChange={(e) => setLanguageSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                        className="w-full text-xs font-semibold text-slate-850 outline-none bg-white py-1"
                      />
                    </div>
                    {/* Options list */}
                    {["English (Global)", "Auto-detect", "Multi-Language (Auto Detect) (Beta)", "Afrikaans", "Albanian", "Amharic", "Spanish", "French", "German"]
                      .filter((opt) => opt.toLowerCase().includes(languageSearchQuery.toLowerCase()))
                      .map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(opt);
                            setActiveDropdown(null);
                            setLanguageSearchQuery("");
                          }}
                          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span>{opt}</span>
                          {selectedLanguage === opt && <Check size={14} className="text-[#5f25e6] font-bold" />}
                        </button>
                      ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl px-4 py-2.5 text-xs font-extrabold text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Settings saved successfully!");
                  setShowSettingsModal(false);
                }}
                className="rounded-xl bg-[#5f25e6] hover:bg-[#4f12b3] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 transition-all cursor-pointer"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
