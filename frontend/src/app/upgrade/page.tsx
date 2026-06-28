"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Free",
      isFree: true,
      subtitle: "For individuals starting with Fireflies",
      priceMonthly: 0,
      priceAnnual: 0,
      badge: null,
      primaryFeatures: [
        "Unlimited transcription",
        "Unlimited AI summaries",
        "400 mins of storage/team"
      ],
      extraHeader: "Features",
      extraFeatures: [
        { text: "Record Zoom, GMeet, MS Teams, more", underline: true },
        { text: "Transcription in 100+ languages" },
        { text: "Real-time notes & live transcriptions" },
        { text: "Meeting search" },
        { text: "AskFred - AI assistant" },
        { text: "Soundbites" },
        { text: "Audio/video uploads" },
        { text: "Chrome extension" },
        { text: "Fireflies mobile app", hasStoreIcons: true },
        { text: "Desktop app (Download)", underline: true },
        { text: "API access" }
      ],
      buttonText: "Current",
      isCurrent: true
    },
    {
      name: "Pro",
      subtitle: "Best suited for individuals and small teams",
      priceMonthly: 18,
      priceAnnual: 10,
      badge: null,
      primaryFeatures: [
        "Unlimited transcription",
        "Unlimited AI summaries",
        "8,000 mins of storage/seat"
      ],
      extraHeader: "Everything in Free, plus",
      extraFeatures: [
        { text: "Capture meeting video" },
        { text: "Download transcripts, summaries, recordings" },
        { text: "Personal Assistant", underline: true },
        { text: "Action items & Task Manager" },
        { text: "AI Skills" },
        { text: "Voice Agents" },
        { text: "Bulk Delete" },
        { text: "Unlimited public channels" },
        { text: "Unlimited integrations" },
        { text: "20 AI credits" }
      ],
      buttonText: "Upgrade",
      hasRateLimits: true
    },
    {
      name: "Business",
      subtitle: "Manage your fast growing team or business",
      priceMonthly: 29,
      priceAnnual: 19,
      badge: "MOST POPULAR",
      primaryFeatures: [
        "Unlimited transcription",
        "Unlimited AI summaries",
        "Unlimited storage"
      ],
      extraHeader: "Everything in Pro, plus",
      extraFeatures: [
        { text: "Multi-language mode" },
        { text: "Conversation intelligence" },
        { text: "Team analytics (For admins)" },
        { text: "Unlimited public & private channels" },
        { text: "User groups" },
        { text: "Public meeting access" },
        { text: "Priority support" },
        { text: "30 AI credits" }
      ],
      buttonText: "Upgrade",
      hasRateLimits: true
    },
    {
      name: "Enterprise",
      subtitle: "For advanced security, control & support",
      priceMonthly: 49,
      priceAnnual: 39,
      badge: null,
      primaryFeatures: [
        "Unlimited transcription",
        "Unlimited AI summaries",
        "Unlimited storage"
      ],
      extraHeader: "Everything in Business, plus",
      extraFeatures: [
        { text: "Rules engine", isNew: true },
        { text: "Super admin role" },
        { text: "Custom data retention" },
        { text: "Transcript + Summary only mode" },
        { text: "Onboarding program" },
        { text: "Dedicated account manager" },
        { text: "SSO + SCIM" },
        { text: "Audit Logs (API)", isNew: true },
        { text: "Private storage" },
        { text: "HIPAA compliance" },
        { text: "Dedicated support" },
        { text: "Payments by invoice*" },
        { text: "50 AI credits" }
      ],
      buttonText: "Upgrade",
      hasRateLimits: true
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-6 overflow-y-auto select-none font-sans text-slate-800">
      {/* Title Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          You are on the <span className="text-violet-600">Free</span> plan
        </h2>
        <p className="text-sm font-semibold text-slate-400">
          You need to upgrade your plan to perform this action.
        </p>
      </div>

      {/* Monthly / Annual Toggle Switch */}
      <div className="flex justify-center mb-12">
        <div className="flex bg-slate-50 border border-slate-200/60 p-1 rounded-full items-center gap-1.5 shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>ANNUAL</span>
            <span className="bg-[#10B981] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
              40% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch pb-16">
        {plans.map((plan, i) => {
          const currentPrice = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual;
          return (
            <div
              key={i}
              className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-stretch relative ${
                plan.badge ? "ring-2 ring-violet-500 border-transparent animate-pulse-subtle" : ""
              }`}
            >
              {/* Badge Popular */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFEDF5] text-[#FF4694] border border-[#FFD6E8] text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              {/* Title Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{plan.name}</h3>
                  {plan.isFree && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-semibold leading-normal pr-2">
                  {plan.subtitle}
                </p>

                {/* Price tag */}
                <div className="space-y-1 pt-1 border-b border-slate-100 pb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">${currentPrice}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    {plan.isFree ? "Free forever" : "Per seat/month billed annually"}
                  </div>
                </div>

                {/* Primary Features */}
                <div className="space-y-2.5 pt-1">
                  {plan.primaryFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                      <Check size={14} className="text-violet-500 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Extra Features Header */}
                <div className="pt-4 border-t border-slate-100 space-y-3.5">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {plan.extraHeader}
                  </h4>
                  <div className="space-y-2.5">
                    {plan.extraFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                        <Check size={14} className="text-slate-300 shrink-0 mt-0.5 stroke-[2]" />
                        <div className="flex flex-col gap-1 flex-1">
                          <span className={`${feat.underline ? "underline cursor-pointer" : ""}`}>
                            {feat.text}
                          </span>
                          {feat.hasStoreIcons && (
                            <div className="flex gap-2 items-center mt-1">
                              {/* Apple App Store Logo Mock */}
                              <div className="flex items-center gap-1 rounded bg-black text-white px-2 py-0.5 text-[8px] font-bold">
                                <span>Apple App</span>
                              </div>
                              {/* Google Play Store Logo Mock */}
                              <div className="flex items-center gap-1 rounded bg-slate-950 text-white px-2 py-0.5 text-[8px] font-bold">
                                <span>Google Play</span>
                              </div>
                            </div>
                          )}
                          {feat.isNew && (
                            <span className="w-fit bg-[#EEFBF7] text-[#10B981] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-[#A7F3D0]/30 mt-0.5 uppercase tracking-wide">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-6 space-y-4">
                {plan.hasRateLimits && (
                  <div className="text-center">
                    <button className="text-[9px] font-extrabold text-violet-600 hover:text-violet-800 tracking-wider hover:underline cursor-pointer">
                      RATE LIMITS
                    </button>
                  </div>
                )}
                {plan.isCurrent ? (
                  <div className="w-full bg-slate-50 border border-slate-200 text-slate-400 py-3 rounded-xl text-xs font-bold text-center cursor-default">
                    {plan.buttonText}
                  </div>
                ) : (
                  <button
                    onClick={() => alert(`Upgrading to ${plan.name} Plan!`)}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-xs font-bold text-center transition-all shadow-md shadow-violet-100 hover:shadow-lg cursor-pointer"
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
