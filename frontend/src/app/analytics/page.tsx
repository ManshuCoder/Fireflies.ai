"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, X } from "lucide-react";

export default function AnalyticsPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full select-none overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/50 p-8">
      {/* Blurred Mock Background Dashboard (Matching analytics dashboard structure) */}
      <div className="space-y-8 opacity-25 blur-[3px]">
        {/* Row 1: Header summary cards */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Total Meetings", val: "148" },
            { label: "Total Duration", val: "4,250 mins" },
            { label: "Sentiment Index", val: "84%" },
            { label: "Action Items Done", val: "91%" },
          ].map((card, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold text-slate-400">{card.label}</span>
              <h4 className="text-xl font-extrabold text-slate-800 mt-1">{card.val}</h4>
            </div>
          ))}
        </div>

        {/* Row 2: Charts and tables */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-64 flex flex-col justify-between">
            <h4 className="text-sm font-bold text-slate-800">Meeting Trends</h4>
            <div className="h-40 w-full bg-slate-100/50 rounded-xl flex items-end p-4 justify-between">
              {[30, 45, 60, 20, 80, 55, 90, 70].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-8 bg-violet-200 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-64 flex flex-col justify-between">
            <h4 className="text-sm font-bold text-slate-800">Speaker Engagement</h4>
            <div className="h-40 w-full rounded-full border-[14px] border-violet-100 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500">64% Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Account Modal Overlay in Center */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-20">
        <div className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_10px_35px_rgba(0,0,0,0.12)] text-center space-y-6 animate-in zoom-in-95 duration-200">
          {/* Yellow Star Badge */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-4 ring-amber-100/50">
            <Star className="h-6 w-6 fill-amber-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Upgrade your account to view analytics
            </h3>
            <p className="text-xs font-semibold leading-relaxed text-slate-500 max-w-sm mx-auto">
              You are on the free plan. To view your analytics please upgrade to business plan
            </p>
          </div>

          <div className="flex items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setShowDemoForm(true)}
              type="button"
              className="rounded-xl border border-emerald-200 bg-[#E6FDF4] py-2.5 px-5 text-xs font-bold text-[#059669] hover:bg-emerald-100 transition-all cursor-pointer"
            >
              Request free trial
            </button>
            
            <Link
              href="/upgrade"
              className="rounded-xl bg-violet-600 py-2.5 px-5 text-xs font-bold text-white hover:bg-violet-700 shadow-md shadow-violet-200 transition-all cursor-pointer block text-center"
            >
              Upgrade account
            </Link>
          </div>
        </div>
      </div>

      {/* Request Free Trial Demo Form Modal Overlay (Dark Purple/Navy Backdrop & Form) */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto scroll-nice">
          <div className="relative w-full max-w-[760px] bg-[#0B0827] rounded-3xl border border-slate-800 shadow-2xl p-8 md:p-10 my-8 space-y-6 animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto scroll-nice">
            {/* Close Button X */}
            <button
              onClick={() => setShowDemoForm(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header Title Section */}
            <div className="text-center space-y-2.5">
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                Get a Personalized Demo with Fireflies.ai
              </h2>
              <p className="text-[12px] md:text-[13px] leading-relaxed text-slate-300 font-normal max-w-xl mx-auto">
                Trusted by{" "}
                <span className="font-black text-white">500K+ businesses</span>{" "}
                and{" "}
                <span className="font-black text-white">20M+ users</span>{" "}
                to automatically transform meetings into a powerful, automated knowledge base
              </p>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Demo Request Submitted Successfully!");
                setShowDemoForm(false);
              }}
              className="space-y-4"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    First Name*
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 focus:bg-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Work Email*
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 focus:bg-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Company Size*
                  </label>
                  <select
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#0B0827] px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    I'm interested in getting Fireflies for*
                  </label>
                  <select
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#0B0827] px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    <option>Sales & Customer Success</option>
                    <option>Product & Engineering</option>
                    <option>Recruiting & HR</option>
                    <option>Executive & General Operations</option>
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  How many people would use Fireflies.ai?*
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-700 bg-[#0B0827] px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option>Only me</option>
                  <option>2-10 users</option>
                  <option>11-50 users</option>
                  <option>50+ users</option>
                </select>
              </div>

              {/* Row 5 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  What is the nature of your inquiry?*
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-700 bg-[#0B0827] px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option>Evaluate for my team</option>
                  <option>Personal use</option>
                  <option>Partnership inquiry</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Row 6 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  What were you hoping to learn more about?*
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter details..."
                  className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-violet-500 focus:bg-white/10 resize-none"
                />
              </div>

              {/* Submit Demo Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-violet-600 py-3 text-center text-xs font-bold text-white hover:bg-violet-700 transition-all shadow-md shadow-violet-800/30 cursor-pointer"
                >
                  Book Your Demo Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
