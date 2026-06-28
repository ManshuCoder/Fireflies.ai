"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  Plus,
  Trash2,
  X,
  FileText,
  Loader2,
  Sparkles,
  ChevronDown,
  ArrowRight,
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

export default function MeetingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [participantFilter, setParticipantFilter] = useState("");
  const [sortBy, setSortBy] = useState("recency");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"upload" | "paste">("upload");
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form inputs
  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().substring(0, 16));
  const [durationInput, setDurationInput] = useState("30");
  const [participantsInput, setParticipantsInput] = useState("");
  const [pastedTranscript, setPastedTranscript] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showSlackCard, setShowSlackCard] = useState(true);

  // Load meetings list
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/meetings?sort_by=${sortBy}`);
      if (!res.ok) throw new Error("Failed to fetch meetings");
      const data = await res.json();
      setMeetings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [sortBy]);

  // Open modal if URL query param exists (e.g. from Sidebar 'Uploads')
  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      setShowModal(true);
      router.replace("/meetings"); // Clear URL
    }
  }, [searchParams]);

  // Handle Delete Meeting
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/meetings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMeetings(meetings.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete meeting");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Submit Form
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
        // Paste mode: Write text to a temporary Blob and upload it as a txt file
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

  // Filter meetings client-side
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.summary && m.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.participants.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesParticipant =
      !participantFilter ||
      m.participants.toLowerCase().includes(participantFilter.toLowerCase());

    return matchesSearch && matchesParticipant;
  });

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-5 select-none overflow-hidden text-slate-800">
      {/* 1. Left Sidebar: Channels List */}
      <div className="w-56 bg-white border border-slate-200 rounded-3xl p-4.5 flex flex-col gap-5 shrink-0 overflow-y-auto shadow-sm">
        {/* Title */}
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Meetings</div>

        {/* Search channels input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-[10px] font-semibold text-slate-800 outline-none"
          />
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-violet-50 text-violet-700">
            <span># My Meetings</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
            <span>All Meetings</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
            <span>Voice Agent Meetings</span>
          </button>
        </div>

        {/* Channels Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All channels</span>
            <div className="text-center p-3 rounded-2xl border border-dashed border-slate-200 space-y-2.5">
              <span className="text-sm font-extrabold text-violet-300">#</span>
              <p className="text-[9px] font-bold leading-normal text-slate-400">
                Create channels to organize your conversations
              </p>
              <button className="mx-auto flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 px-3 text-[9px] font-extrabold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                <span>+ Channel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Panel: Meetings Feed */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-5 overflow-hidden min-w-[320px]">
        {/* Filters Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 shrink-0">
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 shadow-sm">
              Hosted by me
            </button>
            <button className="rounded-xl border border-transparent px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-700">
              Shared with me
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 py-2 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <span>Filters</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"
              title="Upload Transcript"
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Content Pane: Dynamic Grid / List vs Empty State */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              <span className="text-xs font-semibold text-slate-400">Loading meetings...</span>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600 font-semibold text-sm">
              {error}
            </div>
          ) : filteredMeetings.length === 0 ? (
            /* Empty State (Screenshot 1) */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
              {/* Mock cards placeholder graphic */}
              <div className="space-y-3 w-full select-none opacity-40">
                <div className="mx-auto w-56 h-8 rounded-xl border border-slate-100 bg-slate-50 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">K</div>
                    <div className="h-1.5 w-16 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="h-1.5 w-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="mx-auto w-64 h-8 rounded-xl border border-slate-100 bg-slate-50 flex items-center px-4 justify-between scale-105 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">A</div>
                    <div className="h-1.5 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="h-1.5 w-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="mx-auto w-56 h-8 rounded-xl border border-slate-100 bg-slate-50 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">R</div>
                    <div className="h-1.5 w-12 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="h-1.5 w-6 bg-slate-200 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Looks like you haven't recorded a meeting yet</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                  Once you record your first meeting with Fireflies, it'll show up right here.
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 px-5 text-xs font-bold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition-all cursor-pointer"
              >
                <span>+ Capture</span>
              </button>
            </div>
          ) : (
            /* Meeting List Grid */
            <div className="grid gap-4.5 sm:grid-cols-2">
              {filteredMeetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4.5 hover:border-violet-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-violet-600 transition-colors leading-tight">
                          {m.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-400">
                          <Calendar size={11} />
                          <span>{formatDate(m.date)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(m.id, e)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Delete Meeting"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-[10px] font-medium leading-relaxed text-slate-500 line-clamp-2">
                      {m.summary || "No summary generated. Click to view outline."}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-50 pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} />
                      <span>{formatDuration(m.duration)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users size={11} />
                      <span className="truncate max-w-[100px]">{m.participants}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Sidebar Panel: Mini Ask Fred (Screenshot 1) */}
      <div className="w-80 bg-white border border-slate-200 rounded-3xl p-4.5 flex flex-col justify-between shadow-sm shrink-0 overflow-y-auto space-y-6">
        <div className="space-y-5">
          {/* Ask Fred Header */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <img src="/fred.png" alt="Fred" className="h-[18px] w-[18px] object-contain" />
              <span className="text-xs font-bold text-slate-800">Ask Fred</span>
            </div>
          </div>

          {/* Connect Slack Card */}
          {showSlackCard && (
            <div className="rounded-2xl bg-violet-50/50 border border-violet-100 p-4 relative space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => setShowSlackCard(false)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={12} />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-700">💬</span>
                  <span className="text-sm font-bold text-red-500">✉️</span>
                </div>
                <div className="text-[10px] font-extrabold text-slate-800 leading-tight">
                  Connect Slack and Gmail <span className="text-slate-400 font-normal">— get answers with full context.</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center rounded-xl bg-violet-600 py-2 text-[10px] font-bold text-white hover:bg-violet-700 shadow-sm transition-all">
                <span>Connect</span>
              </button>
            </div>
          )}

          {/* Greeting Box */}
          <div className="space-y-4">
            <div className="flex gap-2 items-center text-xs font-bold text-slate-400">
              <Sparkles size={14} className="text-teal-400 fill-teal-400 animate-pulse" />
              <span>Hi TAMARAKANDI! Get ready for your meeting</span>
            </div>

            {/* Action pill rows */}
            <div className="space-y-2.5">
              {[
                { text: "My action items", emoji: "✓", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { text: "Key decisions", emoji: "🎯", bg: "bg-pink-50 text-pink-600 border-pink-100" },
                { text: "Key initiatives", emoji: "📍", bg: "bg-purple-50 text-purple-600 border-purple-100" },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push("/askfred")}
                  className="w-full flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/25 p-3 hover:border-violet-200 hover:bg-violet-50/20 cursor-pointer transition-all duration-200 text-xs font-bold text-slate-700"
                >
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${pill.bg}`}>
                    {pill.emoji}
                  </span>
                  <span>{pill.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/askfred");
          }}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all flex flex-col gap-3"
        >
          <div className="flex">
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-500">
              # My Meetings
            </span>
          </div>

          <textarea
            rows={2}
            placeholder="Ask anything. Type / to run AI skills."
            className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none resize-none"
          />

          <div className="flex justify-between items-center border-t border-slate-50 pt-2">
            {/* Globe icon left */}
            <div className="relative">
              <span className="text-sm">🌐</span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white"></span>
            </div>

            {/* Send arrow button right */}
            <button
              type="submit"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition-all cursor-pointer"
            >
              <ArrowRight size={14} className="text-violet-600 font-bold" />
            </button>
          </div>
        </form>
      </div>

      {/* New Meeting / Upload Transcript Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Upload Meeting Transcript</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Ingestion Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Project Sync"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Participants
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. John, Sarah"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Mode switch button tab */}
              <div className="flex border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setModalMode("upload")}
                  className={`border-b-2 px-4 py-2 text-xs font-bold transition-all ${
                    modalMode === "upload"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode("paste")}
                  className={`border-b-2 px-4 py-2 text-xs font-bold transition-all ${
                    modalMode === "paste"
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Paste Content
                </button>
              </div>

              {modalMode === "upload" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Upload Caption/Text File
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-violet-400 transition-colors cursor-pointer bg-slate-50/50">
                    <input
                      type="file"
                      required={!selectedFile}
                      accept=".vtt,.txt,.json"
                      onChange={(e) => {
                        if (e.target.files) setSelectedFile(e.target.files[0]);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-xs font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : "Select or drag & drop a file"}
                    </p>
                  </div>
                </div>
              ) : (
                <textarea
                  rows={5}
                  value={pastedTranscript}
                  onChange={(e) => setPastedTranscript(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  placeholder="Paste your meeting transcript here..."
                />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all"
                >
                  Upload & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
