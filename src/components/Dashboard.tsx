import React, { useState } from "react";
import { 
  Building2, Calendar, ClipboardCheck, Sparkles, TrendingUp, TrendingDown, 
  DollarSign, Activity, AlertCircle, Sun, MapPin, Layers, Clock 
} from "lucide-react";
import { Project, SiteLog } from "../types";

interface DashboardProps {
  projects: Project[];
  logs: SiteLog[];
  onNavigateTab: (tab: string) => void;
}

export default function Dashboard({ projects, logs, onNavigateTab }: DashboardProps) {
  // Material price indexes (market pricing)
  const materialPrices = [
    { name: "Portland Cement (50kg)", current: "$7.50", change: "+2.4%", trend: "up" },
    { name: "Steel reinforcement bar (Y16, Ton)", current: "$1,120.00", change: "-0.8%", trend: "down" },
    { name: "Hollow Sandcrete block (9-inch)", current: "$0.95", change: "+1.1%", trend: "up" },
    { name: "Granite Aggregate (per Ton)", current: "$32.50", change: "0.0%", trend: "neutral" },
    { name: "Sharp sand (per Ton)", current: "$24.00", change: "+4.2%", trend: "up" }
  ];

  // Active tasks lists
  const pendingTasks = [
    { title: "Review structural beam load specs for Column B2", deadline: "Today", project: "Sunset Heights Duplex", priority: "High" },
    { title: "Sign site diary log for Excavation completion", deadline: "Today", project: "Lakeside Offices", priority: "High" },
    { title: "Review door sizes layout accessibility width", deadline: "Tomorrow", project: "Sunset Heights Duplex", priority: "Medium" },
    { title: "Procure fine aggregate sand tones", deadline: "July 22", project: "Lakeside Offices", priority: "Low" }
  ];

  // Site updates
  const recentActivities = [
    { text: "Masonry Team finished concrete slab curing cycle", time: "1 hr ago", type: "activity" },
    { text: "AI Drawing Review scanned Ground Floor Blueprint: identified door accessibility issue", time: "3 hrs ago", type: "ai" },
    { text: "Project Manager logged 15 PPE-compliant masons present", time: "5 hrs ago", type: "activity" }
  ];

  // Aggregated values
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.expenses.reduce((eAcc, e) => eAcc + e.amount, 0), 0);
  const completeRatio = Math.round((totalSpent / (totalBudget || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header welcome widget */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-amber-500 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] text-amber-500 font-mono font-bold tracking-wider uppercase">CASTRO OPERATING SYSTEM ACTIVE</span>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-100">Welcome back, Chief Engineer</h1>
          <p className="text-xs text-slate-400">
            Design smarter. Build better. All construction parameters, design reviews, site logs, and budgets sync live.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-900 self-start md:self-auto">
          <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
          <div className="text-xs font-sans">
            <div className="font-semibold text-slate-200">Abuja Site Weather</div>
            <div className="text-slate-400">31°C • Sunny & Clear</div>
            <div className="text-[10px] text-amber-500 font-medium">Ideal structural concrete pouring conditions</div>
          </div>
        </div>
      </div>

      {/* 2. Key stats metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Project Sites", value: `${projects.length} Sites`, change: "All synchronized", icon: Building2, color: "text-amber-500" },
          { label: "Total Capital Budget", value: `$${totalBudget.toLocaleString()}`, change: `Cash pool allocated`, icon: DollarSign, color: "text-emerald-500" },
          { label: "Operating Expenses Spent", value: `$${totalSpent.toLocaleString()}`, change: `${completeRatio}% of budget spent`, icon: Activity, color: "text-sky-500" },
          { label: "Critical Snags Pending", value: `${projects.reduce((acc, p) => acc + p.snagList.filter(s => s.status !== 'Resolved').length, 0)} Snags`, change: "Require resolution", icon: AlertCircle, color: "text-rose-500" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-200">{stat.value}</div>
                <div className="text-[10px] text-slate-500 mt-1">{stat.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main split section: Left (Material prices, Tasks) | Right (Site activities, AI advice) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Price Index & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market price indexes */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" /> Building Materials Market Prices
                </h3>
                <p className="text-[10px] text-slate-500">Live average indexes tracked for Abuja & Lagos zones</p>
              </div>
              <span className="text-[9px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full uppercase">JULY 2026 INDEX</span>
            </div>

            <div className="divide-y divide-slate-900">
              {materialPrices.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 text-xs">
                  <span className="text-slate-300 font-medium">{p.name}</span>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-slate-100 font-bold">{p.current}</span>
                    <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                      p.trend === 'up' ? 'text-red-400' : p.trend === 'down' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {p.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : p.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending tasks checklist */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-amber-500" /> Daily Structural Task Board
            </h3>

            <div className="space-y-2">
              {pendingTasks.map((t, idx) => (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">{t.title}</div>
                    <div className="text-[10px] text-slate-500">{t.project} • Due: {t.deadline}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    t.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'
                  }`}>{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI recommendations & Recent activities */}
        <div className="space-y-6">
          {/* AI Smart recommendation */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" /> AI Site Assistant Directive
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cement price indexes are forecasted to swell +5% next week due to dry-season transport logistics. 
              <strong> Action Recommendation:</strong> Pre-approve the pending purchase order of 150 bags for the Sunset Heights concrete lintel casting today to bypass local inflation adjustments.
            </p>
          </div>

          {/* Recent Site Activity */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-500" /> Recent Site Activities
            </h3>

            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex gap-3 items-start text-xs text-slate-400 border-b border-slate-900 pb-2.5 last:border-none">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${act.type === 'ai' ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`} />
                  <div>
                    <p className="text-slate-300 leading-normal">{act.text}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
