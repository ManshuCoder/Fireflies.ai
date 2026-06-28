"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar, 
  Activity, 
  Video, 
  Upload, 
  Mic, 
  X, 
  Check, 
  ChevronDown 
} from "lucide-react";

export default function StatusPage() {
  const [showNotice, setShowNotice] = useState(true);
  
  // Dropdown Open States
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  // Selected Options
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Dropdown Refs for click-outside close behavior
  const dateRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (captureRef.current && !captureRef.current.contains(event.target as Node)) {
        setIsCaptureOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateOptions = [
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Custom date range"
  ];

  const statusOptions = [
    "All Status",
    "Processing",
    "Completed",
    "Failed",
    "Connection Failed",
    "In Waiting Room"
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] w-full select-none bg-white p-6 space-y-6 flex flex-col font-sans text-slate-800">
      
      {/* 1. Yellow Notification Banner */}
      {showNotice && (
        <div className="w-full bg-[#FFF9F2] border border-[#F3E6D5] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-1.5 mx-auto text-xs md:text-[13px] text-amber-900 font-medium">
            <span>Meeting status is moving into your notifications soon.</span>
            <a href="#" className="underline font-bold text-amber-950 hover:text-black">
              Check now
            </a>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-amber-600 hover:text-amber-900 transition-colors p-0.5 rounded cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. Top Navigation Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
        <div className="flex items-center gap-4 relative">
          
          {/* Date Filter Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => {
                setIsDateOpen(!isDateOpen);
                setIsStatusOpen(false);
                setIsCaptureOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Calendar size={14} className="text-slate-400" />
              <span>{selectedDate}</span>
              <ChevronDown size={13} className="text-slate-400 ml-0.5" />
            </button>

            {isDateOpen && (
              <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in duration-100">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedDate(opt);
                      setIsDateOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <span>{opt}</span>
                    {selectedDate === opt && <Check size={13} className="text-slate-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsDateOpen(false);
                setIsCaptureOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Activity size={14} className="text-slate-400" />
              <span>{selectedStatus}</span>
              <ChevronDown size={13} className="text-slate-400 ml-0.5" />
            </button>

            {isStatusOpen && (
              <div className="absolute left-0 mt-1.5 w-48 rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in duration-100">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedStatus(opt);
                      setIsStatusOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <span>{opt}</span>
                    {selectedStatus === opt && <Check size={13} className="text-slate-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Feedback Button */}
        <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          Feedback
        </button>
      </div>

      {/* 3. Empty State Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-6">
        
        {/* Cam illustration */}
        <div className="w-[84px] h-[64px] bg-[#f4f3ff] text-violet-600 rounded-2xl flex items-center justify-center border border-violet-100 shadow-inner">
          <Video size={30} className="stroke-[1.5]" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            No Meetings Yet
          </h3>
          <p className="text-xs font-semibold text-slate-400 max-w-xs leading-relaxed">
            Once meetings are held, you'll see their processing status here.
          </p>
        </div>

        {/* + Capture Button with Dropdown */}
        <div className="relative" ref={captureRef}>
          <button
            onClick={() => {
              setIsCaptureOpen(!isCaptureOpen);
              setIsDateOpen(false);
              setIsStatusOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#5f25e6] hover:bg-[#4f12b3] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 transition-all cursor-pointer"
          >
            <span className="text-sm font-extrabold">+</span>
            <span>Capture</span>
          </button>

          {isCaptureOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-xl border border-slate-100 bg-white py-1.5 shadow-2xl ring-1 ring-black/5 z-30 animate-in fade-in duration-100">
              
              <button 
                onClick={() => {
                  alert("Add to live meeting clicked");
                  setIsCaptureOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Video size={14} className="text-slate-400" />
                <span>Add to live meeting</span>
              </button>

              <button 
                onClick={() => {
                  alert("Schedule new meeting clicked");
                  setIsCaptureOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Calendar size={14} className="text-slate-400" />
                <span>Schedule new meeting</span>
              </button>

              <button 
                onClick={() => {
                  alert("Upload audio or video clicked");
                  setIsCaptureOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Upload size={14} className="text-slate-400" />
                <span>Upload audio or video</span>
              </button>

              <button 
                onClick={() => {
                  alert("Start recording clicked");
                  setIsCaptureOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Mic size={14} className="text-slate-400" />
                <span>Start recording</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
