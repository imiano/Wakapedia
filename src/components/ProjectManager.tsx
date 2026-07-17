import React, { useState, useRef } from "react";
import { 
  FolderPlus, Eye, FileText, Landmark, ShieldAlert, Sparkles, Plus, 
  MapPin, Check, Camera, DollarSign, PenTool, Layers, Trash2, Send, Download 
} from "lucide-react";
import { Project, DrawingFile, Expense, SnagItem } from "../types";

interface ProjectManagerProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: (project: Omit<Project, "id" | "drawings" | "expenses" | "team" | "milestones" | "photos" | "documents" | "snagList" | "siteLogs">) => void;
  onAddDrawing: (projectId: string, name: string, fileUrl: string) => void;
  onAddDrawingComment: (projectId: string, drawingId: string, text: string, x?: number, y?: number) => void;
  onAddExpense: (projectId: string, expense: Omit<Expense, "id">) => void;
  onAddSnag: (projectId: string, snag: Omit<SnagItem, "id">) => void;
  onUpdateSnagStatus: (projectId: string, snagId: string, status: "Open" | "In Progress" | "Resolved") => void;
  onAddPhoto: (projectId: string, photoUrl: string) => void;
}

type ProjectTab = "overview" | "drawings" | "reviewer" | "snags" | "inspector" | "finance" | "reporter";

