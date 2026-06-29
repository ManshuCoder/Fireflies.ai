"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldAlert, 
  BarChart3, 
  Megaphone, 
  User, 
  Smile, 
  X,
  ShieldCheck,
  Bell,
  Sparkles,
  Activity,
  BookOpen,
  Terminal,
  Cookie,
  Users,
  UserCheck,
  HelpCircle
} from "lucide-react";

export default function PrivacySettingsPage() {
  // Toggle states for cookies
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  
  // Feedback card state
  const [showFeedbackCard, setShowFeedbackCard] = useState(true);

  // Tabs structure
  const personalTabs = [
    { name: "Recording & Privacy", icon: ShieldCheck, href: "/settings" },
    { name: "Compliance Notification", icon: Bell, href: "/settings" },
    { name: "AI settings", icon: Sparkles, href: "/settings" },
    { name: "Live meeting", icon: Activity, href: "/settings" },
    { name: "Knowledge base", icon: BookOpen, href: "/settings" },
    { name: "Developer settings", icon: Terminal, href: "/settings" },
    { name: "Cookies & analytics", icon: Cookie, href: "/settings/privacy", isActive: true },
  ];

  return (
    <div className="flex bg-white min-h-[calc(100vh-120px)] rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-slate-800 font-sans select-none">
      
      {/* 1. Left sub-navigation sidebar */}
      <div className="w-[240px] border-r border-slate-100 p-5 flex flex-col justify-between shrink-0 bg-slate-50/50">
        <div className="space-y-6">
          {/* Back link */}
          <Link 
            href="/settings"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span>Back</span>
          </Link>

          {/* Toggle Tab Switcher (Personal / Team) */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex gap-0.5">
            <button className="flex-1 rounded bg-white py-1 text-[10px] font-extrabold text-slate-800 shadow-sm cursor-pointer">
              Personal
            </button>
            <Link 
              href="/settings?tab=team" 
              className="flex-1 rounded py-1 text-[10px] font-extrabold text-slate-400 hover:text-slate-700 text-center cursor-pointer block"
            >
              Team
            </Link>
          </div>

          {/* Personal Settings List */}
          <div className="space-y-1 text-left">
            {personalTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${
                    tab.isActive
                      ? "bg-violet-50 text-violet-700 font-bold"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-850"
                  }`}
                >
                  <TabIcon size={14} className={tab.isActive ? "text-violet-600" : "text-slate-400"} />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom items */}
        <div className="space-y-4 pt-6 border-t border-slate-100/80">
          <div className="space-y-1 text-left">
            <Link href="/settings?tab=team" className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-850">
              <Users size={14} className="text-slate-400" />
              <span>Members and groups</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-850">
              <UserCheck size={14} className="text-slate-400" />
              <span>Account</span>
            </Link>
            <a href="#" className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-850">
              <HelpCircle size={14} className="text-slate-400" />
              <span>Support</span>
            </a>
          </div>

          {/* Feedback popup card */}
          {showFeedbackCard && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm relative text-left">
              <button 
                onClick={() => setShowFeedbackCard(false)}
                className="absolute top-2 right-2 text-slate-350 hover:text-slate-600 cursor-pointer"
              >
                <X size={11} />
              </button>
              <div className="flex gap-2.5 items-start">
                <Smile size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-[10px] font-extrabold text-slate-800">
                    Did you like the settings?
                  </div>
                  <a href="#" className="text-[9px] font-extrabold text-[#5f25e6] hover:underline block">
                    Share Feedback
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Content Panel (Cookies) */}
      <div className="flex-1 p-8 text-left space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Cookies</h3>

        {/* Gray Container Block */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 space-y-4 max-w-2xl">
          
          {/* Card 1: Functionality and Security */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-100/50 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex gap-3.5 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shrink-0 border border-slate-100/50">
                <ShieldAlert size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Functionality and Security</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Authentication, security features, and core application functionality.
                </p>
              </div>
            </div>
            {/* Disabled locked switch */}
            <div className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-slate-200/80 cursor-not-allowed">
              <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-350 shadow translate-x-4" />
            </div>
          </div>

          {/* Card 2: Analytics Cookies */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-100/50 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex gap-3.5 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shrink-0 border border-slate-100/50">
                <BarChart3 size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Analytics Cookies</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Tells us which features you use so we can fix issues and improve the product over time.
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                analyticsEnabled ? "bg-[#5f25e6]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  analyticsEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Card 3: Advertising Cookies */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-100/50 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex gap-3.5 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shrink-0 border border-slate-100/50">
                <Megaphone size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Advertising Cookies</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Lets us show you relevant Fireflies ads on other platforms. Turn off to see generic ads instead.
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => setAdvertisingEnabled(!advertisingEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                advertisingEnabled ? "bg-[#5f25e6]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  advertisingEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Card 4: Personalization Cookies */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-100/50 flex items-start justify-between gap-4 shadow-sm">
            <div className="flex gap-3.5 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shrink-0 border border-slate-100/50">
                <User size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Personalization Cookies</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Remembers your settings and tailors suggestions based on how you use Fireflies.
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => setPersonalizationEnabled(!personalizationEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                personalizationEnabled ? "bg-[#5f25e6]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  personalizationEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
