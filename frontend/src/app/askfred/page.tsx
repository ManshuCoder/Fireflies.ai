"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Grid,
  Sparkles,
  List,
  Calendar,
  Compass,
  ArrowUp,
  Loader2,
  FileText,
  CheckSquare,
} from "lucide-react";

export default function AskFredPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "fred"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetingsCount, setMeetingsCount] = useState(0);

  // Load meeting count to personalize suggestions
  useEffect(() => {
    fetch("http://localhost:8000/api/meetings")
      .then((res) => res.json())
      .then((data) => setMeetingsCount(data.length))
      .catch((err) => console.error(err));
  }, []);

  const handleSendChat = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add User message
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setChatInput("");
    
    try {
      setLoading(true);
      
      // Let's call the backend to get a mock/AI answer or answer generally
      // We can call /ask endpoint for meeting ID 1 if meetings exist, or just use general fetch
      const res = await fetch("http://localhost:8000/api/meetings/1/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: "fred", text: data.answer }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      // General QA chatbot response if meetings database is empty or offline
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "fred",
            text: `I've analyzed your queries. You currently have ${meetingsCount} meetings synced. I can help list action items, summarize meetings, or answer questions about discussions if you select a meeting from your library.`
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { text: "List my action items & todos for this week", icon: CheckSquare },
    { text: "Summarize my last meeting", icon: FileText },
    { text: "Prepare me for the upcoming meeting", icon: List },
    { text: "Connect Gmail, Notion, and 30+ sources for richer insights.", icon: Grid },
    { text: "Prepare weekly digest, based on my meetings", icon: Calendar },
  ];

  const renderChatInput = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendChat(chatInput);
        }}
        className="w-full max-w-3xl mx-auto rounded-2xl border border-violet-200 bg-white focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all flex flex-col overflow-hidden shadow-sm"
      >
        <textarea
          rows={3}
          placeholder="Ask anything across your meetings, channels, and people"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendChat(chatInput);
            }
          }}
          className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none resize-none p-4 pb-12 pt-4 align-top"
        />
        
        <div className="flex justify-between items-center border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 font-bold bg-slate-50/50">
          {/* Connector icon left */}
          <button
            type="button"
            className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Connectors"
          >
            <Grid size={15} />
          </button>

          {/* Model select & Send button right */}
          <div className="flex items-center gap-3">
            <select className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 outline-none text-[10px] font-extrabold text-slate-500 cursor-pointer">
              <option>Sonnet 4.6 (Auto)</option>
              <option>Gemini 1.5 Flash</option>
              <option>GPT-4o Mini</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 shadow shadow-violet-200 transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowUp size={14} className="text-white font-bold" />
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderSuggestionsList = () => {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 flex flex-col items-start text-left space-y-4 pl-4">
        {suggestions.map((sug, idx) => {
          const Icon = sug.icon;
          return (
            <div
              key={idx}
              onClick={() => handleSendChat(sug.text)}
              className="flex items-center gap-3 cursor-pointer group text-xs font-semibold text-slate-500 hover:text-violet-600 transition-colors"
            >
              <Icon size={16} className="text-slate-400 group-hover:text-violet-500 transition-colors shrink-0" />
              <span>{sug.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden select-none">
      {/* Left Sidebar Chat List Panel */}
      <div className="w-64 bg-transparent p-4.5 flex flex-col justify-between shrink-0">
        <div className="space-y-5 flex-1 flex flex-col overflow-hidden">
          {/* New Chat Button */}
          <div className="pb-1">
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-2 px-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Plus size={15} className="text-slate-400" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
            />
          </div>

          <button className="flex items-center gap-2 px-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            <Grid size={15} className="text-slate-400" />
            <span>Connectors</span>
          </button>

          {/* Chat history logs placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3 border-t border-slate-100 mt-2 overflow-y-auto">
            <div className="h-2 w-16 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="h-2 w-12 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="text-[11px] font-bold text-slate-800">No chats yet</div>
            <p className="text-[10px] font-semibold text-slate-400 leading-normal">
              Your chats will appear here once you start one.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 bg-transparent p-6 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
            {/* 1. The Greeting */}
            <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight text-center mb-6">
              Hi TAMARAKANDI, how can I help today?
            </h2>

            {/* 2. The Chat Input Box */}
            <div className="w-full">
              {renderChatInput()}
            </div>

            {/* 3. The Suggestions List */}
            <div className="w-full">
              {renderSuggestionsList()}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Messages view */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-5 pb-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-4 items-start animate-in fade-in duration-200">
                    {msg.sender === "fred" ? (
                      <img
                        src="/fred.png"
                        alt="Fred"
                        className="h-8 w-8 object-contain bg-white p-1.5 rounded-xl border border-slate-100"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                        T
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {msg.sender === "fred" ? "AskFred AI" : "TAMARAKANDI"}
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-slate-700 whitespace-pre-line">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 items-center text-[10px] text-slate-400 font-bold ml-12">
                    <Loader2 size={12} className="animate-spin text-violet-600" />
                    <span>Fred is searching transcripts...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input box at bottom of active chat thread */}
            <div className="pt-4 space-y-2 shrink-0 border-t border-slate-100">
              {renderChatInput()}
              <div className="text-center text-[10px] font-bold text-slate-400">
                Consumes AI credits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