export default function ProjectManager({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onAddDrawing,
  onAddDrawingComment,
  onAddExpense,
  onAddSnag,
  onUpdateSnagStatus,
  onAddPhoto
}: ProjectManagerProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");
  const [showAddProject, setShowAddProject] = useState(false);

  // New Project Form state
  const [newProjName, setNewProjName] = useState("");
  const [newProjClient, setNewProjClient] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjBudget, setNewProjBudget] = useState(50000);
  const [newProjTimeline, setNewProjTimeline] = useState("6 Months");

  // New Drawing Form
  const [drawingName, setDrawingName] = useState("");
  const [drawingFileBase64, setDrawingFileBase64] = useState("");

  // New Expense Form
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCat, setExpenseCat] = useState<any>("Materials");
  const [expenseAmount, setExpenseAmount] = useState(1500);

  // New Snag Form
  const [snagDesc, setSnagDesc] = useState("");
  const [snagAssigned, setSnagAssigned] = useState("");
  const [snagDeadline, setSnagDeadline] = useState("");

  // Drawing markup comment coordinates
  const [markupX, setMarkupX] = useState<number | null>(null);
  const [markupY, setMarkupY] = useState<number | null>(null);
  const [markupCommentText, setMarkupCommentText] = useState("");

  // AI Review Drawing state
  const [isReviewingDrawing, setIsReviewingDrawing] = useState(false);
  const [drawingReviewResult, setDrawingReviewResult] = useState<any>(null);

  // AI Site Inspector state
  const [inspectorPhotoBase64, setInspectorPhotoBase64] = useState("");
  const [isInspectingSite, setIsInspectingSite] = useState(false);
  const [inspectorResult, setInspectorResult] = useState<any>(null);

  // AI Report Writer state
  const [reportType, setReportType] = useState("Daily Site Report");
  const [reportDetails, setReportDetails] = useState("");
  const [isWritingReport, setIsWritingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    onAddProject({
      name: newProjName,
      client: newProjClient || "Individual",
      location: newProjLocation || "Abuja",
      budget: newProjBudget,
      timeline: newProjTimeline,
      status: "Planning",
      progress: 5
    });
    setNewProjName("");
    setNewProjClient("");
    setNewProjLocation("");
    setShowAddProject(false);
  };

  const handleDrawingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setDrawingFileBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDrawingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !drawingName || !drawingFileBase64) return;
    onAddDrawing(activeProject.id, drawingName, drawingFileBase64);
    setDrawingName("");
    setDrawingFileBase64("");
  };

  const handleBlueprintClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMarkupX(x);
    setMarkupY(y);
  };

  const handleAddMarkupComment = (e: React.FormEvent, drawingId: string) => {
    e.preventDefault();
    if (!activeProject || !markupCommentText || markupX === null || markupY === null) return;
    onAddDrawingComment(activeProject.id, drawingId, markupCommentText, markupX, markupY);
    setMarkupCommentText("");
    setMarkupX(null);
    setMarkupY(null);
  };

  const handleTriggerDrawingReview = async (image: string) => {
    setIsReviewingDrawing(true);
    setDrawingReviewResult(null);
    try {
      const response = await fetch("/api/review-drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, text: "Check building height code constraints" })
      });
      const data = await response.json();
      setDrawingReviewResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewingDrawing(false);
    }
  };

  const handleInspectorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setInspectorPhotoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerSiteInspection = async () => {
    if (!inspectorPhotoBase64) return;
    setIsInspectingSite(true);
    setInspectorResult(null);
    try {
      const response = await fetch("/api/review-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: inspectorPhotoBase64 })
      });
      const data = await response.json();
      setInspectorResult(data);
      if (activeProject) {
        onAddPhoto(activeProject.id, inspectorPhotoBase64);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInspectingSite(false);
    }
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !expenseDesc) return;
    onAddExpense(activeProject.id, {
      description: expenseDesc,
      category: expenseCat,
      amount: expenseAmount,
      date: new Date().toISOString().split("T")[0]
    });
    setExpenseDesc("");
    setExpenseAmount(1000);
  };

  const handleAddSnagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !snagDesc) return;
    onAddSnag(activeProject.id, {
      description: snagDesc,
      assignedTo: snagAssigned || "Unassigned Contractor",
      deadline: snagDeadline || "Next Week",
      status: "Open"
    });
    setSnagDesc("");
    setSnagAssigned("");
    setSnagDeadline("");
  };

  const handleTriggerReportGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    setIsWritingReport(true);
    setGeneratedReport(null);
    try {
      const response = await fetch("/api/write-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType, details: reportDetails }),
      });
      const data = await response.json();
      setGeneratedReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWritingReport(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 1. Projects Sidebar Selector */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-slate-200">Active Directory</h3>
          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-lg transition-all cursor-pointer"
            title="Create Project"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {showAddProject && (
          <form onSubmit={handleCreateProject} className="glass-panel p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold text-amber-500 uppercase">Create Workspace</h4>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Project Code Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                placeholder="e.g. Sunset Heights Duplex"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Client Developer</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                placeholder="e.g. Shell Estate Ltd"
                value={newProjClient}
                onChange={(e) => setNewProjClient(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Total Target Budget ($)</label>
              <input
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                value={newProjBudget}
                onChange={(e) => setNewProjBudget(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="w-1/2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-amber-500 text-slate-950 font-semibold rounded-lg py-1 text-xs cursor-pointer"
              >
                Launch
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                onSelectProject(proj.id);
                setDrawingReviewResult(null);
                setInspectorResult(null);
                setGeneratedReport(null);
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                proj.id === activeProjectId
                  ? "bg-amber-500/15 border-amber-500 text-slate-100"
                  : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm truncate">{proj.name}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                  proj.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                  proj.status === "In Progress" ? "bg-sky-500/10 text-sky-400" : "bg-amber-500/10 text-amber-500"
                }`}>{proj.status}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-2">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>{proj.location}</span>
                <span className="mx-1">•</span>
                <span>{proj.timeline}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="lg:col-span-3 space-y-6">
        {activeProject ? (
          <>
            {/* Project Header Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
              <div>
                <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-wider">PROJECT MASTER WORKSPACE</span>
                <h2 className="text-xl font-bold text-slate-200 mt-1">{activeProject.name}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>Client: <strong>{activeProject.client}</strong></span>
                  <span>•</span>
                  <span>Budget Allocation: <strong className="text-emerald-400">${activeProject.budget.toLocaleString()}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-slate-900 md:border-none pt-3 md:pt-0">
                {[
                  { id: "overview", label: "Overview", icon: Eye },
                  { id: "drawings", label: "Drawing Hub", icon: Layers },
                  { id: "reviewer", label: "AI Drawing Review", icon: Sparkles },
                  { id: "snags", label: "Snag List", icon: ShieldAlert },
                  { id: "inspector", label: "AI Site Inspector", icon: Camera },
                  { id: "finance", label: "Finance Ledger", icon: Landmark },
                  { id: "reporter", label: "AI Reports", icon: FileText }
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as ProjectTab)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                        activeTab === t.id
                          ? "bg-amber-500 text-slate-950 font-semibold"
                          : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-slate-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB PANELS */}

            {/* A. Overview */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Milestones / Checklists */}
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-slate-200 mb-3">Construction Stages Completed</h3>
                    <div className="space-y-2">
                      {activeProject.milestones.map((ms) => (
                        <div key={ms.id} className="flex justify-between items-center bg-slate-900/30 p-3 rounded-xl border border-slate-900/60 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${ms.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'}`}>
                              {ms.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={ms.completed ? "line-through text-slate-500" : ""}>{ms.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">{ms.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photo Gallery */}
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-slate-200 mb-3">Site Snapshots (Auto-synced)</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {activeProject.photos.length > 0 ? (
                        activeProject.photos.map((ph, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-900 group">
                            <img src={ph} alt="Site capture" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <span className="text-[10px] text-white">Capture #{idx+1}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-6 text-xs text-slate-500">
                          No safety photos logged yet. Use the <strong>AI Site Inspector</strong> to upload site snapshots.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Summary Column */}
                <div className="space-y-6">
                  {/* Planner Data link if present */}
                  {activeProject.plannerData && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> AI Generated Spec Sheet
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        This project is bound to a custom AI plan scope containing {activeProject.plannerData.materials.length} material lines and soil risk evaluations.
                      </p>
                      <div className="text-[10px] text-slate-400 italic">
                        Estimated Budget: {activeProject.plannerData.budget.totalEstimate}
                      </div>
                    </div>
                  )}

                  {/* Consultants */}
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200">Consultant Roster</h3>
                    <div className="space-y-2">
                      {activeProject.team.map((mem) => (
                        <div key={mem.id} className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900 text-xs">
                          <div className="font-semibold text-slate-200">{mem.name}</div>
                          <div className="text-slate-500 text-[10px] mt-0.5">{mem.role} • {mem.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. Drawing Hub (with comments / coordinate markups) */}
            {activeTab === "drawings" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Selector / Upload */}
                <div className="lg:col-span-1 glass-panel p-5 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-semibold text-slate-200">Blueprint Index</h3>
                  
                  <form onSubmit={handleAddDrawingConfirm} className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                    <h4 className="text-[10px] font-bold text-amber-500 uppercase">Upload Blueprint</h4>
                    <div>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                        placeholder="Drawing name (e.g. Ground Floor Plan)"
                        value={drawingName}
                        onChange={(e) => setDrawingName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDrawingUpload}
                        className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-amber-500/10 file:text-amber-500 file:cursor-pointer"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!drawingFileBase64}
                      className="w-full bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold py-1 px-3 rounded-lg text-xs transition-all cursor-pointer"
                    >
                      Save Blueprint
                    </button>
                  </form>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {activeProject.drawings.map((dr) => (
                      <div key={dr.id} className="bg-slate-900/40 border border-slate-950 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{dr.name}</div>
                          <div className="text-[9px] text-slate-500">{dr.uploadDate} • Ver {dr.version}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-500">{dr.comments.length} Pins</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Interactive Viewer */}
                <div className="lg:col-span-2 space-y-4">
                  {activeProject.drawings.length > 0 ? (
                    (() => {
                      const currentDr = activeProject.drawings[0];
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1">
                              <Layers className="w-4 h-4 text-amber-500" /> Layer Inspector: {currentDr.name}
                            </h3>
                            <button
                              onClick={() => handleTriggerDrawingReview(currentDr.url)}
                              className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" /> Auto Review Layout
                            </button>
                          </div>

                          {/* Drawing canvas */}
                          <div className="relative glass-panel rounded-2xl overflow-hidden aspect-video border border-slate-800 cursor-crosshair group bg-slate-900/10" onClick={handleBlueprintClick}>
                            <img src={currentDr.url} alt="Blueprint" className="w-full h-full object-contain" />
                            
                            {/* Comments pins */}
                            {currentDr.comments.map((cm) => (
                              <div
                                key={cm.id}
                                className="absolute w-5 h-5 bg-amber-500 border border-slate-950 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-bold transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-all shadow-md cursor-help"
                                style={{ left: `${cm.x}%`, top: `${cm.y}%` }}
                                title={`${cm.author}: ${cm.text}`}
                              >
                                {cm.id.split('-')[1] || "1"}
                              </div>
                            ))}

                            {/* Unsaved coordinate comments selection */}
                            {markupX !== null && markupY !== null && (
                              <div
                                className="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center animate-pulse transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${markupX}%`, top: `${markupY}%` }}
                              />
                            )}

                            <div className="absolute bottom-2 left-2 bg-slate-950/80 text-[10px] text-slate-400 px-2 py-0.5 rounded-md">
                              Click anywhere on blueprint layout to pin a coordinate note.
                            </div>
                          </div>

                          {/* Coordinate Comment submission box */}
                          {markupX !== null && markupY !== null && (
                            <form onSubmit={(e) => handleAddMarkupComment(e, currentDr.id)} className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl space-y-3">
                              <h4 className="text-xs font-semibold text-amber-500">Pin Comment at X:{markupX}% Y:{markupY}%</h4>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  required
                                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                                  placeholder="Type structural review note here..."
                                  value={markupCommentText}
                                  onChange={(e) => setMarkupCommentText(e.target.value)}
                                />
                                <button type="submit" className="bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                                  Save Note
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Notes List */}
                          <div className="glass-panel p-4 rounded-xl space-y-2 max-h-[150px] overflow-y-auto">
                            <h4 className="text-xs font-semibold text-slate-300">Markup Notes Log</h4>
                            <div className="space-y-1.5 text-xs">
                              {currentDr.comments.map((cm) => (
                                <div key={cm.id} className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
                                  <span><strong className="text-amber-500">Note #{cm.id.split('-')[1] || "1"}:</strong> {cm.text}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{cm.author} • {cm.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="glass-panel p-12 text-center text-slate-500 text-xs">
                      No blueprints available. Upload a residential floor plan to initiate drawing markups.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* C. AI Drawing Review (Layout checking) */}
            {activeTab === "reviewer" && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> AI Building Code & Space Reviewer
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Submit your drawing to let Gemini cross-match building code heights, corridor widths, accessibility clearance zones, and work triangle configurations.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {activeProject.drawings.length > 0 ? (
                      <button
                        onClick={() => handleTriggerDrawingReview(activeProject.drawings[0].url)}
                        disabled={isReviewingDrawing}
                        className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 transition-all cursor-pointer"
                      >
                        {isReviewingDrawing ? "Auditing Building Specs..." : "Audit Ground Floor Plan"}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Upload a blueprint first in Drawing Hub before reviewing.</span>
                    )}
                  </div>

                  {isReviewingDrawing && (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xs text-slate-400 animate-pulse">Scanning walls, bedroom layout coordinates, and standard plumbing clearances...</p>
                    </div>
                  )}

                  {drawingReviewResult && !isReviewingDrawing && (
                    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">AI Building Code Report</h4>
                      
                      <div className="space-y-2">
                        {drawingReviewResult.issues.map((iss: any, i: number) => (
                          <div key={i} className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-xs">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              iss.severity === "High" ? "bg-red-500/10 text-red-400" :
                              iss.severity === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-400"
                            }`}>{iss.severity}</span>
                            <div>
                              <strong className="text-slate-300">[{iss.type}]</strong>
                              <p className="text-slate-400 mt-1">{iss.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-xs space-y-1">
                        <h5 className="font-semibold text-sky-400">Layout Optimization Suggestions</h5>
                        <p className="text-slate-300 leading-normal">{drawingReviewResult.optimizations}</p>
                      </div>

                      <p className="text-[10px] text-slate-500 italic mt-4">{drawingReviewResult.disclaimer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* D. Defect & Snag Manager */}
            {activeTab === "snags" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1 glass-panel p-5 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-semibold text-slate-200">Record Site Snag</h3>
                  
                  <form onSubmit={handleAddSnagSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Snag / Defect Description</label>
                      <textarea
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 h-20"
                        placeholder="e.g. Concrete cracking visible in Column C2 after formwork removal..."
                        value={snagDesc}
                        onChange={(e) => setSnagDesc(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Assigned Subcontractor</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        placeholder="e.g. Masonry Team B"
                        value={snagAssigned}
                        onChange={(e) => setSnagAssigned(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Resolution Deadline</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        placeholder="e.g. Before Friday, July 20"
                        value={snagDeadline}
                        onChange={(e) => setSnagDeadline(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-slate-950 font-semibold py-2 rounded-lg text-xs cursor-pointer">
                      Log Snag Item
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-200">Active Snags Tracker</h3>
                  
                  <div className="space-y-2">
                    {activeProject.snagList.map((sn) => (
                      <div key={sn.id} className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl flex justify-between items-start text-xs">
                        <div className="space-y-1.5">
                          <p className="font-medium text-slate-200 leading-normal">{sn.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            <span>Assigned: <strong>{sn.assignedTo}</strong></span>
                            <span>•</span>
                            <span>Due: <strong className="text-amber-500">{sn.deadline}</strong></span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            sn.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400" :
                            sn.status === "In Progress" ? "bg-sky-500/10 text-sky-400" : "bg-red-500/10 text-red-400"
                          }`}>{sn.status}</span>
                          
                          {sn.status !== "Resolved" && (
                            <button
                              onClick={() => onUpdateSnagStatus(activeProject.id, sn.id, "Resolved")}
                              className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* E. AI Site Inspector (Site photos review) */}
            {activeTab === "inspector" && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-amber-500" /> AI Site Safety & Progress Inspector
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Upload a real-time site snapshot from your phone or laptop camera. Our AI safety model evaluates trench shorings, PPE compliance, column curing hydration, and draft site reports.
                  </p>

                  <div className="bg-slate-950/60 p-5 border border-dashed border-slate-900 rounded-xl flex flex-col items-center justify-center">
                    {inspectorPhotoBase64 ? (
                      <div className="space-y-4 w-full max-w-sm">
                        <img src={inspectorPhotoBase64} alt="Pre-inspection" className="rounded-xl border border-slate-800 max-h-48 object-cover mx-auto" />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setInspectorPhotoBase64("")}
                            className="w-1/2 bg-slate-900 text-slate-400 text-xs py-1.5 rounded-lg cursor-pointer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={handleTriggerSiteInspection}
                            disabled={isInspectingSite}
                            className="w-1/2 bg-amber-500 text-slate-950 font-bold text-xs py-1.5 rounded-lg cursor-pointer"
                          >
                            {isInspectingSite ? "Inspecting..." : "Trigger AI Audit"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-slate-700 mb-3" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleInspectorPhotoUpload}
                          className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-amber-500/10 file:text-amber-500 file:cursor-pointer"
                        />
                      </>
                    )}
                  </div>

                  {inspectorResult && !isInspectingSite && (
                    <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-5">
                      <div>
                        <h4 className="text-xs font-bold text-amber-500 uppercase">Progress Summary</h4>
                        <p className="text-xs text-slate-200 leading-normal mt-1">{inspectorResult.progressSummary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-amber-500 uppercase mb-2">Visible Quality Observations</h4>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {inspectorResult.qualityObservations.map((obs: string, i: number) => (
                              <li key={i} className="flex gap-1.5 items-start">
                                <span className="text-amber-500">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-amber-500 uppercase mb-2">Safety Compliance Checks</h4>
                          <div className="space-y-2 text-xs">
                            {inspectorResult.safetyChecklist.map((saf: any, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                                <span className="text-slate-400">{saf.item}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  saf.status === "Pass" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"
                                }`}>{saf.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-4 border border-slate-900 rounded-xl text-xs space-y-2">
                        <h4 className="font-bold text-slate-300">Drafted Operational Report</h4>
                        <pre className="whitespace-pre-wrap font-mono text-[10px] text-slate-400 leading-relaxed">
                          {inspectorResult.draftReport}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* F. Finance Ledger */}
            {activeTab === "finance" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logger Form */}
                <div className="lg:col-span-1 glass-panel p-5 rounded-2xl space-y-4 h-fit">
                  <h3 className="text-sm font-semibold text-slate-200">Record Expenditure</h3>
                  
                  <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Expense Detail / Item</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        placeholder="e.g. 50 Tons granite aggregate delivery"
                        value={expenseDesc}
                        onChange={(e) => setExpenseDesc(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Category Group</label>
                      <select
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        value={expenseCat}
                        onChange={(e) => setExpenseCat(e.target.value as any)}
                      >
                        <option value="Materials">Materials</option>
                        <option value="Labour">Labour Payroll</option>
                        <option value="Equipment">Equipment Hire</option>
                        <option value="Permits">Permits / Approvals</option>
                        <option value="Other">Other Expenses</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Paid Amount ($)</label>
                      <input
                        type="number"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 rounded-lg text-xs cursor-pointer">
                      Log Ledger Cashout
                    </button>
                  </form>
                </div>

                {/* ledger ledger list */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-200">Ledger Log</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Spent: <strong className="text-emerald-400">${activeProject.expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}</strong> / ${activeProject.budget.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeProject.expenses.map((ex) => (
                      <div key={ex.id} className="bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{ex.description}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{ex.date} • Category: {ex.category}</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">${ex.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* G. AI Report Writer */}
            {activeTab === "reporter" && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" /> AI Site Report Writer
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Generate formatted site visit minutes, safety diaries, variation reviews, or weekly structural progress reports. Provide short notes, and the AI drafts a professional PDF-ready report.
                  </p>

                  <form onSubmit={handleTriggerReportGeneration} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Report Format / Standard</label>
                        <select
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                        >
                          <option value="Daily Site Report">Daily Site Log Report</option>
                          <option value="Inspection Report">Safety & Concrete Testing Report</option>
                          <option value="Variation Report">Budget Cost Variation Report</option>
                          <option value="Project Closeout Report">Structural Handover & Closeout</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Core Bullet Points / Parameters</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600"
                          placeholder="e.g. Columns poured successfully. Weather fine. Minor block delay."
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isWritingReport}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isWritingReport ? "Drafting Report..." : "Draft Report"}
                    </button>
                  </form>

                  {isWritingReport && (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xs text-slate-400 animate-pulse font-mono">Assembling executive headers, formatting paragraphs, and compiling recommendations...</p>
                    </div>
                  )}

                  {generatedReport && !isWritingReport && (
                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-200">{generatedReport.title}</h4>
                          <span className="text-[10px] text-slate-500">Date: {generatedReport.date}</span>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Print / PDF export
                        </button>
                      </div>

                      {/* Display Markdown parsed or readable report */}
                      <div className="text-xs text-slate-300 space-y-3 leading-relaxed font-sans prose prose-invert max-w-none">
                        {generatedReport.content.split('\n\n').map((para: string, i: number) => {
                          if (para.startsWith('###')) {
                            return <h5 key={i} className="text-sm font-semibold text-amber-500 pt-3 border-t border-slate-900">{para.replace('###', '')}</h5>;
                          }
                          if (para.startsWith('-')) {
                            return (
                              <ul key={i} className="list-disc pl-4 space-y-1 text-slate-400">
                                {para.split('\n').map((li, lidx) => (
                                  <li key={lidx}>{li.replace('-', '').trim()}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={i}>{para}</p>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center justify-center">
            <FolderPlus className="w-16 h-16 text-slate-700 stroke-1 animate-pulse mb-4" />
            <h3 className="text-lg font-medium text-slate-300 font-display">No Active Project Selected</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Please click or launch an engineering project from the sidebar directory to access drawings, snag lists, and site reviews.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
