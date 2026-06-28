"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Download,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Search,
  MessageSquare,
  User,
  Sparkles,
  List,
  CheckCircle2,
  Send,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  Edit2,
  Save,
} from "lucide-react";

interface Utterance {
  id: number;
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
}

interface ActionItem {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration: number;
  participants: string;
  summary: string;
  outline: string;  // JSON string
  audio_url: string;
  transcript: Utterance[];
  action_items: ActionItem[];
}

export default function MeetingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout tabs
  const [activeTab, setActiveTab] = useState<"summary" | "actions" | "outline">("summary");

  // Media Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [virtualTimer, setVirtualTimer] = useState<NodeJS.Timeout | null>(null);

  // Transcript Search state
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Ask Fred Chat state
  const [showFred, setShowFred] = useState(true);
  const [messages, setMessages] = useState<{ sender: "user" | "fred"; text: string }[]>([
    { sender: "fred", text: "Hi! I am Fred, your AI meeting assistant. Ask me anything about this meeting's transcript, summary, or decisions." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  // Edit metadata state
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editParticipants, setEditParticipants] = useState("");

  // Add Action Item state
  const [newActionText, setNewActionText] = useState("");
  const [addingAction, setAddingAction] = useState(false);

  // References
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/meetings/${id}`);
      if (!res.ok) throw new Error("Meeting not found");
      const data = await res.json();
      setMeeting(data);
      setEditTitle(data.title);
      setEditParticipants(data.participants);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingDetails();
  }, [id]);

  // Audio Virtual Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (meeting && prev >= meeting.duration) {
            setIsPlaying(false);
            return meeting.duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, meeting]);

  // Auto-scroll and highlight current speaker utterance
  useEffect(() => {
    if (!meeting || !meeting.transcript) return;
    const currentUtterance = meeting.transcript.find(
      (u) => currentTime >= u.start_time && currentTime <= u.end_time
    );
    if (currentUtterance) {
      const el = document.getElementById(`utterance-${currentUtterance.id}`);
      if (el && isPlaying) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentTime, meeting, isPlaying]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="text-sm font-semibold text-slate-500">Loading meeting details...</span>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="text-red-500 font-bold text-lg">{error || "Unable to load meeting details"}</div>
        <button
          onClick={() => router.push("/meetings")}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
        >
          <ArrowLeft size={14} />
          <span>Back to Library</span>
        </button>
      </div>
    );
  }

  const parsedOutline = meeting.outline ? JSON.parse(meeting.outline) : [];

  // Toggle Play / Pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Seek time
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  // Update Metadata
  const handleSaveMetadata = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/meetings/${meeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, participants: editParticipants }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMeeting({ ...meeting, title: updated.title, participants: updated.participants });
        setIsEditingMetadata(false);
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Action Item
  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    try {
      setAddingAction(true);
      const res = await fetch(`http://localhost:8000/api/meetings/${meeting.id}/action-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newActionText }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setMeeting({
          ...meeting,
          action_items: [...meeting.action_items, newItem]
        });
        setNewActionText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAction(false);
    }
  };

  // Toggle Action Completion
  const handleToggleAction = async (actionId: number, currentCompleted: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/api/action-items/${actionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMeeting({
          ...meeting,
          action_items: meeting.action_items.map((item) =>
            item.id === actionId ? updated : item
          ),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Action Item
  const handleDeleteAction = async (actionId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/action-items/${actionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMeeting({
          ...meeting,
          action_items: meeting.action_items.filter((item) => item.id !== actionId),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Chat with Ask Fred
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    
    try {
      setSendingChat(true);
      const res = await fetch(`http://localhost:8000/api/meetings/${meeting.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: "fred", text: data.answer }]);
      } else {
        throw new Error("Chatbot failed");
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "fred", text: "Sorry, I ran into an error trying to process that request." }]);
    } finally {
      setSendingChat(false);
    }
  };

  // Export options
  const handleExport = (format: "txt" | "md") => {
    let content = "";
    if (format === "md") {
      content += `# Meeting: ${meeting.title}\n`;
      content += `Date: ${new Date(meeting.date).toLocaleString()}\n`;
      content += `Participants: ${meeting.participants}\n\n`;
      content += `## AI Summary\n${meeting.summary}\n\n`;
      content += `## Transcript\n`;
      meeting.transcript.forEach((u) => {
        content += `**${u.speaker}** (${formatTime(u.start_time)}): ${u.text}\n\n`;
      });
    } else {
      content += `Meeting: ${meeting.title}\n`;
      content += `Date: ${meeting.date}\n`;
      content += `Participants: ${meeting.participants}\n\n`;
      content += `AI Summary:\n${meeting.summary}\n\n`;
      content += `Transcript:\n`;
      meeting.transcript.forEach((u) => {
        content += `${u.speaker} (${formatTime(u.start_time)}): ${u.text}\n`;
      });
    }
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${meeting.title.replace(/\s+/g, "_")}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden space-y-4">
      {/* Top Header details */}
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-6 rounded-2xl shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/meetings")}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            
            {isEditingMetadata ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-1 text-base font-bold text-slate-800 outline-none focus:border-violet-500"
              />
            ) : (
              <h2 className="text-base font-bold text-slate-900 leading-tight">{meeting.title}</h2>
            )}
          </div>
          
          <div className="flex items-center gap-2 pl-9 text-xs font-semibold text-slate-400">
            <span>Participants:</span>
            {isEditingMetadata ? (
              <input
                type="text"
                value={editParticipants}
                onChange={(e) => setEditParticipants(e.target.value)}
                className="rounded-xl border border-slate-300 px-2 py-0.5 text-xs text-slate-700 outline-none focus:border-violet-500 w-64"
              />
            ) : (
              <span className="text-slate-500 font-bold">{meeting.participants}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-9 sm:pl-0">
          {isEditingMetadata ? (
            <button
              onClick={handleSaveMetadata}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-700 transition-all"
            >
              <Save size={14} />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditingMetadata(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          )}

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={14} />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50">
              <button
                onClick={() => handleExport("md")}
                className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Plain Text (.txt)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Split columns */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Left Column: AI summary, Outline, Action Items */}
        <div className="flex flex-col w-1/3 min-w-[320px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Tab bar header */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === "summary"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              AI Summary
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === "actions"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Action Items
            </button>
            <button
              onClick={() => setActiveTab("outline")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === "outline"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Outline
            </button>
          </div>

          {/* Tab content panel */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                  <Sparkles size={14} className="fill-violet-700" />
                  <span>Overview Summary</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-500 whitespace-pre-line">
                  {meeting.summary}
                </p>
              </div>
            )}

            {activeTab === "actions" && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                  <CheckCircle2 size={14} />
                  <span>Extracted Tasks</span>
                </div>

                {/* Checklist container */}
                <div className="space-y-3">
                  {meeting.action_items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/30 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <button
                        onClick={() => handleToggleAction(item.id, item.completed)}
                        className="mt-0.5 text-slate-400 hover:text-violet-600"
                      >
                        {item.completed ? (
                          <CheckSquare size={16} className="text-violet-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                      
                      <span
                        className={`flex-1 text-xs font-semibold leading-tight ${
                          item.completed ? "text-slate-400 line-through" : "text-slate-700"
                        }`}
                      >
                        {item.text}
                      </span>

                      <button
                        onClick={() => handleDeleteAction(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  {meeting.action_items.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                      No action items created yet.
                    </div>
                  )}
                </div>

                {/* Add new action item form */}
                <form onSubmit={handleAddAction} className="flex gap-2 border-t border-slate-100 pt-4">
                  <input
                    type="text"
                    placeholder="Add custom action item..."
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={addingAction}
                    className="rounded-xl bg-violet-600 p-2 text-white hover:bg-violet-700"
                  >
                    <Plus size={16} />
                  </button>
                </form>
              </div>
            )}

            {activeTab === "outline" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                  <List size={14} />
                  <span>Timeline Outline</span>
                </div>

                <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
                  {parsedOutline.map((chapter: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => handleSeek(chapter.start_time)}
                      className="group relative cursor-pointer"
                    >
                      {/* Timeline dot marker */}
                      <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-200 group-hover:bg-violet-500 group-hover:border-violet-100 transition-colors"></span>
                      
                      <div className="text-[10px] font-bold text-violet-600 tracking-wider">
                        {formatTime(chapter.start_time)} - {formatTime(chapter.end_time)}
                      </div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-violet-600 transition-colors mt-0.5 leading-tight">
                        {chapter.title}
                      </div>
                    </div>
                  ))}
                  
                  {parsedOutline.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                      No outline chapters available.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Interactive Transcript */}
        <div className="flex flex-1 flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Transcript Search */}
          <div className="flex items-center gap-3 border-b border-slate-100 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search words within transcript..."
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 focus:bg-white"
              />
            </div>
            
            <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
              Interactive Dialogues
            </div>
          </div>

          {/* Transcript List Scroll */}
          <div
            ref={transcriptContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin select-text"
          >
            {meeting.transcript && meeting.transcript.map((utterance) => {
              const isActive = currentTime >= utterance.start_time && currentTime <= utterance.end_time;
              const matchesSearch =
                transcriptSearch.trim() !== "" &&
                utterance.text.toLowerCase().includes(transcriptSearch.toLowerCase());

              // Highlight text match helper
              const highlightText = (text: string, search: string) => {
                if (!search.trim()) return text;
                const parts = text.split(new RegExp(`(${search})`, "gi"));
                return (
                  <span>
                    {parts.map((part, i) =>
                      part.toLowerCase() === search.toLowerCase() ? (
                        <mark key={i} className="bg-amber-100 text-slate-900 rounded px-0.5 font-bold">
                          {part}
                        </mark>
                      ) : (
                        part
                      )
                    )}
                  </span>
                );
              };

              return (
                <div
                  key={utterance.id}
                  id={`utterance-${utterance.id}`}
                  onClick={() => handleSeek(utterance.start_time)}
                  className={`flex gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-violet-50 border-l-4 border-violet-600 shadow-sm"
                      : "hover:bg-slate-50"
                  } ${matchesSearch ? "ring-2 ring-amber-200 bg-amber-50/10" : ""}`}
                >
                  {/* Speaker Avatar Icon */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-xs shadow-inner shrink-0">
                    <User size={14} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{utterance.speaker}</span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {formatTime(utterance.start_time)}
                      </span>
                    </div>
                    
                    <p className={`text-xs font-semibold leading-relaxed ${
                      isActive ? "text-violet-950 font-bold" : "text-slate-600"
                    }`}>
                      {highlightText(utterance.text, transcriptSearch)}
                    </p>
                  </div>
                </div>
              );
            })}

            {(!meeting.transcript || meeting.transcript.length === 0) && (
              <div className="text-center py-20 text-xs text-slate-400 font-semibold">
                No transcript utterances are populated.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ask Fred Chat panel */}
        {showFred && (
          <div className="flex flex-col w-80 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in slide-in-from-right-4 duration-200">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <img src="/fred.png" alt="Fred" className="h-[18px] w-[18px] object-contain" />
                <h3 className="text-xs font-bold text-slate-950">Ask Fred</h3>
              </div>
              <button
                onClick={() => setShowFred(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white rounded-tr-none self-end ml-auto"
                      : "bg-slate-100 text-slate-800 rounded-tl-none mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {sendingChat && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold ml-1">
                  <Loader2 size={12} className="animate-spin text-violet-600" />
                  <span>Fred is thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChat} className="border-t border-slate-100 p-3 flex gap-2">
              <input
                type="text"
                placeholder="Ask about this meeting..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={sendingChat}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sendingChat}
                className="rounded-xl bg-violet-600 p-2 text-white hover:bg-violet-700 shadow shadow-violet-200 disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}

        {/* Collapsed Fred Handle tab */}
        {!showFred && (
          <button
            onClick={() => setShowFred(true)}
            className="flex h-10 items-center justify-center rounded-xl bg-violet-600 text-white p-2.5 hover:bg-violet-700 shadow-md hover:scale-105 transition-all self-start mt-2"
            title="Open AskFred Chatbot"
          >
            <img src="/fred.png" alt="Fred Logo" className="h-5 w-5 object-contain invert brightness-[5]" />
          </button>
        )}
      </div>

      {/* Footer Controller: Media Playback waveforms */}
      <footer className="flex items-center justify-between border border-slate-200 bg-white p-4.5 rounded-2xl shadow-sm select-none gap-8">
        {/* Play/Pause controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 shadow shadow-violet-200 transition-all"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          
          <div className="text-[11px] font-bold text-slate-400 whitespace-nowrap min-w-[75px]">
            {formatTime(currentTime)} / {formatTime(meeting.duration)}
          </div>
        </div>

        {/* Progress slider */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={meeting.duration}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-lg bg-slate-100 accent-violet-600 appearance-none cursor-pointer outline-none transition-all hover:h-2"
          />
        </div>

        {/* Playback rate & volume controls */}
        <div className="flex items-center gap-4.5">
          {/* Rate Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 p-1 bg-slate-50">
            {[0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded-lg px-2 py-1 text-[10px] font-extrabold tracking-tight transition-all ${
                  playbackSpeed === speed
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Volume2 size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 rounded bg-slate-200 accent-violet-600 appearance-none cursor-pointer"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
