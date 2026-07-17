import React, { useState, useRef, useEffect } from "react";
import { Plus, Check, MapPin, Cloud, PenTool, ClipboardList, Hammer, Clock, FileText } from "lucide-react";
import { SiteLog } from "../types";

interface SiteDiaryProps {
  logs: SiteLog[];
  onAddLog: (log: Omit<SiteLog, "id">) => void;
  stages: { name: string; completed: boolean }[];
  onToggleStage: (index: number) => void;
}

export default function SiteDiary({ logs, onAddLog, stages, onToggleStage }: SiteDiaryProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [workersCount, setWorkersCount] = useState(15);
  const [visitors, setVisitors] = useState("");
  const [weather, setWeather] = useState("Sunny");
  const [materialsDelivered, setMaterialsDelivered] = useState("");
  const [equipmentUsed, setEquipmentUsed] = useState("");
  const [workCompleted, setWorkCompleted] = useState("");
  const [issues, setIssues] = useState("");
  const [gps, setGps] = useState("9.0820° N, 7.4913° E (Abuja)");

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (showAddForm && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#F59E0B"; // Construction Orange signature
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, [showAddForm]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const getGpsCoordinates = () => {
    if (navigator.geolocation) {
      setGps("Requesting sensor coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGps(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Precise Sensor)`);
        },
        () => {
          setGps("9.0820° N, 7.4913° E (Default Abuja Index)");
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let signatureUrl = "";
    if (hasSigned && canvasRef.current) {
      signatureUrl = canvasRef.current.toDataURL();
    }

    onAddLog({
      date: new Date().toISOString().split("T")[0],
      workersCount,
      visitors: visitors || "None",
      weather,
      materialsDelivered: materialsDelivered || "None",
      equipmentUsed: equipmentUsed || "None",
      workCompleted: workCompleted || "General monitoring",
      issues: issues || "None",
      signature: signatureUrl
    });

    // Reset Form
    setWorkersCount(15);
    setVisitors("");
    setWeather("Sunny");
    setMaterialsDelivered("");
    setEquipmentUsed("");
    setWorkCompleted("");
    setIssues("");
    setHasSigned(false);
    setShowAddForm(false);
  };

  // Calculate overall progress index
  const completedCount = stages.filter(s => s.completed).length;
  const overallProgress = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div>
        <h2 className="text-2xl font-semibold font-display text-amber-500 flex items-center gap-2">
          <ClipboardList className="w-6 h-6" /> Site Diary & Progress Tracker
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Log daily contractor headcounts, deliveries, equipment rosters, and sign diaries. Manage critical timeline completion rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Progress Timeline */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-200">Structural Milestone Milestones</h3>
            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
              {overallProgress}% Done
            </span>
          </div>

          {/* Svg progress wheel */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-900 fill-transparent" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" className="stroke-amber-500 fill-transparent transition-all duration-500" strokeWidth="8"
                        strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * overallProgress) / 100} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 font-mono">
                <span className="text-xl font-bold">{overallProgress}%</span>
                <span className="text-[9px] text-slate-400">COMPLETE</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {stages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => onToggleStage(idx)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  stage.completed
                    ? "bg-amber-500/10 border-amber-500/30 text-slate-200"
                    : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${stage.completed ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'}`}>
                    {stage.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{stage.name}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">{stage.completed ? "Signed Off" : "Pending"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Site Diary Logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-200">Daily Logs</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Site Day
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-semibold text-amber-500">New Site Entry</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contractor Headcount (PPE Compliant)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    value={workersCount}
                    onChange={(e) => setWorkersCount(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Weather Conditions</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                  >
                    <option value="Sunny">Sunny / Dry</option>
                    <option value="Heavy Rain">Heavy Rain (Work Suspended)</option>
                    <option value="Overcast / Mild Wind">Overcast / Mild Wind</option>
                    <option value="Dusty / Harmattan">Dusty / Harmattan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Materials Delivered Today</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
                    placeholder="e.g. 150 bags cement, 12 Tons sharp sand"
                    value={materialsDelivered}
                    onChange={(e) => setMaterialsDelivered(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Equipment Enrolled / Used</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
                    placeholder="e.g. Caterpillar Excavator 320, 1 cement mixer"
                    value={equipmentUsed}
                    onChange={(e) => setEquipmentUsed(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Work Done Summary</label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 h-20"
                  placeholder="Summarize structural elements cast, blockwork lay lengths, steel tie milestones completed..."
                  value={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Site Issues / Delays / Snags</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
                    placeholder="e.g. Rain dewater delays, concrete aggregate delay"
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex justify-between">
                    <span>GPS Telemetry Coordinates</span>
                    <button type="button" onClick={getGpsCoordinates} className="text-amber-500 font-semibold hover:underline">
                      Auto-Detect Sensor
                    </button>
                  </label>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{gps}</span>
                  </div>
                </div>
              </div>

              {/* Digital Signature Panel */}
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Digital Signature (Draw Signature below)</label>
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={80}
                    className="bg-slate-900 border border-dashed border-slate-800 rounded-lg cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="flex gap-4 w-full justify-between px-2 pt-1.5 text-[10px] text-slate-500">
                    <span>{hasSigned ? "✓ Signature captured" : "Sign using mouse/pointer"}</span>
                    <button type="button" onClick={clearSignature} className="text-red-400 font-semibold hover:underline">
                      Clear Signature
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl cursor-pointer"
                >
                  Confirm Sign-Off
                </button>
              </div>
            </form>
          )}

          {/* Logs List */}
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {log.date}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Cloud className="w-3.5 h-3.5 text-sky-400" /> {log.weather}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">LOG-{log.id}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-y border-slate-900/60 py-3">
                  <div>
                    <div className="text-slate-500">Workers</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{log.workersCount} head</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Visitors</div>
                    <div className="font-semibold text-slate-200 mt-0.5 truncate">{log.visitors}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Deliveries</div>
                    <div className="font-semibold text-slate-200 mt-0.5 truncate">{log.materialsDelivered}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Equipment</div>
                    <div className="font-semibold text-slate-200 mt-0.5 truncate">{log.equipmentUsed}</div>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-slate-500 font-semibold flex items-center gap-1">
                    <Hammer className="w-3.5 h-3.5 text-amber-500" /> Work Completed:
                  </div>
                  <p className="text-slate-300 leading-normal pl-4">{log.workCompleted}</p>
                </div>

                {log.issues && log.issues !== "None" && (
                  <div className="text-xs text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                    <strong>Site Snag Note:</strong> {log.issues}
                  </div>
                )}

                {log.signature && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-900/40">
                    <PenTool className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] text-slate-500">Authorized Clerk Sign-Off:</span>
                    <img src={log.signature} alt="Sign" className="h-6 bg-slate-950/60 rounded px-2 py-0.5 border border-slate-900" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
