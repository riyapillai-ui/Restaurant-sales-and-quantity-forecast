import React from 'react';
import { Store, UtensilsCrossed, SunMedium, Search, RotateCcw } from 'lucide-react';
import { RESTAURANTS, CATEGORY_SUMMARY, SEASON_STATS } from '../data/restaurantDataset.ts';

interface FilterBarProps {
  selectedRestaurant: string;
  setSelectedRestaurant: (r: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedSeason: string;
  setSelectedSeason: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRestaurant,
  setSelectedRestaurant,
  selectedCategory,
  setSelectedCategory,
  selectedSeason,
  setSelectedSeason,
  searchQuery,
  setSearchQuery,
  onResetFilters
}) => {
  const currentRestaurant = RESTAURANTS.find(r => r.name === selectedRestaurant);
  const activeFiltersCount = 
    (selectedRestaurant !== 'All' ? 1 : 0) + 
    (selectedCategory !== 'All' ? 1 : 0) + 
    (selectedSeason !== 'All' ? 1 : 0) + 
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Restaurant Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <Store className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium">Unit:</span>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Locations (3 Units)</option>
              {RESTAURANTS.map(r => (
                <option key={r.id} value={r.name} className="bg-slate-900 text-slate-200">
                  {r.name} ({r.locality} Locality - {r.multiplier}x)
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <UtensilsCrossed className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All 43 Categories</option>
              {CATEGORY_SUMMARY.map(c => (
                <option key={c.category} value={c.category} className="bg-slate-900 text-slate-200">
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          {/* Season Filter (Preserves 4 Original Labels) */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <SunMedium className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-slate-400 font-medium">Season:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All 4 Seasons</option>
              {SEASON_STATS.map(s => (
                <option key={s.season} value={s.season} className="bg-slate-900 text-slate-200">
                  {s.season} ({s.share}%)
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}

        </div>

        {/* Search Bar & Multiplier pill */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dish or category..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Multiplier Badge */}
          {currentRestaurant && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              <span>Multiplier:</span>
              <span className="font-bold">{currentRestaurant.multiplier}x</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
