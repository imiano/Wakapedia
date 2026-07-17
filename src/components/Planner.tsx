import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Hammer, AlertTriangle, ShieldCheck, ClipboardList, DollarSign, Eye, Download, FileText } from "lucide-react";
import { AIPlannerResponse } from "../types";

interface PlannerProps {
  onImportToProject?: (plan: AIPlannerResponse) => void;
}

export default function Planner({ onImportToProject }: PlannerProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIPlannerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your setup.");
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Four-bedroom duplex in Abuja",
    "3-storey commercial office block in Lagos",
    "Modern mini-estate with 6 semi-detached bungalows",
    "Steel warehouse with mezzanine floor in Accra"
  ];

  return (
    <div id="ai-planner-section" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-display text-amber-500 flex items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse" /> AI Project Planner
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate instantly a detailed scope of work, material quantities, labor requirements, construction phases, and preliminary budgets from a single sentence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handlePlan} className="glass-panel p-5 rounded-2xl space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Describe your planned construction
            </label>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500 transition-all"
              placeholder="e.g., A modern 4-bedroom duplex with concrete raft foundation on clay soil in Abuja..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-600 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Engineering Plan in Progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Project Plan
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestions */}
          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Suggested Presets
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="w-full text-left text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-xl p-2.5 text-slate-300 transition-all block cursor-pointer"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <Sparkles className="w-16 h-16 text-slate-700 mb-4 stroke-1 animate-pulse" />
              <h3 className="text-lg font-medium text-slate-300 font-display">Awaiting Project Specifications</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Type details about the building style, size, and geographic location to generate engineering material metrics and planning blueprints.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <Hammer className="w-8 h-8 text-amber-500 absolute inset-0 m-auto animate-bounce" />
              </div>
              <h3 className="text-lg font-medium text-slate-200 font-display animate-pulse">Computing Material Mechanics...</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                Our AI quantity surveyor is structural-matching reinforcement bar tonnage, excavation volumes, and brick ratios against Nigerian and international code guidelines.
              </p>
            </div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Scope Card */}
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500">
                <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-500" /> Executive Scope of Work
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.scope}</p>
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-500" /> {result.timeline}
                  </span>
                </div>
              </div>

              {/* Work Breakdown Structure */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-500" /> Work Breakdown Structure (WBS)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.wbs.map((phase, i) => (
                    <div key={i} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-amber-500 mb-2">{phase.phase}</h4>
                      <ul className="space-y-1.5">
                        {phase.tasks.map((task, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Materials List */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-500" /> Preliminary Bill of Materials
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Material Metric</th>
                        <th className="px-4 py-3">Suggested Quantity</th>
                        <th className="px-4 py-3">Engineering Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {result.materials.map((mat, i) => (
                        <tr key={i} className="hover:bg-slate-900/20">
                          <td className="px-4 py-3 font-medium text-slate-200">{mat.name}</td>
                          <td className="px-4 py-3 font-mono text-amber-400">{mat.quantity}</td>
                          <td className="px-4 py-3 text-xs text-slate-400">{mat.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Labor & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Labour */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-amber-500" /> Labour Headcount & Allocation
                  </h3>
                  <div className="space-y-3">
                    {result.labour.map((lab, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                        <div>
                          <div className="text-sm font-medium text-slate-200">{lab.role}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{lab.responsibility}</div>
                        </div>
                        <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {lab.headcount} Workers
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="glass-panel p-6 rounded-2xl border-r-4 border-r-emerald-500">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" /> Cost Range & Assumed Rates
                  </h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between pb-2 border-b border-slate-900">
                      <span className="text-slate-400">Materials Base:</span>
                      <span className="text-slate-200">{result.budget.materialsCost}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-900">
                      <span className="text-slate-400">Labour Allocations:</span>
                      <span className="text-slate-200">{result.budget.labourCost}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-900">
                      <span className="text-slate-400">Contingencies (10-15%):</span>
                      <span className="text-slate-200">{result.budget.contingency}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-semibold border-t border-slate-800">
                      <span className="text-emerald-400">Total Rough Cost:</span>
                      <span className="text-emerald-400">{result.budget.totalEstimate}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-4 leading-normal">
                    * {result.budget.disclaimer}
                  </p>
                </div>
              </div>

              {/* Risks & Inspections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Soil & Environmental Risks
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.risks.map((risk, i) => (
                      <li key={i} className="flex gap-2 items-start bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Mandatory Structural Inspections
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.inspections.map((insp, i) => (
                      <li key={i} className="flex gap-2 items-start bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{insp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {onImportToProject && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onImportToProject(result)}
                    className="bg-amber-500 text-slate-950 font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Import into Active Workspace Project
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
