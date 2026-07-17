/**
 * Seed content and preloaded databases for Castro AI Construction & Engineering Operating System
 */

import { MarketplaceItem } from "./types";

// Daily tips database (rotating tips)
export const DAILY_TIPS = [
  "Maintain concrete moisture curing for at least 7 days to reach optimal structural compressive strength.",
  "Check the soil bearing capacity before casting foundations. High clay soil requires deep bored piling or raft structures.",
  "Ensure a minimum of 50mm concrete cover on structural reinforcement steel to prevent carbonation and rust.",
  "Maintain a strict 'Kitchen Work Triangle' distance of 1.2m to 2.7m between sink, stove, and refrigerator for layout flow.",
  "Double-check that electrical and plumbing conduit routes do not cut through load-bearing columns directly.",
  "Keep wood moisture content below 19% for structural framing to avoid future dry rot or warping.",
  "Always establish site perimeter barricades and warning tapes around open excavations before sundown."
];

// Engineering quotes database
export const ENGINEERING_QUOTES = [
  { quote: "Scientists study the world as it is; engineers create the world that has never been.", author: "Theodore von Kármán" },
  { quote: "Architecture begins when you carefully put two bricks together. There it begins.", author: "Ludwig Mies van der Rohe" },
  { quote: "The road to success is always under construction.", author: "Lily Tomlin" },
  { quote: "Structural engineering is the art of molding materials we don't wholly understand into shapes we can't fully analyze, so as to withstand forces we can't really assess, in such a way that the community at large has no reason to suspect the extent of our ignorance.", author: "A.R. Dykes" }
];

// Searchable Glossary of Engineering & Architecture Terms (Preloading categories & items)
export const GLOSSARY_TERMS = [
  { term: "Admixture", definition: "A material other than water, aggregates, or cement used as an ingredient in concrete to modify its properties (e.g., retarders, accelerators, superplasticizers).", category: "Concrete & Masonry" },
  { term: "Aggregate", definition: "Granular material, such as sand, gravel, crushed stone, or iron-blast-furnace slag, used with a cementing medium to form concrete or mortar.", category: "Concrete & Masonry" },
  { term: "Bearing Capacity", definition: "The maximum load-carrying pressure that soil or rock can withstand without settlement or shear failure.", category: "Geotechnical & Foundations" },
  { term: "BIM (Building Information Modeling)", definition: "A digital representation of physical and functional characteristics of a facility, serving as a shared knowledge resource.", category: "Digital & Design" },
  { term: "BOQ (Bill of Quantities)", definition: "A document prepared by a quantity surveyor that lists the total materials, labour, and equipment needed for a construction project with corresponding costs.", category: "Quantity Surveying" },
  { term: "Cantilever", definition: "A rigid structural member, such as a beam or a slab, that projects horizontally and is anchored at only one end.", category: "Structural Engineering" },
  { term: "Dead Load", definition: "The permanent, inactive weight of the structure itself, including walls, floors, roofs, and permanently attached fixtures.", category: "Structural Engineering" },
  { term: "Live Load", definition: "Temporary or transient loads produced by the use and occupancy of the building, including people, furniture, and movable equipment.", category: "Structural Engineering" },
  { term: "Damp-Proof Course (DPC)", definition: "A horizontal barrier, usually made of thick plastic sheeting, bitumen, or slate, designed to prevent moisture rising from the ground up into walls.", category: "Concrete & Masonry" },
  { term: "Efflorescence", definition: "A crystalline deposit of soluble salts, usually white, that forms on the surface of brick, concrete, or stone walls as moisture evaporates.", category: "Concrete & Masonry" },
  { term: "Grade of Concrete", definition: "The minimum characteristic compressive strength of concrete cubes after 28 days of curing (e.g., M20, M25, M30, where the number represents strength in N/mm²).", category: "Concrete & Masonry" },
  { term: "Raft Foundation", definition: "A continuous concrete slab cast on the ground that supports the entire structure, distributing structural weight over a large area to bypass clay soils.", category: "Geotechnical & Foundations" },
  { term: "Shoring", definition: "Temporary support structures erected to prevent earth collapse in deep excavations or to support unstable walls during remodeling.", category: "Site Operations" },
  { term: "Take-Off", definition: "The process of measuring and counting construction materials from architectural plans to compile a Bill of Quantities.", category: "Quantity Surveying" },
  { term: "U-Value", definition: "The measure of heat transmission through a building element (wall, window, roof). Lower U-values represent better thermal insulation.", category: "Sustainability" }
];

