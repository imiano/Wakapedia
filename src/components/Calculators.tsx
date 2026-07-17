import React, { useState } from "react";
import { Calculator, RefreshCw, Layers, Hammer, Paintbrush, Ruler, HelpCircle, DollarSign } from "lucide-react";

type CalcTab = "concrete" | "blocks" | "paint" | "tiles" | "steel" | "beam" | "converter";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<CalcTab>("concrete");

  // Concrete calculator state
  const [concreteVol, setConcreteVol] = useState(10); // cubic meters
  const [concreteRatio, setConcreteRatio] = useState("1:2:4"); // cement:sand:aggregate

  // Block/Brick calculator state
  const [wallLength, setWallLength] = useState(15); // meters
  const [wallHeight, setWallHeight] = useState(3); // meters
  const [blockSize, setBlockSize] = useState("9inch"); // 9inch or 6inch or standard brick

  // Paint calculator state
  const [paintArea, setPaintArea] = useState(120); // sqm
  const [paintCoats, setPaintCoats] = useState(2);

  // Tile calculator state
  const [tileArea, setTileArea] = useState(80); // sqm
  const [tileSize, setTileSize] = useState(0.36); // sqm per tile (e.g. 60x60cm = 0.36sqm)
  const [tileWaste, setTileWaste] = useState(10); // % waste

  // Steel Weight state
  const [steelDiameter, setSteelDiameter] = useState(12); // mm rebar
  const [steelLength, setSteelLength] = useState(12); // meters (standard length)
  const [steelCount, setSteelCount] = useState(50); // number of rebars

  // Beam load calculator state
  const [beamSpan, setBeamSpan] = useState(4); // meters
  const [beamLoad, setBeamLoad] = useState(15); // kN/m (Distributed load)
  const [beamDepth, setBeamDepth] = useState(450); // mm
  const [beamWidth, setBeamWidth] = useState(225); // mm

  // Unit Converter state
  const [convVal, setConvVal] = useState(100);
  const [convType, setConvType] = useState("sqm-to-sqft");

  // Calculations
  const calculateConcrete = () => {
    // 1m3 of concrete requires approx 1.54m3 of dry ingredients due to shrinkage and void filling
    const dryVolMultiplier = 1.54;
    const dryVol = concreteVol * dryVolMultiplier;

    let partsCement = 1, partsSand = 2, partsAggregate = 4;
    if (concreteRatio === "1:1.5:3") { // M20
      partsCement = 1; partsSand = 1.5; partsAggregate = 3;
    } else if (concreteRatio === "1:1:2") { // M25
      partsCement = 1; partsSand = 1; partsAggregate = 2;
    } else if (concreteRatio === "1:3:6") { // M10
      partsCement = 1; partsSand = 3; partsAggregate = 6;
    }

    const totalParts = partsCement + partsSand + partsAggregate;
    const cementVol = (partsCement / totalParts) * dryVol;
    const sandVol = (partsSand / totalParts) * dryVol;
    const aggregateVol = (partsAggregate / totalParts) * dryVol;

    // Density of cement = 1440 kg/m3. One bag = 50kg.
    const cementBags = Math.ceil((cementVol * 1440) / 50);
    // Sand & Aggregate tonnage (approx 1.6 tons per m3)
    const sandTons = (sandVol * 1.6).toFixed(2);
    const aggTons = (aggregateVol * 1.6).toFixed(2);

    return { cementBags, sandTons, aggTons };
  };

  const calculateBlocks = () => {
    const totalArea = wallLength * wallHeight;
    let blocksNeeded = 0;
    
    if (blockSize === "9inch") {
      // 9-inch sandcrete block face dimension: 450mm x 225mm = 0.10125 sqm. Approx 10 blocks per sqm.
      blocksNeeded = Math.ceil(totalArea * 10);
    } else if (blockSize === "6inch") {
      // 6-inch blocks also approx 10 per sqm (same face size, just thinner thickness).
      blocksNeeded = Math.ceil(totalArea * 10);
    } else { // standard clay brick: 225x112.5x75mm. Approx 50 to 60 bricks per sqm with mortar joints.
      blocksNeeded = Math.ceil(totalArea * 55);
    }

    // Mortar: roughly 0.6 bags of cement per sqm of wall blockwork
    const cementBags = Math.ceil(totalArea * 0.08);
    const sandTons = (totalArea * 0.012).toFixed(2);

    return { blocksNeeded, cementBags, sandTons };
  };

  const calculatePaint = () => {
    // 1 gallon covers approx 35 square meters (single coat)
    const totalCoverageNeeded = paintArea * paintCoats;
    const gallonsNeeded = (totalCoverageNeeded / 35).toFixed(1);
    const litersNeeded = (parseFloat(gallonsNeeded) * 3.785).toFixed(1);
    return { gallonsNeeded, litersNeeded };
  };

  const calculateTiles = () => {
    const areaWithWaste = tileArea * (1 + tileWaste / 100);
    const tilesNeeded = Math.ceil(areaWithWaste / tileSize);
    const cementBags = Math.ceil(tileArea * 0.12); // Adhesive/grout estimation
    return { tilesNeeded, cementBags };
  };

  const calculateSteel = () => {
    // Formula: Weight (kg/m) = d^2 / 162.2
    const weightPerMeter = (steelDiameter * steelDiameter) / 162.162;
    const totalWeightKg = weightPerMeter * steelLength * steelCount;
    const totalTons = (totalWeightKg / 1000).toFixed(3);
    return { weightPerMeter: weightPerMeter.toFixed(3), totalWeightKg: totalWeightKg.toFixed(1), totalTons };
  };

  const calculateBeam = () => {
    // Educational beam calculations: Maximum bending moment and deflection
    // Simply supported beam with Uniformly Distributed Load (UDL)
    // Max Moment M = w * L^2 / 8
    const maxMoment = (beamLoad * beamSpan * beamSpan) / 8;
    
    // Elastic Section Modulus Zx = b * d^2 / 6
    // Width (b), Depth (d)
    const depthM = beamDepth / 1000;
    const widthM = beamWidth / 1000;
    const zx = (widthM * depthM * depthM) / 6;
    
    // Max bending stress = M / Zx (kN/m2 -> MPa)
    const maxStress = (maxMoment / (zx * 1000)).toFixed(1);

    // Theoretical maximum deflection limit: L / 250 (standard code limit)
    const limitDeflection = ((beamSpan * 1000) / 250).toFixed(1);

    return { maxMoment: maxMoment.toFixed(1), maxStress, limitDeflection };
  };

  const handleConversion = () => {
    switch (convType) {
      case "sqm-to-sqft": return `${(convVal * 10.764).toFixed(2)} Sq Ft`;
      case "meters-to-feet": return `${(convVal * 3.2808).toFixed(2)} Feet`;
      case "cum-to-cuft": return `${(convVal * 35.315).toFixed(2)} Cu Ft`;
      case "kg-to-lbs": return `${(convVal * 2.2046).toFixed(2)} Lbs`;
      case "tons-to-bags": return `${Math.ceil((convVal * 1000) / 50)} Cement Bags`;
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-display text-amber-500 flex items-center gap-2">
          <Calculator className="w-6 h-6" /> Engineering & Material Calculators
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Perform quick, high-precision concrete mix takes, brick counts, rebar tonnage weights, and structural calculations according to standard engineering codes.
        </p>
      </div>

      {/* Calculator Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-3">
        {[
          { id: "concrete", label: "Concrete Mix", icon: Layers },
          { id: "blocks", label: "Blocks & Bricks", icon: Hammer },
          { id: "paint", label: "Paint Coverage", icon: Paintbrush },
          { id: "tiles", label: "Tiling Estimator", icon: Layers },
          { id: "steel", label: "Steel Weight", icon: Calculator },
          { id: "beam", label: "Beam Load (Educational)", icon: Ruler },
          { id: "converter", label: "Unit Converter", icon: RefreshCw }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CalcTab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/25"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Fields Column */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-base font-semibold text-slate-200">Inputs</h3>
          
          {activeTab === "concrete" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Concrete Volume (m³)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={concreteVol}
                  onChange={(e) => setConcreteVol(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Prescribed Grade (Ratio)</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={concreteRatio}
                  onChange={(e) => setConcreteRatio(e.target.value)}
                >
                  <option value="1:2:4">M15 (1:2:4) - Slabs & Paths</option>
                  <option value="1:1.5:3">M20 (1:1.5:3) - Reinforced Beams</option>
                  <option value="1:1:2">M25 (1:1:2) - Heavy Columns</option>
                  <option value="1:3:6">M10 (1:3:6) - Blinding / Foundations</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "blocks" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Wall Length (m)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={wallLength}
                  onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Wall Height (m)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Block / Brick Size</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={blockSize}
                  onChange={(e) => setBlockSize(e.target.value)}
                >
                  <option value="9inch">9-Inch Hollow Block (450x225mm)</option>
                  <option value="6inch">6-Inch Hollow Block (450x150mm)</option>
                  <option value="brick">Standard Clay Brick (225x112x75mm)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "paint" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Surface Area (m²)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={paintArea}
                  onChange={(e) => setPaintArea(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Number of Coats</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={paintCoats}
                  min="1"
                  max="4"
                  onChange={(e) => setPaintCoats(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}

          {activeTab === "tiles" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Floor Area to Cover (m²)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={tileArea}
                  onChange={(e) => setTileArea(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tile Dimensions (m² per tile)</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={tileSize}
                  onChange={(e) => setTileSize(parseFloat(e.target.value) || 0.36)}
                >
                  <option value="0.36">60cm x 60cm (0.36 m²)</option>
                  <option value="0.09">30cm x 30cm (0.09 m²)</option>
                  <option value="0.16">40cm x 40cm (0.16 m²)</option>
                  <option value="0.72">60cm x 120cm (0.72 m²)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Wastage Buffer (%)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={tileWaste}
                  onChange={(e) => setTileWaste(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {activeTab === "steel" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Rebar Diameter (mm)</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={steelDiameter}
                  onChange={(e) => setSteelDiameter(parseFloat(e.target.value) || 12)}
                >
                  <option value="8">Y8 (8mm stirrup bar)</option>
                  <option value="10">Y10 (10mm structural bar)</option>
                  <option value="12">Y12 (12mm primary bar)</option>
                  <option value="16">Y16 (16mm high-strength bar)</option>
                  <option value="20">Y20 (20mm column core bar)</option>
                  <option value="25">Y25 (25mm bridge deck bar)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Length of One Bar (m)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={steelLength}
                  onChange={(e) => setSteelLength(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Total Number of Bars</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={steelCount}
                  onChange={(e) => setSteelCount(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {activeTab === "beam" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Clear Span (m)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={beamSpan}
                  onChange={(e) => setBeamSpan(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Uniform Design Load (kN/m)</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={beamLoad}
                  onChange={(e) => setBeamLoad(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Beam Depth (mm)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={beamDepth}
                    onChange={(e) => setBeamDepth(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Beam Width (mm)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={beamWidth}
                    onChange={(e) => setBeamWidth(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "converter" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Conversion Metric</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={convType}
                  onChange={(e) => setConvType(e.target.value)}
                >
                  <option value="sqm-to-sqft">Square Meters (m²) to Square Feet (sqft)</option>
                  <option value="meters-to-feet">Meters to Feet</option>
                  <option value="cum-to-cuft">Cubic Meters (m³) to Cubic Feet (cuft)</option>
                  <option value="kg-to-lbs">Kilograms (kg) to Pounds (lbs)</option>
                  <option value="tons-to-bags">Tons of Cement to 50kg bags</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Value to Convert</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={convVal}
                  onChange={(e) => setConvVal(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Results Dashboard Columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl h-full min-h-[300px]">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-amber-500" /> Quantity Takeoff Results
            </h3>

            {activeTab === "concrete" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Cement Needed</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateConcrete().cementBags} <span className="text-xs text-slate-300">Bags</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Based on standard 50kg cement packaging.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Fine Aggregate (Sand)</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateConcrete().sandTons} <span className="text-xs text-slate-400">Tons</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Calculated dry volume with 1.6 t/m³ factor.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Coarse Aggregate (Granite)</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateConcrete().aggTons} <span className="text-xs text-slate-400">Tons</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Required graded 20mm aggregates.</div>
                  </div>
                </div>

                <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 space-y-2 text-xs text-slate-300">
                  <h4 className="font-semibold text-amber-500 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" /> Code Insight: Volume Expansion Factor
                  </h4>
                  <p className="leading-relaxed">
                    Dry concrete ingredients occupy less volume when mixed with water due to voids filling. We have automatically incorporated a <strong>1.54 volume scaling factor</strong> to make sure you do not run short of aggregate on site.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "blocks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Blocks / Bricks Count</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateBlocks().blocksNeeded} <span className="text-xs text-slate-300">Units</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Assuming standard face joints.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Cement for Mortar</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateBlocks().cementBags} <span className="text-xs text-slate-400">Bags</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Required for blocklaying laying mortar.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Sharp Sand for Jointing</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateBlocks().sandTons} <span className="text-xs text-slate-400">Tons</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Approximate laying sand volume.</div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
                  <p>
                    <strong>Face Dimension Assumptions:</strong> Sandcrete blocks are estimated at 450mm x 225mm face area. If using bricks, standard clay size of 225mm x 112mm is utilized with standard 10mm mortar beddings.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "paint" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Liters Needed</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculatePaint().litersNeeded} <span className="text-xs text-slate-300">L</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Using average 10m² per liter efficiency metrics.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Gallon Cans Equivalent</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculatePaint().gallonsNeeded} <span className="text-xs text-slate-400">Gal</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Standard 3.78L gallons containers.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tiles" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Total Tiles to Purchase</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateTiles().tilesNeeded} <span className="text-xs text-slate-300">Tiles</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Includes user-defined waste buffers.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Tile Adhesive Cement</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateTiles().cementBags} <span className="text-xs text-slate-400">Bags</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">For screed beddings and standard grouts.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "steel" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Weight Per Meter</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateSteel().weightPerMeter} <span className="text-xs text-slate-400">kg/m</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Rebar structural density constant.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Total Weight</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateSteel().totalWeightKg} <span className="text-xs text-slate-300">kg</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Sum of total specified lengths.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Tonnage Load</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateSteel().totalTons} <span className="text-xs text-slate-300">Tons</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Procurement units measurement.</div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <p>
                    <strong>Formula Used:</strong> Weight = (d² / 162.2) kg/meter where d is the diameter in millimeters. This is the international civil engineering standard code for steel reinforcing bars.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "beam" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Max Bending Moment</div>
                    <div className="text-2xl font-bold text-amber-500 font-mono">{calculateBeam().maxMoment} <span className="text-xs text-slate-300">kNm</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Occurs at mid-span under UDL.</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Max Bending Stress</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateBeam().maxStress} <span className="text-xs text-slate-400">MPa</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Compare to concrete grade limit (M20 ~ 20MPa).</div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Deflection Code Limit</div>
                    <div className="text-2xl font-bold text-slate-200 font-mono">{calculateBeam().limitDeflection} <span className="text-xs text-slate-400">mm</span></div>
                    <div className="text-[10px] text-slate-500 mt-2">Calculated standard L/250 limit.</div>
                  </div>
                </div>

                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-xs text-slate-300 space-y-1">
                  <h4 className="font-semibold text-sky-400">Educational Beam Engineering Insight</h4>
                  <p className="leading-relaxed">
                    This educational beam load calculator models a simply supported rectangular reinforced concrete or steel beam. Maximum stress is computed using <strong>σ = M / Z</strong>. If the maximum bending stress exceeds your concrete grade's tensile/compressive margins, you must increase either beam depth or reinforcement bar ratios!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "converter" && (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400 mb-2">Converts to:</div>
                <div className="text-3xl font-bold text-amber-500 font-display font-mono">
                  {handleConversion()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
