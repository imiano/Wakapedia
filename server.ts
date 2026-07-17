import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Configure body parsing with a limit for base64 image uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Helper to safely get Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_LINT",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure API key is configured
function hasApiKey() {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
}

// 1. AI Project Planner Endpoint
app.post("/api/planner", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!hasApiKey()) {
      // Fallback with realistic mock data for preview/testing if key isn't present
      return res.json({
        scope: `Construction of a premium project based on "${prompt}". Includes foundation work, masonry, roofing, MEP (mechanical, electrical, plumbing) installations, and finishing.`,
        wbs: [
          { phase: "Phase 1: Substucture & Foundation", tasks: ["Excavation and earthworks", "Pouring concrete footings", "Foundation blockwork", "Slab casting (DPC)"] },
          { phase: "Phase 2: Superstructure", tasks: ["Column casting", "Wall blockwork / masonry", "Lintel and beams construction", "Roof truss installation and covering"] },
          { phase: "Phase 3: MEP & First Fix", tasks: ["Plumbing piping installation", "Electrical conduit routing", "Window frames and external door fixing"] },
          { phase: "Phase 4: Finishes & Handover", tasks: ["Internal plastering and POP", "Floor tiling and painting", "Sanitary and electrical fittings", "External landscaping and final cleanup"] }
        ],
        timeline: "Estimated duration: 6 to 9 months depending on site conditions, weather, and funding schedules.",
        materials: [
          { name: "Portland Cement (50kg bags)", quantity: "850 bags", purpose: "Foundation, structural slabs, and plastering" },
          { name: "Concrete Blocks (9-inch)", quantity: "3,200 units", purpose: "External perimeter and load-bearing walls" },
          { name: "Concrete Blocks (6-inch)", quantity: "2,400 units", purpose: "Internal partition walls" },
          { name: "Reinforcement Steel (12mm/16mm)", quantity: "4.5 Tons", purpose: "Columns, beams, and slab reinforcement" },
          { name: "Sharp Sand & Granite", quantity: "150 Tons each", purpose: "Concrete mix and mortar" },
          { name: "Roofing Sheets (Aluminium 0.55mm)", quantity: "320 sqm", purpose: "Roof covering" }
        ],
        labour: [
          { role: "Masons / Bricklayers", headcount: 6, responsibility: "Blockwork and plastering" },
          { role: "Carpenters / Formwork builders", headcount: 4, responsibility: "Roofing trusses and formwork" },
          { role: "Steel Fixers / Iron benders", headcount: 3, responsibility: "Reinforcement bar assembly" },
          { role: "Plumbers & Electricians", headcount: 3, responsibility: "Conduiting and pipe layout" }
        ],
        budget: {
          materialsCost: "$28,500 - $34,000",
          labourCost: "$12,000 - $15,500",
          contingency: "$4,500 - $6,000",
          totalEstimate: "$45,000 - $55,500",
          disclaimer: "Estimated budget only. Local material price indices and site conditions will affect final costs."
        },
        risks: [
          "Soil stability variations (recommend conducting a soil bearing capacity test first).",
          "Weather delays during foundation excavation and slab casting.",
          "Price volatility of cement and steel reinforcements during construction cycles."
        ],
        inspections: [
          "Excavation depth and soil firmness check before pouring concrete.",
          "Steel reinforcement and formwork approval before structural concrete casting.",
          "Plumbing pressure tests and electrical insulation tests prior to plastering."
        ]
      });
    }

    const ai = getAI();
    const systemPrompt = `You are an expert Quantity Surveyor and Structural Engineer. Generate a comprehensive project plan based on the user's brief. Format the output STRICTLY as a JSON object matching the following TypeScript schema:
    {
      scope: string;
      wbs: { phase: string; tasks: string[] }[];
      timeline: string;
      materials: { name: string; quantity: string; purpose: string }[];
      labour: { role: string; headcount: number; responsibility: string }[];
      budget: { materialsCost: string; labourCost: string; contingency: string; totalEstimate: string; disclaimer: string };
      risks: string[];
      inspections: string[];
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a construction project plan for: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Planner error:", error);
    res.status(500).json({ error: error.message || "Failed to generate plan" });
  }
});

// 2. AI Drawing Review Endpoint
app.post("/api/review-drawing", async (req, res) => {
  try {
    const { image, text: userText } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Drawing image is required" });
    }

    if (!hasApiKey()) {
      return res.json({
        issues: [
          { type: "Dimension", desc: "Missing dimensions in the master bedroom dressing area layout.", severity: "Medium" },
          { type: "Compliance", desc: "Door width for bathroom is 700mm. Recommended minimum is 800mm for wheelchair / disability accessibility compliance.", severity: "High" },
          { type: "Layout", desc: "Kitchen work triangle is slightly extended. Placing the sink closer to the refrigerator will optimize cooking workflow.", severity: "Low" },
          { type: "Labels", desc: "Unlabeled utility closet next to the corridor entrance.", severity: "Low" }
        ],
        optimizations: "Consider shifting the master bathroom doorway to increase continuous wall space for wardrobes. Utilize high-efficiency natural lighting orientations for the living room glazing panels.",
        disclaimer: "AI evaluation is for informational review only. All construction plans must be audited, sealed, and approved by a licensed architect or structural engineer."
      });
    }

    // Process base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png"
      }
    };

    const promptText = `Review this architectural floor plan / engineering drawing. Check for layout flow, potential accessibility issues, missing standard labels, ventilation balance, and structural load alignment. Identify issues and suggest space optimization ideas.
    Return a JSON object conforming STRICTLY to this schema:
    {
      issues: { type: 'Dimension' | 'Compliance' | 'Layout' | 'Labels' | 'Other', desc: string, severity: 'High' | 'Medium' | 'Low' }[];
      optimizations: string;
      disclaimer: string;
    }
    User notes: ${userText || "None"}`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Drawing review error:", error);
    res.status(500).json({ error: error.message || "Failed to review drawing" });
  }
});

// 3. AI Site Inspector Endpoint (Site photo review)
app.post("/api/review-site", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Site photo is required" });
    }

    if (!hasApiKey()) {
      return res.json({
        progressSummary: "Excavation and foundation steelworks are in progress. Ground excavation seems complete with trench reinforcements visible. Concrete pouring preparatory phase is active.",
        qualityObservations: [
          "Trench shoring seems stable with no visible signs of side collapse.",
          "Reinforcement bars are spaced adequately, but check steel rebar chairs to maintain a 50mm concrete cover clearance.",
          "Some standing rainwater gathered in the southern excavation pit needs dewatering before concrete casting."
        ],
        safetyChecklist: [
          { item: "Personnel PPE Compliance", status: "Pass (All visible workers are wearing hard hats and safety boots)" },
          { item: "Perimeter Barricading", status: "Warning (Open trenches require distinct high-visibility orange warning tapes)" },
          { item: "Excavation Access", status: "Pass (Secure access ladder is in position)" }
        ],
        suggestedNextSteps: [
          "Pump out any residual rainwater from the trenches.",
          "Finalize reinforcement steel tie checks with the structural inspector.",
          "Begin pouring foundation concrete mix (C25 grade recommended)."
        ],
        draftReport: "SITE INSPECTION LOG\n\nInspection Type: Foundation Prep & Reinforcements\nStatus: Pre-approval stage\nObservations: Excavated trenches show firm soil load conditions. Steel reinforcements are tied correctly. Mild dewatering needed. Safety tapes need to be erected around open excavation pits before dusk.\nRecommendation: Proceed to concrete casting once dewatered."
      });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png"
      }
    };

    const promptText = `Analyze this construction site photo. Assess the stage of construction, notice reinforcement details, identify clear safety warnings, observe material stocking, and write a site report.
    Return a JSON object conforming STRICTLY to this schema:
    {
      progressSummary: string;
      qualityObservations: string[];
      safetyChecklist: { item: string, status: 'Pass' | 'Warning' | 'Fail' }[];
      suggestedNextSteps: string[];
      draftReport: string;
    }`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Site inspector error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze site photo" });
  }
});

// 4. AI Knowledge Assistant (Chat)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!hasApiKey()) {
      // Return a smart response based on keywords
      const lower = message.toLowerCase();
      let answer = "I am Castro AI, your Engineering & Construction assistant. Please configure your API key to unlock the full power of Gemini reasoning! Here is some general engineering guidance:\n\n";
      
      if (lower.includes("clay") || lower.includes("soil")) {
        answer += "For clay soils, foundation depth must be sufficient to bypass the seasonal active zone where swelling and shrinkage occur. Wide strip foundations, raft/mat foundations, or deep bored piles are highly recommended to distribute structural loads evenly and prevent differential settlement.";
      } else if (lower.includes("paint")) {
        answer += "To estimate paint: Calculate the total wall surface area (length x height of all walls) and subtract windows and doors. Usually, 1 gallon (3.8 liters) of high-quality paint covers about 350 to 400 square feet (32 to 37 sqm) with a single coat. Double this for two coats.";
      } else if (lower.includes("boq") || lower.includes("bill")) {
        answer += "A Bill of Quantities (BOQ) is prepared by taking off measurements from architectural and engineering drawings. It lists description of works, quantities in standard units (cubic meters, square meters, tons), and rate analysis columns to estimate individual item prices.";
      } else if (lower.includes("expansion")) {
        answer += "Expansion joints are deliberate gaps in large structures (concrete slabs, bridges, brickwork walls) designed to relieve stress caused by thermal expansion, contraction, concrete curing shrinkage, and tectonic settlements without cracking.";
      } else {
        answer += "You can ask me about concrete mix designs, reinforcement steel layouts, material estimates, building code standards, safety protocols, and structural beam calculations. I will provide accurate formulas and standard practices!";
      }
      return res.json({ response: answer });
    }

    const ai = getAI();
    // Build chat history
    const geminiHistory = (history || []).map((h: any) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: geminiHistory,
      config: {
        systemInstruction: "You are Castro AI, the intelligent Construction & Engineering Operating System advisor. You assist architects, civil and structural engineers, quantity surveyors, and project managers. Provide highly professional, technical, mathematically sound, and building code-compliant answers. Always add a small professional disclaimer when giving safety or structural loading calculations.",
      }
    });

    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to chat" });
  }
});

// 5. AI BOQ Generator / Quantity Surveyor
app.post("/api/generate-boq", async (req, res) => {
  try {
    const { projectType, items } = req.body;
    if (!projectType) {
      return res.status(400).json({ error: "Project details are required" });
    }

    if (!hasApiKey()) {
      // Mock BOQ
      return res.json({
        billItems: [
          { code: "1.1", desc: "Site clearing, excavation of top soil (150mm deep) and carting away", unit: "m2", qty: 250, rate: 8.50, amount: 2125.00 },
          { code: "1.2", desc: "Excavation of trenches for strip foundation not exceeding 1.5m deep", unit: "m3", qty: 75, rate: 25.00, amount: 1875.00 },
          { code: "2.1", desc: "Concrete in strip foundation footings (Grade C20, aggregate 20mm)", unit: "m3", qty: 45, rate: 145.00, amount: 6525.00 },
          { code: "2.2", desc: "9-inch hollow sandcrete blocks filled solid with concrete", unit: "m2", qty: 180, rate: 32.00, amount: 5760.00 },
          { code: "3.1", desc: "High-tensile reinforcement bars (12mm, 16mm) in foundation columns", unit: "Tons", qty: 2.8, rate: 1100.00, amount: 3080.00 },
          { code: "4.1", desc: "Damp proof course (DPC) installation using thick polythene sheets", unit: "m2", qty: 210, rate: 4.50, amount: 945.00 }
        ],
        totalBOQ: 20310.00,
        assumptions: "Includes standard ground excavations on firm soils. Excludes deep piling, water-logged mud dewatering equipment rental, and customized high-premium finishes."
      });
    }

    const systemPrompt = `You are an expert Quantity Surveyor (QS). Generate a highly realistic Bill of Quantities (BOQ) with accurate material rates, description of works, standard units (m3, m2, Tons, kg, m, No.), quantities, and rate analyses. Format the response STRICTLY as a JSON object matching this schema:
    {
      billItems: { code: string; desc: string; unit: string; qty: number; rate: number; amount: number }[];
      totalBOQ: number;
      assumptions: string;
    }`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a detailed Bill of Quantities (BOQ) for: "${projectType}" with items like: ${JSON.stringify(items || [])}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("BOQ generator error:", error);
    res.status(500).json({ error: error.message || "Failed to generate BOQ" });
  }
});

// 6. AI Report Writer Endpoint
app.post("/api/write-report", async (req, res) => {
  try {
    const { reportType, details } = req.body;
    if (!reportType || !details) {
      return res.status(400).json({ error: "Report type and details are required" });
    }

    if (!hasApiKey()) {
      return res.json({
        title: `${reportType} - CASTRO OPERATIONAL REPORT`,
        date: new Date().toLocaleDateString(),
        content: `### 1. EXECUTION SUMMARY\nThis is a professionally drafted ${reportType} generated for construction activities with parameters: ${details}.\n\n### 2. PRIMARY OBSERVATIONS\n- All structural works comply with design indices.\n- Subcontractor attendance was certified.\n- Material deliveries have been fully documented.\n\n### 3. PROJECT OUTCOMES & HAZARDS\n- Excavation barricades are active.\n- Structural curing period must be maintained.\n- No safety snags registered today.\n\n### 4. RECOMMENDATIONS\n- Maintain the specified moisture curing cycle on the slab.\n- Conduct reinforcement audits for next column pours.\n\n*Drafted by Castro AI Inspector Module*`
      });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Write a highly detailed, professional, structured engineering and site report of type: "${reportType}" based on these parameters: "${details}". Output the response as a JSON object matching this schema:
      {
        title: string;
        date: string;
        content: string; // Elaborate Markdown formatted site report content
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Report writer error:", error);
    res.status(500).json({ error: error.message || "Failed to generate report" });
  }
});

// Serve Vite middleware or production assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