// Preloaded articles
export const KNOWLEDGE_ARTICLES = [
  {
    id: "art-1",
    title: "How to Estimate Building Costs Accurately",
    summary: "A comprehensive guide on cost planning, from initial unit rate estimates to taking off quantities and calculating detailed labor components.",
    category: "Quantity Surveying",
    content: `Estimating building costs is both a science and an art. Quantity Surveyors use several methods to arrive at an accurate figure:

### 1. Cubage / Area Method
For quick preliminary estimates, architects use the square meter or cubic meter rates of similar previously built structures in the same city. For instance, if residential buildings cost $450/sqm, a 200 sqm duplex will cost roughly $90,000.

### 2. Elemental Cost Analysis (ECA)
This breaks down the building into core elements: Substructure, Superstructure, Roofing, MEP services, and Finishes. This helps identify where costs are concentrated.

### 3. Detailed Bill of Quantities (BOQ)
The most reliable method, which involves counting and calculating the volume, area, and weight of every brick, concrete batch, iron rebar, door, and paint can. This is coupled with local labor rates and material price indices to prevent budget overrun.`,
    readTime: "5 min read"
  },
  {
    id: "art-2",
    title: "Understanding Reinforced Concrete and Column Loading",
    summary: "Learn how concrete and steel work in synergy to handle high compressive and tensile stresses in beams and vertical columns.",
    category: "Structural Engineering",
    content: `Concrete is extremely strong in compression but weak in tension. Steel, conversely, has high tensile strength but buckles under heavy compression. By joining them together, we get the ultimate structural material.

### Crucial Engineering Rules:
- **Tension Zones**: In beams, tension occurs at the bottom when loaded. Reinforcement bars must be placed in the bottom zone.
- **Shear Links (Stirrups)**: These hold the main bars together and prevent diagonal shear cracking. They must be spaced more closely near the support columns.
- **Concrete Cover**: Steel must be protected from environmental moisture by a minimum of 40mm to 50mm of concrete. Failure to do so leads to carbonation, rusting, expansion, and structural concrete spalling.`,
    readTime: "7 min read"
  },
  {
    id: "art-3",
    title: "Reading Construction Drawings: A Beginner's Manual",
    summary: "Unlock the ability to interpret floor plans, cross-sections, elevation views, structural detailing drawings, and schedules.",
    category: "Architecture",
    content: `Construction drawings are the primary universal language of the building industry. 

### Key Elements of a Drawing:
- **Plan View**: A bird's-eye view looking down from a horizontal cut about 1.2m above floor level. Shows walls, room layouts, doors, and windows.
- **Elevation View**: A side view showing the exterior styling, height coordinates, and window vertical placements.
- **Section View**: A vertical cut showing the internal heights, foundation depth, roof pitch, slab thicknesses, and plastering details.
- **Schedules**: Informational tables listing specific dimensions, counts, and descriptions of elements like doors, windows, and finishes.`,
    readTime: "4 min read"
  },
  {
    id: "art-4",
    title: "Common Geotechnical Failures & Mitigation",
    summary: "How to prevent foundation cracks, differential settlement, and structural failure in clay or marshy environments.",
    category: "Civil Engineering",
    content: `Geotechnical issues account for more than 50% of structural failures worldwide. Understanding how soil interacts with foundations is paramount.

### Core Foundation Strategies:
- **Strip Foundations**: Suitable for normal, firm soil. 
- **Pad Foundations**: Isolated concrete pads under columns, excellent for framed structures on stable soil.
- **Raft / Mat Foundation**: A giant solid slab supporting the whole building. Excellent for soft clay as it distributes the structural load over the entire footprint, minimizing differential settlement.
- **Pile Foundations**: Deep concrete piles driven into the ground to reach solid rock or load-bearing strata. Essential for skyscrapers, bridges, and soft coastal soils.`,
    readTime: "6 min read"
  }
];

