import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  CalendarDays, 
  Award, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  CloudSun
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  OVERVIEW_STATS, 
  RESTAURANTS, 
  CATEGORY_SUMMARY, 
  MONTHLY_TRENDS, 
  DAY_OF_WEEK_STATS,
  SEASON_STATS
} from '../../data/restaurantDataset.ts';

interface OverviewTabProps {
  selectedRestaurant: string;
  selectedTarget: 'revenue' | 'quantity';
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  selectedRestaurant,
  selectedTarget
}) => {
  const currentRestaurant = RESTAURANTS.find(r => r.name === selectedRestaurant);
  const activeSales = currentRestaurant ? currentRestaurant.totalSales : OVERVIEW_STATS.totalSales;
  const activeQuantity = currentRestaurant ? currentRestaurant.totalQuantity : OVERVIEW_STATS.totalQuantity;

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(2)}`;
  };

  const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  // Top 10 categories for cleaner chart presentation
  const top10Categories = CATEGORY_SUMMARY.slice(0, 10).map(c => ({
    name: c.category.length > 16 ? c.category.substring(0, 15) + '…' : c.category,
    fullName: c.category,
    revenue: Math.round(c.totalSales / 1000000), // in Millions
    quantity: Math.round(c.totalQuantity / 1000), // in Thousands
    avgPrice: c.avgPrice
  }));

  return (
    <div className="space-y-6">
      
      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales KPI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Recorded Revenue
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatCurrency(activeSales)}
            </span>
            {currentRestaurant && (
              <span className="text-xs text-amber-400 font-mono font-medium">
                ({currentRestaurant.multiplier}x tier)
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">Avg ${OVERVIEW_STATS.averageSalesPerRecord.toLocaleString()}/tx</span>
            <span>•</span>
            <span>149k records</span>
          </div>
        </div>

        {/* Total Quantity KPI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Units Sold
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatNumber(activeQuantity)}
            </span>
            <span className="text-xs text-slate-400">units</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">{OVERVIEW_STATS.averageQuantityPerRecord} units/order</span>
            <span>•</span>
            <span>70 menu dishes</span>
          </div>
        </div>

        {/* Machine Learning Model Leap KPI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              XGBoost vs Baseline R²
            </span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono">
              0.3583
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              +153.7%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Baseline Linear: R² 0.1412</span>
            <span>•</span>
            <span className="text-amber-400">33.1% less MAE</span>
          </div>
        </div>

        {/* Peak Demand Day & Top Category */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Top Category & Peak Day
            </span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-white truncate">
              {OVERVIEW_STATS.topCategory}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-amber-300 font-medium">$196.99M sales</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">Saturday Peak (1.27x)</span>
          </div>
        </div>

      </div>

      {/* Main Charts: 24-Month Trend & Top 10 Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 24-Month Trend Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                24-Month Performance History (2023 - 2024)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedTarget === 'revenue' ? 'Monthly Revenue ($M)' : 'Monthly Units Sold (Thousands)'} across recorded period
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              730 Days
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false}
                  tickFormatter={(val) => val.slice(2)}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false}
                  tickFormatter={(val) => selectedTarget === 'revenue' ? `$${(val / 1000000).toFixed(0)}M` : `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [
                    selectedTarget === 'revenue' ? formatCurrency(Number(val)) : `${Number(val).toLocaleString()} units`,
                    selectedTarget === 'revenue' ? 'Sales Revenue' : 'Quantity'
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedTarget === 'revenue' ? 'sales' : 'quantity'} 
                  stroke={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#trendGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Categories Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-400" />
                Category Volume Breakdown (Top 10 of 43)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedTarget === 'revenue' ? 'Total Sales ($ Millions)' : 'Total Quantity Sold (Thousands of units)'}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              #1 North Indian
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Categories} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(val) => selectedTarget === 'revenue' ? `$${val}M` : `${val}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  width={110}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(_val, _name, item: any) => [
                    selectedTarget === 'revenue' ? formatCurrency(item.payload.revenue * 1000000) : `${(item.payload.quantity * 1000).toLocaleString()} units`,
                    selectedTarget === 'revenue' ? 'Total Revenue' : 'Total Quantity'
                  ]}
                  labelFormatter={(_label, items) => items?.[0]?.payload?.fullName || ''}
                />
                <Bar 
                  dataKey={selectedTarget === 'revenue' ? 'revenue' : 'quantity'} 
                  fill={selectedTarget === 'revenue' ? '#f59e0b' : '#6366f1'} 
                  radius={[0, 6, 6, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Secondary Row: Restaurant Multi-Unit Breakdown, Day of Week & Weather Seasonality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Restaurant Locations & Locality Tiers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              Restaurant Units & Localities
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">3 Locations</span>
          </div>
          <p className="text-xs text-slate-400">
            Demand multiplier is encoded into feature space; redundant locality names excluded to prevent leakage.
          </p>

          <div className="space-y-2.5 pt-1">
            {RESTAURANTS.map((r) => {
              const share = ((r.totalSales / OVERVIEW_STATS.totalSales) * 100).toFixed(1);
              return (
                <div key={r.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{r.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {r.id} • {r.locality}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Multiplier: <span className="font-mono text-amber-400 font-semibold">{r.multiplier}x</span> • {share}% revenue share
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-slate-200">{formatCurrency(r.totalSales)}</div>
                    <div className="text-[10px] text-slate-400">{formatNumber(r.totalQuantity)} units</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day of Week Demand Index */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              Day of Week Demand Lift
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Peak: Saturday</span>
          </div>
          <p className="text-xs text-slate-400">
            Engineered flags <code className="text-amber-400 font-mono">is_friday</code> and <code className="text-amber-400 font-mono">is_weekend</code> capture recurring surges.
          </p>

          <div className="space-y-1.5 pt-1">
            {DAY_OF_WEEK_STATS.map((d) => (
              <div key={d.day} className="flex items-center justify-between text-xs">
                <span className={`w-24 ${d.day === 'Saturday' ? 'text-amber-400 font-bold' : (d.day === 'Friday' ? 'text-emerald-400 font-semibold' : 'text-slate-300')}`}>
                  {d.day}
                </span>
                <div className="flex-1 mx-3 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${d.index >= 1.2 ? 'bg-amber-400' : (d.index >= 1.0 ? 'bg-emerald-400' : 'bg-slate-600')}`}
                    style={{ width: `${(d.index / 1.3) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-slate-300 w-12 text-right">
                  {d.index}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Season & Climate Distribution (Preserving Original 4 Seasons) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudSun className="h-4 w-4 text-rose-400" />
              Original Season & Weather
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">4 Labels Preserved</span>
          </div>
          <p className="text-xs text-slate-400">
            Original dataset seasons retained. Weather used strictly when real observations exist (never fabricated).
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {SEASON_STATS.map((s) => (
              <div key={s.season} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{s.season}</span>
                  <span className="text-[10px] font-mono text-rose-400">{s.share}%</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 mt-1">
                  {formatCurrency(s.totalRevenue)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {s.count.toLocaleString()} rows
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
