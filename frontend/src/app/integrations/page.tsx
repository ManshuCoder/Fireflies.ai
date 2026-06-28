"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Check, Plus, ExternalLink } from "lucide-react";

export default function IntegrationsPage() {
  const [activeSubTab, setActiveSubTab] = useState("Discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Audio recording", "Applicant tracking system", "CRM", "More"];

  const integrations = [
    {
      name: "ActiveCampaign",
      description: "Sync Fireflies meeting notes to ActiveCampaign CRM and keep your contacts and companies automatically...",
      logo: "A",
      bgLogo: "bg-blue-600",
    },
    {
      name: "Activepieces",
      description: "Activepieces offers a no-code integration with Fireflies.ai, enabling users to automate workflows involving meeting...",
      logo: "Ap",
      bgLogo: "bg-purple-600",
    },
    {
      name: "Affinity",
      description: "Automatically sync meeting data and tasks to the relevant people and companies in Affinity, streamlining your...",
      logo: "Af",
      bgLogo: "bg-sky-600",
    },
    {
      name: "Aircall",
      description: "Automatically capture, transcribe, and generate meeting notes for calls made through Aircall.",
      logo: "Ai",
      bgLogo: "bg-emerald-600",
    },
    {
      name: "Airtable",
      description: "Automatically push meeting data and summaries to your Airtable bases",
      logo: "At",
      bgLogo: "bg-yellow-500",
    },
    {
      name: "Allo",
      description: "Automatically capture, transcribe, and generate meeting notes for calls made and recorded through Allo.",
      logo: "Al",
      bgLogo: "bg-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("Discover")}
          className={`px-6 py-3 text-xs font-bold transition-all relative ${
            activeSubTab === "Discover"
              ? "text-violet-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Discover
          {activeSubTab === "Discover" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("Connected")}
          className={`px-6 py-3 text-xs font-bold transition-all relative ${
            activeSubTab === "Connected"
              ? "text-violet-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Connected
          {activeSubTab === "Connected" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></span>
          )}
        </button>
      </div>

      {/* Main Slack Banner Hero */}
      <div className="rounded-3xl bg-green-50/55 border border-green-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 font-bold text-xl text-slate-800">
              #
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Slack
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                  NEW
                </span>
              </h3>
            </div>
          </div>
          
          <p className="text-xs font-semibold leading-relaxed text-slate-500">
            Fireflies works for you inside Slack. Summarize Slack channels and threads, ask questions about your meetings, run web searches, and send meeting notes to Slack.
          </p>

          <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition-all">
            <Plus size={14} />
            <span>Connect</span>
          </button>
        </div>

        {/* Hero image placeholder matching Image 1 */}
        <div className="w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shrink-0">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-red-400"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <div className="text-[10px] font-bold text-slate-400 ml-2">Fireflies 10:40 AM</div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded bg-slate-100"></div>
            <div className="h-3 w-1/2 rounded bg-slate-100"></div>
            <div className="rounded-lg bg-violet-50 p-2.5 text-[10px] font-bold text-violet-700 mt-2 leading-tight">
              @Fireflies What was discussed in my last meeting with Sam?
            </div>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
        {/* Categories selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? "border-violet-600 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search filter */}
        <div className="relative w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations
          .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm ${item.bgLogo}`}>
                    {item.logo}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>Fireflies Integration</span>
                <span className="flex items-center gap-1 text-violet-600 cursor-pointer hover:underline">
                  Configure <ExternalLink size={10} />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
