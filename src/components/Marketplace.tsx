import React, { useState } from "react";
import { Search, ShoppingBag, Download, Star, Filter, Tag, CheckCircle } from "lucide-react";
import { MARKETPLACE_ITEMS } from "../data";
import { MarketplaceItem } from "../types";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  const categories = ["All", "House Plans", "BOQ Templates", "CAD Blocks", "BIM Components"];

  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "All" || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleBuy = (id: string) => {
    setPurchasedIds([...purchasedIds, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold font-display text-amber-500 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Professional Engineering Marketplace
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Procure peer-reviewed residential house plans, certified structural detailing spreadsheets, BIM files, and custom BOQ blueprints.
        </p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            placeholder="Search templates, CAD components, calculations sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isPurchased = purchasedIds.includes(item.id);
          return (
            <div key={item.id} className="glass-panel rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all flex flex-col group">
              {/* Product Thumbnail */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                <span className="absolute top-2 left-2 text-[10px] bg-slate-950/80 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/10 uppercase font-mono">
                  {item.category}
                </span>
              </div>

              {/* Contents */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-slate-200 leading-normal line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500" /> {item.rating}
                    </span>
                    <span>•</span>
                    <span>{item.downloads} Downloads</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/60">
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {item.price === 0 ? "Free" : `$${item.price.toFixed(2)}`}
                  </span>

                  {isPurchased ? (
                    <button
                      className="bg-emerald-500/10 text-emerald-400 font-semibold px-3 py-1 rounded-lg text-xs flex items-center gap-1 border border-emerald-500/20"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Acquired
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Procure
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
