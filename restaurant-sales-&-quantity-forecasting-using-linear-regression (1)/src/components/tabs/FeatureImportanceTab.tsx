import React, { useState } from 'react';
import { 
  Layers, 
  HelpCircle, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { FEATURE_IMPORTANCES, OVERVIEW_STATS } from '../../data/restaurantDataset.ts';

export const FeatureImportanceTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Lags & Momentum',
    'Price Dynamics',
    'Location & Capacity',
    'Temporal & Calendar',
    'Dish Attributes',
    'Events & Climate'
  ];

  const filteredFeatures = selectedCategory === 'All'
    ? FEATURE_IMPORTANCES
    : FEATURE_IMPORTANCES.filter(f => f.category === selectedCategory);

  // Category color mapper
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Lags & Momentum': return '#6366f1'; // Indigo
      case 'Price Dynamics': return '#f59e0b'; // Amber
      case 'Location & Capacity': return '#10b981'; // Emerald
      case 'Temporal & Calendar': return '#ec4899'; // Pink
      case 'Dish Attributes': return '#3b82f6'; // Blue
      case 'Events & Climate': return '#f43f5e'; // Rose
      default: return '#8b5cf6';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pipeline & Methodology Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                XGBoost Feature Importance & Pipeline Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Engineered predictors ranked by feature split gain and information contribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              Target: <code className="text-indigo-400 font-bold">log1p(y)</code>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              Cap 99.5%: <code className="text-amber-400 font-bold">${OVERVIEW_STATS.revenueCap995.toLocaleString()}</code>
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 mr-1 font-medium">Filter Domain:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Importance Horizontal Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">
              Relative Feature Importance Weight (%)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Prior-day dish sales (<code className="text-indigo-300 font-mono">dish_revenue_lag_1</code>) and pricing elasticity (<code className="text-amber-300 font-mono">price_vs_usual</code>) drive over 40% of model weight.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredFeatures.length} Features
          </span>
        </div>

        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={filteredFeatures} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                unit="%"
                domain={[0, 25]}
              />
              <YAxis 
                type="category" 
                dataKey="label" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                width={170}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(_val, _name, item: any) => [
                  `${item.payload.importance}% (Category: ${item.payload.category})`,
                  'Importance Gain'
                ]}
                labelFormatter={(_label, items) => items?.[0]?.payload?.description || ''}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {filteredFeatures.map((entry) => (
                  <Cell key={entry.feature} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Architectural Explanations of All Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Dish-Level Lags */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Clock className="h-4 w-4" />
            <span>Dish-Level Lags (1, 7, 14 Days)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Computed per dish and restaurant location. Lag 1 captures immediate day-to-day momentum; lag 7 captures weekly cadence; lag 14 provides bi-weekly baseline stability without leakage.
          </p>
        </div>

        {/* Card 2: Past-Only Rolling Averages */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sliders className="h-4 w-4" />
            <span>Past-Only 7-Day Rolling Averages</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculated strictly over trailing windows <code className="font-mono text-amber-300">shift(1).rolling(7)</code> so today’s values never contaminate the training buffer.
          </p>
        </div>

        {/* Card 3: Historical Price Comparisons */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <DollarSign className="h-4 w-4" />
            <span>Price vs. Historical Median</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code className="font-mono text-emerald-300">price_vs_usual</code> evaluates current price against the dish’s pre-dated historical median. Detects promotions and elasticity.
          </p>
        </div>

        {/* Card 4: Friday & Calendar Flags */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
            <Calendar className="h-4 w-4" />
            <span>Friday, Weekend & Month Cadence</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code className="font-mono text-pink-300">is_friday</code>, <code className="font-mono text-pink-300">is_weekend</code>, <code className="font-mono text-pink-300">is_month_start</code>, and <code className="font-mono text-pink-300">is_month_end</code> isolate recurring payday and entertainment peaks.
          </p>
        </div>

        {/* Card 5: Festival Proximity & Climate */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>Festival Proximity & Weather</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Distances <code className="font-mono text-rose-300">days_before_festival</code> use verified dataset dates only (no invented calendar). Weather interacts via <code className="font-mono text-rose-300">climate_item_type</code>.
          </p>
        </div>

        {/* Card 6: Log1p & Outlier Capping */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Log1p Target & 99.5% Outlier Cap</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Training revenue is capped at $62,267.40 and quantity at 579 units. Targets are log-transformed; predictions are inverted with <code className="font-mono text-blue-300">expm1</code> and non-negative clipped.
          </p>
        </div>

      </div>

    </div>
  );
};
