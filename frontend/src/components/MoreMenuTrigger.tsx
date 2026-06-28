"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";

// 1. Custom SVG Icon Components (Strictly match requirements)
const SoundbitesIcon = () => (
  <svg 
    className="w-5 h-5 text-[#64748B]" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10v4M12 7v10M15 11v2" />
  </svg>
);

const PlaylistIcon = () => (
  <svg 
    className="w-5 h-5 text-[#64748B]" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="7.5" cy="12" r="1" fill="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 12h6" />
  </svg>
);

const TopicsTrackerIcon = () => (
  <svg 
    className="w-5 h-5 text-[#64748B]" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
  </svg>
);

const ContactsIcon = () => (
  <svg 
    className="w-5 h-5 text-[#64748B]" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h6M17 12h6M17 16h6" />
  </svg>
);

interface MoreMenuTriggerProps {
  isCollapsed: boolean;
}

export default function MoreMenuTrigger({ isCollapsed }: MoreMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 cursor-pointer ${
          isCollapsed ? "justify-center p-3 w-full" : "w-full px-4 py-3 gap-3.5 text-sm font-semibold"
        }`}
      >
        <MoreHorizontal size={18} className="text-slate-400" />
        {!isCollapsed && <span>More</span>}
      </button>

      {/* Floating white dropdown menu */}
      {isOpen && (
        <div className="absolute left-full ml-2 top-0 z-50 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 w-[180px] animate-in fade-in slide-in-from-left-2 duration-150">
          {[
            { label: "Soundbites", icon: SoundbitesIcon },
            { label: "Playlist", icon: PlaylistIcon },
            { label: "Topics Tracker", icon: TopicsTrackerIcon },
            { label: "Contacts", icon: ContactsIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => {
                  alert(`${item.label} selected!`);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-[15px] font-normal text-[#475569]"
              >
                <Icon />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
