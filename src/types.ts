/**
 * Types and interfaces for Castro AI Construction & Engineering Operating System
 */

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  budget: number;
  timeline: string;
  progress: number; // 0 to 100
  status: "Planning" | "In Progress" | "On Hold" | "Completed";
  drawings: DrawingFile[];
  expenses: Expense[];
  team: TeamMember[];
  milestones: Milestone[];
  photos: string[]; // Base64 or URL
  documents: string[];
  snagList: SnagItem[];
  siteLogs: SiteLog[];
  plannerData?: AIPlannerResponse;
}

export interface DrawingFile {
  id: string;
  name: string;
  uploadDate: string;
  version: string;
  url: string; // Base64 or placeholder
  comments: DrawingComment[];
}

export interface DrawingComment {
  id: string;
  author: string;
  text: string;
  date: string;
  x?: number; // Position on canvas
  y?: number;
}

export interface Expense {
  id: string;
  description: string;
  category: "Materials" | "Labour" | "Equipment" | "Permits" | "Utility" | "Other";
  amount: number;
  date: string;
  approvedBy?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "Architect" | "Civil Engineer" | "Structural Engineer" | "Quantity Surveyor" | "Contractor" | "Client" | "Consultant";
  email: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface SnagItem {
  id: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: "Open" | "In Progress" | "Resolved";
  photo?: string;
}

export interface SiteLog {
  id: string;
  date: string;
  workersCount: number;
  visitors: string;
  weather: string;
  materialsDelivered: string;
  equipmentUsed: string;
  workCompleted: string;
  issues: string;
  signature?: string;
}

export interface AIPlannerResponse {
  scope: string;
  wbs: { phase: string; tasks: string[] }[];
  timeline: string;
  materials: { name: string; quantity: string; purpose: string }[];
  labour: { role: string; headcount: number; responsibility: string }[];
  budget: { materialsCost: string; labourCost: string; contingency: string; totalEstimate: string; disclaimer: string };
  risks: string[];
  inspections: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: "House Plans" | "CAD Blocks" | "BOQ Templates" | "Calculators" | "Checklists" | "BIM Components";
  price: number;
  rating: number;
  downloads: number;
  image: string;
}

export interface SustainabilityReport {
  energyEfficiency: string; // A++, A, B, etc.
  waterUsage: number; // liters/day estimate
  solarPotential: string; // High/Med/Low
  carbonFootprint: number; // CO2 tons estimate
  greenChecklist: { item: string; checked: boolean }[];
}
