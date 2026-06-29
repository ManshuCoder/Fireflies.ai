"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  MessageSquare,
  ListCollapse,
  Video,
  Upload,
  Layers,
  Activity,
  BarChart2,
  Bot,
  Sparkles,
  Users,
  Star,
  Settings,
  MoreHorizontal,
  Search,
  Bell,
  Mic,
  ChevronDown,
  X,
  ShieldCheck,
  Zap,
  Play,
  FileText,
  Send,
  ChevronsLeft,
  ChevronsRight,
  Hash,
  ListMusic,
  Contact,
  Download,
  ListFilter,
  Check,
  Edit3,
  Link2,
  Calendar,
  Smartphone,
  ArrowRight,
  Laptop,
} from "lucide-react";

import MoreMenuTrigger from "./MoreMenuTrigger";

const IntegrationsIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 4-10 5 10 5 10-5-10-5Z" />
    <path d="m2 14 10 5 10-5" />
  </svg>
);

const ChromeIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(true);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Notification Popover States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<"All" | "Updates" | "Status">("Updates");
  const [isUnreadChecked, setIsUnreadChecked] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status");

  // Capture Modal State
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  // Click outside to close the profile menu
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowProfileMenu(false);
    };
    if (showProfileMenu) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showProfileMenu]);

  // Click outside to close the Capture dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsMoreDropdownOpen(false);
    };
    if (isMoreDropdownOpen) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMoreDropdownOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleUrlChange = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("capture") === "true") {
          setShowCaptureModal(true);
        } else {
          setShowCaptureModal(false);
        }
      };
      handleUrlChange();
      window.addEventListener("popstate", handleUrlChange);
      return () => window.removeEventListener("popstate", handleUrlChange);
    }
  }, [pathname]);

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname.startsWith("/integrations")) {
      setActiveTab("Integrations");
    } else if (pathname.startsWith("/agents")) {
      setActiveTab("Voice Agents");
    } else if (pathname.startsWith("/skills")) {
      setActiveTab("AI Skills");
    } else if (pathname.startsWith("/meetings")) {
      setActiveTab("Meetings");
    } else if (pathname.startsWith("/askfred")) {
      setActiveTab("AskFred");
    } else if (pathname.startsWith("/analytics")) {
      setActiveTab("Analytics");
    } else if (pathname.startsWith("/settings")) {
      setActiveTab("Settings");
    } else if (pathname.startsWith("/status")) {
      setActiveTab("Meeting Status");
    } else if (pathname.startsWith("/upload")) {
      setActiveTab("Uploads");
    } else {
      setActiveTab("Home");
    }
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "AskFred", href: "/askfred", icon: MessageSquare, badge: "" },
    { name: "Meetings", href: "/meetings", icon: Video },
    { name: "Meeting Status", href: "/status", icon: Activity },
    { name: "Uploads", href: "/upload", icon: Upload },
    { name: "Integrations", href: "/integrations", icon: IntegrationsIcon },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Voice Agents", href: "/agents", icon: Bot, badge: "NEW" },
    { name: "AI Skills", href: "/skills", icon: Sparkles },
    { name: "Team", href: "/settings?tab=team", icon: Users },
    { name: "Upgrade", href: "/upgrade", icon: Star, color: "text-amber-500" },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Lavender Notice Banner (Full Width on Top) */}
      {showBanner && (
        <div className="flex h-9 items-center justify-between bg-[#f4f3ff] border-b-[0.5px] border-violet-100 px-6 text-sm font-normal text-slate-800 select-none transition-all w-full shrink-0">
          <div className="flex items-center gap-1 mx-auto">
            <span>You are eligible for 7 days business plan free trial.</span>
            <a href="#" className="no-underline text-[#5f25e6] hover:text-[#4f12b3] ml-1 font-semibold flex items-center gap-0.5">
              Start free trial <span className="no-underline">→</span>
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="rounded p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Sidebar & Main Split Container */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        {!isSettingsPage && (
          <aside className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shrink-0 overflow-visible relative z-40 ${
            isCollapsed ? "w-20" : "w-64"
          }`}>
        {/* Logo */}
        {isCollapsed ? (
          <div className="flex h-16 items-center justify-center border-b border-slate-100 px-4 group/header relative">
            <div className="group-hover/header:hidden flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="Fireflies Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="hidden group-hover/header:block relative group/tooltip">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="rounded-xl border border-slate-200 bg-white p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <ChevronsRight size={16} />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover/tooltip:block bg-slate-950 text-white text-[10px] font-extrabold py-1 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-lg ring-1 ring-black/5">
                Open sidebar
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 group/header relative">
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="Fireflies Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900">
                fireflies.ai
              </span>
            </div>
            <div className="relative group/tooltip opacity-0 group-hover/header:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="rounded-xl border border-slate-200 bg-white p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <ChevronsLeft size={16} />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover/tooltip:block bg-slate-950 text-white text-[10px] font-extrabold py-1 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-lg ring-1 ring-black/5">
                Collapse sidebar
              </div>
            </div>
          </div>
        )}

        {/* Navigation Link List */}
        <nav className={`flex-1 overflow-y-auto scroll-nice py-6 space-y-1.5 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <React.Fragment key={item.name}>
                <div className="relative group/tooltip">
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (["AskFred", "Meetings", "Upgrade"].includes(item.name)) {
                        setIsCollapsed(true);
                      } else if (item.name === "Meeting Status") {
                        setIsCollapsed(false);
                      }
                    }}
                    className={`flex items-center transition-all duration-200 ${
                      isCollapsed ? "justify-center p-3" : "justify-between pl-2.5 pr-4 py-2.5 text-sm font-semibold"
                    } ${
                      isActive
                        ? "bg-violet-50 text-violet-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.name === "AskFred" ? (
                        <img
                          src="/fred.png"
                          alt="AskFred"
                          className="h-[20px] w-[20px] object-contain"
                        />
                      ) : (
                        <Icon
                          size={20}
                          className={`${isActive ? "text-violet-600" : "text-slate-400"} ${
                            item.color || ""
                          }`}
                        />
                      )}
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className="relative overflow-hidden rounded-[6px] bg-gradient-to-r from-[#10b981] to-[#059669] px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white shadow-[0_1px_3px_rgba(16,185,129,0.15)] flex items-center justify-center min-w-[34px] h-[18px]">
                        <span className="relative z-10">{item.badge}</span>
                        <div className="absolute inset-0 animate-sweep pointer-events-none"></div>
                      </span>
                    )}
                  </Link>

                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover/tooltip:block bg-slate-950 text-white text-[10px] font-extrabold py-1.5 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-lg ring-1 ring-black/5">
                      {item.name}
                    </div>
                  )}
                </div>
                {["Uploads", "Analytics", "AI Skills"].includes(item.name) && (
                  <div className="border-b border-slate-100 my-1.5 mx-4"></div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* More Button Container (Outside scrollable nav to prevent overflow clipping!) */}
        <div className={`py-1.5 shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}>
          <MoreMenuTrigger isCollapsed={isCollapsed} />
        </div>

        {/* Sidebar Footer */}
        <div className={`border-t border-slate-100 py-4 space-y-4 ${
          isCollapsed ? "px-2" : "px-4"
        }`}>
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                <ShieldCheck size={14} />
                <span>Your Privacy Choices</span>
              </div>

              {/* Invite coworkers card */}
              {showInviteCard && (
                <div className="rounded-2xl bg-violet-50/50 border border-violet-100 p-3.5 relative space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setShowInviteCard(false)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                  <div className="text-[11px] font-extrabold text-slate-800 leading-tight pr-4">
                    Invite coworkers to your Fireflies team
                  </div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1 rounded-md bg-violet-600 py-2 text-[10px] font-bold text-white hover:bg-violet-700 shadow-sm transition-all"
                  >
                    <span>+ Create Team</span>
                  </button>
                </div>
              )}
            </>
          )}


        </div>
      </aside>
      )}

        {/* Main Workspace Column */}
        <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex h-[52px] items-center justify-between border-b-[0.5px] border-slate-200 bg-white px-3 shrink-0">
          {/* Section Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-slate-900">{activeTab}</h1>
          </div>

          {/* Search bar */}
          <div className="relative w-96 max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or keyword    (Ctrl + K)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4.5">
            <div className="relative group/unlimited">
              <span className="hidden text-xs font-bold text-slate-400 lg:inline-block cursor-pointer hover:text-slate-600 transition-colors">
                Unlimited Meetings
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/unlimited:block bg-[#f8fafc] border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 rounded-lg shadow-md whitespace-nowrap z-50">
                Unlimited transcription & summary
              </div>
            </div>

            {/* Upgrade Button */}
            <Link
              href="/upgrade"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-[#E6FDF4] hover:text-emerald-800 transition-all duration-200 block text-center cursor-pointer"
            >
              Upgrade
            </Link>             {/* Split Capture Button */}
            <div className="flex items-center rounded-md bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 overflow-visible relative transition-all duration-200">
              {/* Left Capture Button */}
              <div className="relative group/capture">
                <button 
                  onClick={() => {
                    setShowCaptureModal(true);
                    const url = new URL(window.location.href);
                    url.searchParams.set("capture", "true");
                    window.history.pushState({}, "", url.toString());
                    window.dispatchEvent(new Event("popstate"));
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white transition-all duration-200 cursor-pointer bg-transparent border-0 rounded-l-md"
                >
                  <Video size={14} />
                  <span>Capture</span>
                </button>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 hidden group-hover/capture:block bg-[#f8fafc] border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 rounded-lg shadow-md whitespace-nowrap z-50">
                  Capture live meeting
                </div>
              </div>

              {/* Vertical line separator (Invisible line separator) */}
              <div className="w-[1px] h-4 bg-transparent shrink-0"></div>

              {/* Right Arrow Button */}
              <div className="relative group/more">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreDropdownOpen(!isMoreDropdownOpen);
                  }}
                  className="flex items-center justify-center px-2 py-2 text-xs font-bold text-white transition-all duration-200 cursor-pointer h-full bg-transparent border-0 rounded-r-md"
                >
                  <ChevronDown size={12} />
                </button>
                {/* Tooltip */}
                {!isMoreDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 hidden group-hover/more:block bg-[#f8fafc] border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 rounded-lg shadow-md whitespace-nowrap z-50">
                    More
                  </div>
                )}
              </div>

              {/* Dropdown menu (from 3rd image) */}
              {isMoreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setIsMoreDropdownOpen(false);
                      setShowCaptureModal(true);
                      const url = new URL(window.location.href);
                      url.searchParams.set("capture", "true");
                      window.history.pushState({}, "", url.toString());
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer border-0"
                  >
                    <Video size={14} className="text-slate-400" />
                    <span>Add to live meeting</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreDropdownOpen(false);
                      window.location.href = "/?schedule=true";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer border-0"
                  >
                    <Calendar size={14} className="text-slate-400" />
                    <span>Schedule new meeting</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreDropdownOpen(false);
                      window.location.href = "/upload";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer border-0"
                  >
                    <Upload size={14} className="text-slate-400" />
                    <span>Upload audio or video</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreDropdownOpen(false);
                      alert("Starting live audio recording...");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer border-0"
                  >
                    <Mic size={14} className="text-slate-400" />
                    <span>Start recording</span>
                  </button>
                </div>
              )}
            </div>

            {/* Record Microphone Button */}
            <div className="relative group/mic">
              <button
                onClick={() => alert("Starting live audio recording...")}
                className="relative rounded-xl p-2 text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer"
              >
                <Mic size={16} />
              </button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/mic:block bg-[#f8fafc] border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 rounded-lg shadow-md whitespace-nowrap z-50">
                Record audio
              </div>
            </div>

            {/* Bell Notification Button and Popover */}
            <div className="relative group/bell">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-600 animate-pulse"></span>
              </button>
              {/* Tooltip */}
              {!isNotificationOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/bell:block bg-[#f8fafc] border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 rounded-lg shadow-md whitespace-nowrap z-50">
                  Notification
                </div>
              )}

              {/* Notification Popover */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-[380px] rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_15px_45px_rgba(0,0,0,0.15)] z-50 text-left space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setNotificationTab("All")}
                        className={`text-xs font-bold transition-colors cursor-pointer ${
                          notificationTab === "All" ? "text-slate-900 border-b-2 border-slate-900 pb-0.5" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setNotificationTab("Updates")}
                        className={`text-xs font-bold transition-colors cursor-pointer ${
                          notificationTab === "Updates" ? "text-slate-900 border-b-2 border-slate-900 pb-0.5" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Updates
                      </button>
                      <button
                        onClick={() => setNotificationTab("Status")}
                        className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                          notificationTab === "Status" ? "text-slate-900 border-b-2 border-slate-900 pb-0.5" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <span>Status</span>
                        <span className="rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-extrabold text-emerald-700 uppercase">
                          New
                        </span>
                      </button>
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUnreadChecked}
                          onChange={(e) => setIsUnreadChecked(e.target.checked)}
                          className="rounded border-slate-200 text-violet-600 focus:ring-violet-500 h-3 w-3 cursor-pointer"
                        />
                        <span>Unread</span>
                      </label>
                      <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer">
                        <Edit3 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-100 w-full"></div>

                  {/* Popover Body Content */}
                  <div className="min-h-[160px] flex flex-col justify-between">
                    {/* Updates & All Tab */}
                    {(notificationTab === "Updates" || notificationTab === "All") && (
                      <div className="space-y-3.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          New
                        </div>

                        <div className="flex gap-3 hover:bg-slate-50/50 p-1.5 rounded-xl transition-colors">
                          {/* Circle Icon Badge */}
                          <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Check size={14} className="stroke-[3]" />
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-extrabold text-slate-800 leading-tight">
                                Watch the admin controls webinar 🔴
                              </h4>
                              <span className="text-[9px] font-semibold text-slate-400 shrink-0 mt-0.5">
                                06:53 AM
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
                              Learn how to manage privacy, admin controls, and Rules Engine workspace workflows.
                            </p>
                            
                            {/* CTA Link */}
                            <button
                              onClick={() => alert("Launching Webinar Webinar recording player...")}
                              className="flex items-center gap-1 rounded-lg bg-[#5f25e6] hover:bg-[#4f12b3] px-3.5 py-1.5 text-[10px] font-extrabold text-white transition-all mt-2 cursor-pointer"
                            >
                              <span>Watch recording</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>

                        {/* caught up tag */}
                        <div className="text-center text-[10px] font-semibold text-slate-300 py-3">
                          You're all caught up
                        </div>
                      </div>
                    )}

                    {/* Status Tab */}
                    {notificationTab === "Status" && (
                      <div className="space-y-4 flex-1 flex flex-col justify-between">
                        {/* Status Filter Selector */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Processing Status
                          </span>
                          
                          {/* Filter Popover Anchor */}
                          <div className="relative">
                            <button
                              onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <ListFilter size={13} />
                            </button>

                            {statusFilterOpen && (
                              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-slate-100 bg-white py-1 shadow-xl ring-1 ring-black/5 z-50">
                                {["All Status", "Processing", "Completed", "Failed"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => {
                                      setSelectedStatusFilter(st);
                                      setStatusFilterOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                                  >
                                    <span>{st}</span>
                                    {selectedStatusFilter === st && <Check size={11} className="text-slate-500" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Center Empty State */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-2">
                          <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <Bell size={18} />
                          </div>
                          <h4 className="text-xs font-bold text-slate-800">No meeting status yet</h4>
                          <p className="text-[10px] font-semibold text-slate-400 max-w-[220px]">
                            The processing status of your meetings will show up here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dark Promo Footer */}
                  <div className="rounded-2xl bg-[#0B0827] border border-slate-800 p-3.5 flex items-center justify-between shadow-inner shrink-0">
                    <div className="flex items-center gap-3">
                      {/* F Symbol Icon */}
                      <div className="h-7 w-7 rounded-lg bg-pink-600 flex items-center justify-center text-white text-xs font-black shadow-inner">
                        F
                      </div>
                      
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-bold text-white leading-tight">
                          Fireflies Desktop App
                        </h5>
                        <p className="text-[8px] font-semibold text-slate-400">
                          Capture conversations without a bot.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Starting Desktop App installer download...")}
                      className="text-[10px] font-extrabold text-white flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>Download</span>
                      <Download size={10} className="stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mini Avatar */}
            <div className="relative">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="h-8 w-8 rounded-full bg-[#c01557] hover:bg-[#a00f45] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow transition-all select-none"
              >
                T
              </div>

              {/* Profile dropdown popover (matching the user image) */}
              {showProfileMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-3 w-[660px] rounded-3xl border border-slate-200 bg-[#f8fafc] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-3 duration-250 flex gap-4 text-left font-sans"
                >
                  {/* Left Column */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Card 1: Mobile App */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3.5 items-start">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500 shadow-inner shrink-0">
                        <Smartphone size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[13px] font-bold text-slate-800">Mobile App</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Transcribe and summarize in-person conversations with mobile app.
                        </p>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-2.5">
                        <a 
                          href="https://apps.apple.com/us/app/fireflies-ai-notetaker/id6463164203"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-2 border border-slate-200 hover:scale-105 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                        >
                          <img
                            src="/app_store_logo.png"
                            alt="App Store"
                            className="h-4.5 w-4.5 object-contain"
                          />
                        </a>
                        <a 
                          href="https://play.google.com/store/apps/details?id=ai.fireflies.mobile&pcampaignid=web_share"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-2 border border-slate-200 hover:scale-105 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                        >
                          <img
                            src="/play_store_logo.png"
                            alt="Google Play"
                            className="h-4.5 w-4.5 object-contain"
                          />
                        </a>
                      </div>
                    </div>

                    {/* Card 2: Chrome Extension */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3.5 items-start">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500 shadow-inner shrink-0">
                        <ChromeIcon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[13px] font-bold text-slate-800">Chrome Extension</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Record and transcribe Google Meet calls without Fireflies notetaker bot.
                        </p>
                      </div>
                      <a 
                        href="https://chromewebstore.google.com/detail/firefliesai-meeting-recor/lbeghdecmhlncigaljkolnciamafgkpe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-350 transition-all cursor-pointer shadow-sm"
                      >
                        Install
                      </a>
                    </div>

                    {/* Card 3: Download Desktop App (black/gradient banner) */}
                    <a
                      href="https://fireflies.ai/desktop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4 flex items-center justify-between text-white hover:opacity-95 transition-all cursor-pointer shadow-md group/desktop-banner"
                    >
                      <div className="text-[12px] font-semibold flex items-center gap-2.5">
                        <Laptop size={16} className="text-slate-300" />
                        <span>Download Fireflies Desktop App</span>
                      </div>
                      <ArrowRight size={14} className="text-white group-hover/desktop-banner:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Right Column */}
                  <div className="w-[250px] bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 text-left bg-slate-50/50">
                      <h4 className="text-[13px] font-bold text-slate-850">Hi TAMARAKANDI</h4>
                      <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5 block" title="tamarakandi.2201206cs@iiitbh.ac.in">
                        tamarakandi.2201206cs@iiitbh.ac.in
                      </span>
                    </div>

                    {/* Free Info */}
                    <div className="p-4 border-b border-slate-100 text-left">
                      <h5 className="text-xs font-bold text-slate-800">Free</h5>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                        Unlimited meetings
                      </span>
                    </div>

                    {/* Storage Info */}
                    <div className="p-4 border-b border-slate-100 text-left space-y-1.5">
                      <h5 className="text-xs font-bold text-slate-800">Storage</h5>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[0.5%] h-full bg-emerald-500 rounded-full"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        0 / 400 mins
                      </span>
                    </div>

                    {/* Menu links list */}
                    <div className="p-1.5 flex flex-col gap-0.5 bg-white">
                      {[
                        { name: "Refer and Earn $5", href: "/upgrade" },
                        { name: "Settings", href: "/settings" },
                        { name: "Manage Devices", href: "/settings?tab=devices" },
                        { name: "Platform rules", href: "/skills" },
                        { name: "Logout", href: "/" }
                      ].map((menuItem) => (
                        <Link
                          key={menuItem.name}
                          href={menuItem.href}
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full text-left text-xs font-semibold text-slate-750 rounded-xl px-3.5 py-2.5 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer block"
                        >
                          {menuItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Panel */}
        <main className={`flex-1 overflow-y-auto scroll-nice ${isSettingsPage ? "bg-white p-0" : "bg-slate-50 p-8"}`}>
          {children}
        </main>

        {/* Floating Help Widget */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
          {showHelpPanel && (
            <div className="w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5 duration-200 space-y-4 text-left">
              {/* Help Video Card */}
              <div className="relative group overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 cursor-pointer shadow-md">
                <div className="absolute inset-0 bg-violet-950/25 z-10 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-violet-600 shadow-lg group-hover:scale-105 transition-all">
                    <Play size={16} className="fill-violet-600 ml-0.5" />
                  </div>
                </div>
                <div className="h-36 w-full bg-violet-950 flex items-center justify-center text-white font-extrabold text-sm opacity-90">
                  Fireflies.ai
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white z-20">
                  <div className="text-[11px] font-extrabold flex items-center gap-1.5">
                    <Play size={10} className="fill-white" /> Watch Product Overview (5 min)
                  </div>
                  <div className="text-[9px] text-slate-300 font-bold mt-0.5">Settings, AI Skills, and more.</div>
                </div>
              </div>

              {/* Links list */}
              <div className="space-y-1 font-semibold text-slate-700">
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                  <Sparkles size={14} className="text-violet-600" />
                  <span>What's new?</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                  <FileText size={14} className="text-slate-400" />
                  <span>Help Center</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                  <Users size={14} className="text-slate-400" />
                  <span>Fireflies Community</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                  <Send size={14} className="text-slate-400" />
                  <span>Give Feedback</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                  <Mic size={14} className="text-slate-400" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          )}

          {/* Floating button */}
          <button
            type="button"
            onClick={() => setShowHelpPanel(!showHelpPanel)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-950 text-white hover:bg-violet-900 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {showHelpPanel ? <X size={20} /> : <span className="text-lg font-bold">?</span>}
          </button>
        </div>
      </div>

      {/* Add to Live Meeting Modal (Capture popup) */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-[460px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Add to live meeting
              </h3>
              <button
                onClick={() => {
                  setShowCaptureModal(false);
                  const url = new URL(window.location.href);
                  url.searchParams.delete("capture");
                  window.history.pushState({}, "", url.toString());
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Fields Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("AI Notetaker joining your meeting now...");
                setShowCaptureModal(false);
                const url = new URL(window.location.href);
                url.searchParams.delete("capture");
                window.history.pushState({}, "", url.toString());
              }}
              className="space-y-4"
            >
              {/* Name your meeting */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-slate-700 block">
                  Name your meeting <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g. Product team sync"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500 bg-white mt-1.5"
                />
              </div>

              {/* Meeting link */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-slate-700 block">
                  Meeting link
                </label>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Capture meetings from GMeet, Zoom, MS teams, and <a href="#" className="underline text-slate-400 hover:text-slate-600">more</a>.
                </span>
                
                {/* Input with Link Symbol */}
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-violet-500 mt-1.5">
                  <Link2 size={15} className="text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="https://zoom.us/s/77277195107"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 outline-none bg-white"
                  />
                </div>
              </div>

              {/* Meeting language */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-slate-700 block">
                  Meeting language
                </label>
                
                {/* Custom dropdown select */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer hover:bg-slate-50 transition-colors mt-1.5">
                  <span>English (Global)</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaptureModal(false);
                    setMeetingLink("");
                    const url = new URL(window.location.href);
                    url.searchParams.delete("capture");
                    window.history.pushState({}, "", url.toString());
                  }}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2.5 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!meetingLink.trim()}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                    meetingLink.trim() 
                      ? "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer shadow-md shadow-violet-200" 
                      : "bg-[#ECE9FF] text-[#BEB6FF] cursor-not-allowed"
                  }`}
                >
                  Start Capturing
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  </div>
  );
}