// Preloaded construction templates
export const CONSTRUCTION_TEMPLATES = [
  { id: "temp-1", title: "Standard 4-Bedroom Duplex BOQ Template", type: "BOQ Excel", size: "1.2 MB" },
  { id: "temp-2", title: "Residential Building Contract Deed", type: "Word Document", size: "450 KB" },
  { id: "temp-3", title: "Site Safety Protocol and Hazard Inspection Checklist", type: "PDF Template", size: "850 KB" },
  { id: "temp-4", title: "Standard CAD Blocks: Sanitary & Kitchen Fixtures", type: "DWG File", size: "4.1 MB" },
  { id: "temp-5", title: "Structural Detailing Checklist for Slabs & Beams", type: "PDF Checklist", size: "320 KB" }
];

// Structural Learning Center Outline Courses
export const LEARNING_COURSES = [
  {
    id: "course-1",
    title: "Foundations & Substructure Engineering",
    duration: "4 modules • 12 lessons",
    level: "Beginner to Intermediate",
    modules: [
      { name: "Module 1: Soil Mechanics & Site Characterization", lessons: ["Soil profiles & bearing capacity", "Standard Penetration Test (SPT) interpretation", "Water table management"] },
      { name: "Module 2: Shallow Foundations design", lessons: ["Strip footing sizing", "Isolated pad detailing", "Raft/Mat design protocols"] },
      { name: "Module 3: Deep Foundations (Piles)", lessons: ["Friction vs End-bearing piles", "Bored cast-in-situ concrete piles", "Pile cap reinforcement detailing"] }
    ]
  },
  {
    id: "course-2",
    title: "Reinforced Concrete Frame Design",
    duration: "3 modules • 9 lessons",
    level: "Intermediate to Advanced",
    modules: [
      { name: "Module 1: Beams in Flexure", lessons: ["Singularly vs Doubly reinforced beams", "Calculating shear links spacing", "Deflection limits and span/depth ratios"] },
      { name: "Module 2: Column Buckling & Axial Loading", lessons: ["Short vs Slender columns", "Biaxial bending calculations", "Starter bars & column splicing"] },
      { name: "Module 3: Structural Slabs", lessons: ["One-way vs Two-way slab moments", "Flat slab shear head detailing", "Reinforcement mesh layout rules"] }
    ]
  }
];

// Seeded marketplace items
export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "mkt-1",
    title: "Modern 5-Bedroom Triplex Architectural Plan (CAD + PDF)",
    category: "House Plans",
    price: 149.00,
    rating: 4.8,
    downloads: 124,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mkt-2",
    title: "Universal Quantity Take-Off & Cost Estimator Sheet",
    category: "BOQ Templates",
    price: 29.00,
    rating: 4.9,
    downloads: 382,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mkt-3",
    title: "Complete AutoCAD Blocks: Professional Landscape & Trees",
    category: "CAD Blocks",
    price: 19.00,
    rating: 4.7,
    downloads: 512,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mkt-4",
    title: "MEP Coordination & Clash-Detection Template Bundle",
    category: "BIM Components",
    price: 79.00,
    rating: 4.6,
    downloads: 89,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=500&q=80"
  }
];

// Sample Construction Project Case Studies
export const CASE_STUDIES = [
  {
    title: "The Sunset Heights Duplex, Abuja",
    type: "Residential Duplex",
    budget: "$120,000",
    duration: "8 months",
    challenges: "High plasticity black cotton soil requiring raft foundation; steep gradient terrain.",
    solutions: "Custom soil substitution layer coupled with a 450mm deep concrete raft slab designed using finite element analysis.",
    results: "Delivered 2 weeks ahead of schedule. Post-construction inspection shows zero structural settlement cracks after 18 months."
  },
  {
    title: "Lakeside Commercial Office Block, Lagos",
    type: "3-Storey Office Building",
    budget: "$450,000",
    duration: "14 months",
    challenges: "Extremely high water table (coastal sands); dense surrounding urban infrastructure.",
    solutions: "Continuous sheet-piling and active well-point dewatering systems. Deep foundation driven concrete piles (22 meters deep).",
    results: "MEP services safely integrated using modern slab-conduiting, reducing ceiling height loss. Certified high-grade concrete M30 was poured."
  }
];
