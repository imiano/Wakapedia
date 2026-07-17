import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Calculator, GraduationCap, ShoppingBag, Sparkles, 
  ClipboardList, Sun, Moon, Menu, X, MessageSquare, Landmark, 
  HelpCircle, ChevronRight, Activity
} from "lucide-react";

// Components
import Dashboard from "./components/Dashboard";
import ProjectManager from "./components/ProjectManager";
import Planner from "./components/Planner";
import Calculators from "./components/Calculators";
import LearningHub from "./components/LearningHub";
import Marketplace from "./components/Marketplace";
import AIAssistant from "./components/AIAssistant";
import SiteDiary from "./components/SiteDiary";

// Types & Data
import { Project, SiteLog, AIPlannerResponse, SnagItem, Expense } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Seed Project Data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      name: "Sunset Heights Duplex",
      client: "Marshal Odinaka",
      location: "Gwarinpa, Abuja",
      budget: 155000,
      timeline: "8 Months",
      progress: 35,
      status: "In Progress",
      drawings: [
        {
          id: "dr-1",
          name: "Ground Floor Architectural Plan",
          uploadDate: "2026-07-10",
          version: "1.2",
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
          comments: [
            { id: "c-1", author: "Engr. Castro", text: "Ensure standard 50mm concrete cover clearance for rebar chairs.", date: "2026-07-12", x: 45, y: 32 },
            { id: "c-2", author: "Arch. Sarah", text: "Double-check door accessibility clearance here; must be min 800mm.", date: "2026-07-14", x: 68, y: 55 }
          ]
        }
      ],
      expenses: [
        { id: "exp-1", description: "Soil investigation survey report", category: "Permits", amount: 2500, date: "2026-07-01" },
        { id: "exp-2", description: "Concrete raft excavation labor crew", category: "Labour", amount: 8200, date: "2026-07-05" },
        { id: "exp-3", description: "150 bags of Portland Cement (M20 grade)", category: "Materials", amount: 1125, date: "2026-07-12" }
      ],
      team: [
        { id: "tm-1", name: "Engr. Castro", role: "Structural Engineer", email: "castro@castroai.com" },
        { id: "tm-2", name: "Arch. Sarah", role: "Architect", email: "sarah@castroai.com" },
        { id: "tm-3", name: "David K.", role: "Quantity Surveyor", email: "david@castroai.com" }
      ],
      milestones: [
        { id: "ms-1", title: "Excavation and Soil leveling", dueDate: "2026-07-06", completed: true },
        { id: "ms-2", title: "Pour concrete raft foundation footings", dueDate: "2026-07-20", completed: false },
        { id: "ms-3", title: "Substructure columns and slab casting", dueDate: "2026-08-15", completed: false }
      ],
      photos: [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
      ],
      documents: ["Contract-Deed.pdf", "Soil-Report.pdf"],
      snagList: [
        { id: "snag-1", description: "Standing rainwater in southern excavation trench; needs dewatering", assignedTo: "Labour Crew A", deadline: "Tomorrow", status: "Open" },
        { id: "snag-2", description: "Some starter bars show slight displacement; check reinforcement links", assignedTo: "Steel Fixers Team", deadline: "July 18", status: "In Progress" }
      ],
      siteLogs: []
    },
    {
      id: "proj-2",
      name: "Lakeside Commercial Offices",
      client: "Shell Capital",
      location: "Victoria Island, Lagos",
      budget: 450000,
      timeline: "14 Months",
      progress: 10,
      status: "Planning",
      drawings: [],
      expenses: [],
      team: [
        { id: "tm-4", name: "Dr. Alao", role: "Civil Engineer", email: "alao@castroai.com" }
      ],
      milestones: [
        { id: "ms-4", title: "Geotechnical deep soil boring tests", dueDate: "2026-08-01", completed: false }
      ],
      photos: [],
      documents: [],
      snagList: [],
      siteLogs: []
    }
  ]);

  const [activeProjectId, setActiveProjectId] = useState<string | null>("proj-1");

  // Global site diary logs
  const [siteLogs, setSiteLogs] = useState<SiteLog[]>([
    {
      id: "1",
      date: "2206-07-14",
      workersCount: 18,
      visitors: "Client Inspector",
      weather: "Sunny / Dry",
      materialsDelivered: "15 Tons sharp sand, 20 Tons granite 20mm",
      equipmentUsed: "Concrete Mixer Model B, 1 water pump",
      workCompleted: "Formwork alignment check on columns; tied main beam reinforcements.",
      issues: "Standing water in excavation pit successfully pumped out.",
      signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFQCAYAAAD9E..."
    }
  ]);

  // Project stages for Site Diary / Progress tracking
  const [stages, setStages] = useState([
    { name: "Excavation and Earthworks", completed: true },
    { name: "Foundation Concrete Pouring", completed: false },
    { name: "Structural Column Casting", completed: false },
    { name: "First Floor Slab & Beams", completed: false },
    { name: "External Brick / Block Masonry", completed: false },
    { name: "Roof Truss Construction", completed: false },
    { name: "Plumbing Conduit Installations", completed: false },
    { name: "Electrical Wiring Conducts", completed: false },
    { name: "Finishing & Landscaping", completed: false }
  ]);

  // Handle addition of a new project from the sidebar
  const handleAddProject = (newProj: Omit<Project, "id" | "drawings" | "expenses" | "team" | "milestones" | "photos" | "documents" | "snagList" | "siteLogs">) => {
    const id = `proj-${Date.now()}`;
    const completeProject: Project = {
      ...newProj,
      id,
      drawings: [],
      expenses: [],
      team: [
        { id: `tm-${Date.now()}`, name: "Engr. Castro", role: "Structural Engineer", email: "castro@castroai.com" }
      ],
      milestones: [
        { id: `ms-p1-${Date.now()}`, title: "Mobilization & Site Fencing", dueDate: "Next Month", completed: false },
        { id: `ms-p2-${Date.now()}`, title: "Foundation Excavation", dueDate: "In 2 Months", completed: false }
      ],
      photos: [],
      documents: [],
      snagList: [],
      siteLogs: []
    };
    setProjects([...projects, completeProject]);
    setActiveProjectId(id);
  };

  const handleAddDrawing = (projectId: string, name: string, fileUrl: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          drawings: [
            ...p.drawings,
            {
              id: `dr-${Date.now()}`,
              name,
              uploadDate: new Date().toISOString().split("T")[0],
              version: "1.0",
              url: fileUrl,
              comments: []
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleAddDrawingComment = (projectId: string, drawingId: string, text: string, x?: number, y?: number) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          drawings: p.drawings.map(d => {
            if (d.id === drawingId) {
              return {
                ...d,
                comments: [
                  ...d.comments,
                  {
                    id: `c-${Date.now()}`,
                    author: "Chief Engineer",
                    text,
                    date: new Date().toISOString().split("T")[0],
                    x,
                    y
                  }
                ]
              };
            }
            return d;
          })
        };
      }
      return p;
    }));
  };

  const handleAddExpense = (projectId: string, newExp: Omit<Expense, "id">) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          expenses: [
            ...p.expenses,
            {
              ...newExp,
              id: `exp-${Date.now()}`
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleAddSnag = (projectId: string, newSnag: Omit<SnagItem, "id">) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          snagList: [
            ...p.snagList,
            {
              ...newSnag,
              id: `snag-${Date.now()}`
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleUpdateSnagStatus = (projectId: string, snagId: string, status: "Open" | "In Progress" | "Resolved") => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          snagList: p.snagList.map(s => {
            if (s.id === snagId) {
              return { ...s, status };
            }
            return s;
          })
        };
      }
      return p;
    }));
  };

  const handleAddPhotoToProject = (projectId: string, photoUrl: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          photos: [...p.photos, photoUrl]
        };
      }
      return p;
    }));
  };

  const handleImportPlannerData = (plan: AIPlannerResponse) => {
    if (!activeProjectId) return;
    setProjects(projects.map(p => {
      if (p.id === activeProjectId) {
        const generatedExpenses: Expense[] = plan.materials.map((m, idx) => ({
          id: `exp-plan-${idx}-${Date.now()}`,
          description: `Allocated budget for: ${m.name}`,
          category: "Materials",
          amount: Math.round(p.budget * 0.08), // Allocate roughly 8% of budget per key line
          date: new Date().toISOString().split("T")[0]
        }));

        return {
          ...p,
          plannerData: plan,
          expenses: [...p.expenses, ...generatedExpenses],
          milestones: plan.wbs.map((w, idx) => ({
            id: `ms-plan-${idx}-${Date.now()}`,
            title: w.phase,
            dueDate: `Phase ${idx+1} Deadline`,
            completed: false
          }))
        };
      }
      return p;
    }));
    setActiveTab("manager");
  };

  const handleAddSiteLog = (newLog: Omit<SiteLog, "id">) => {
    setSiteLogs([
      {
        ...newLog,
        id: `${siteLogs.length + 1}`
      },
      ...siteLogs
    ]);
  };

  const handleToggleStage = (index: number) => {
    const updated = [...stages];
    updated[index].completed = !updated[index].completed;
    setStages(updated);
  };

  const navigationItems = [
    { id: "dashboard", label: "OS Dashboard", icon: Building2 },
    { id: "planner", label: "AI Project Planner", icon: Sparkles },
    { id: "manager", label: "Construction Workspace", icon: Landmark },
    { id: "diary", label: "Site Diary Logs", icon: ClipboardList },
    { id: "calculators", label: "Engineering Calculators", icon: Calculator },
    { id: "learning", label: "Structural Academy", icon: GraduationCap },
    { id: "marketplace", label: "Procurement Shop", icon: ShoppingBag },
    { id: "chat", label: "AI Consultation", icon: MessageSquare }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* 1. Header Navigation Bar */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-white/80 border-slate-200"}`}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">CASTRO AI</span>
              <span className="text-[9px] text-slate-500 block font-semibold uppercase tracking-wider -mt-1 font-mono">Construction OS v3.5</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? "bg-amber-500 text-slate-950 font-bold" 
                      : isDarkMode ? "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-amber-500 hover:bg-slate-800" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b overflow-hidden transition-colors ${isDarkMode ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"}`}
          >
            <div className="p-4 space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-left font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? "bg-amber-500 text-slate-950 font-bold" 
                        : isDarkMode ? "text-slate-400 hover:bg-slate-900/60" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content Stage */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "dashboard" && (
              <Dashboard 
                projects={projects} 
                logs={siteLogs} 
                onNavigateTab={(tab) => setActiveTab(tab)} 
              />
            )}
            
            {activeTab === "planner" && (
              <Planner onImportToProject={handleImportPlannerData} />
            )}

            {activeTab === "manager" && (
              <ProjectManager
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={setActiveProjectId}
                onAddProject={handleAddProject}
                onAddDrawing={handleAddDrawing}
                onAddDrawingComment={handleAddDrawingComment}
                onAddExpense={handleAddExpense}
                onAddSnag={handleAddSnag}
                onUpdateSnagStatus={handleUpdateSnagStatus}
                onAddPhoto={handleAddPhotoToProject}
              />
            )}

            {activeTab === "diary" && (
              <SiteDiary
                logs={siteLogs}
                onAddLog={handleAddSiteLog}
                stages={stages}
                onToggleStage={handleToggleStage}
              />
            )}

            {activeTab === "calculators" && (
              <Calculators />
            )}

            {activeTab === "learning" && (
              <LearningHub />
            )}

            {activeTab === "marketplace" && (
              <Marketplace />
            )}

            {activeTab === "chat" && (
              <AIAssistant />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className={`border-t py-6 mt-12 transition-colors ${isDarkMode ? "bg-slate-950 border-slate-950 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span>© 2026 Castro AI. All rights reserved. Registered licensing advisory and quantity estimation tool.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Regulatory Guidelines</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Security Auditing logs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
