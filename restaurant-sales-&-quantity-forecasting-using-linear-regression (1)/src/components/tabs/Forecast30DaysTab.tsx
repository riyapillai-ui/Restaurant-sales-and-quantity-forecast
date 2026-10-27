import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  ChevronRight, 
  Info,
  CalendarCheck,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { FORECAST_30_DAYS, RESTAURANTS } from '../../data/restaurantDataset.ts';

interface Forecast30DaysTabProps {
  selectedRestaurant: string;
  selectedTarget: 'revenue' | 'quantity';
}

export const Forecast30DaysTab: React.FC<Forecast30DaysTabProps> = ({
  selectedRestaurant,
  selectedTarget
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const currentRestaurant = RESTAURANTS.find(r => r.name === selectedRestaurant);
  const multiplier = currentRestaurant ? currentRestaurant.multiplier : 1.0;

  // Apply location multiplier to 30-day forecast
  const forecastData = FORECAST_30_DAYS.map(day => ({
    ...day,
    predictedSales: Math.round(day.predictedSales * multiplier),
    predictedQuantity: Math.round(day.predictedQuantity * (0.8 + multiplier * 0.2)),
    salesLowerBound: Math.round(day.salesLowerBound * multiplier),
    salesUpperBound: Math.round(day.salesUpperBound * multiplier)
  }));

  const totalSales = forecastData.reduce((acc, d) => acc + d.predictedSales, 0);
  const totalQuantity = forecastData.reduce((acc, d) => acc + d.predictedQuantity, 0);
  const avgDailySales = Math.round(totalSales / 30);
  const avgDailyQty = Math.round(totalQuantity / 30);

  const activeDay = forecastData[selectedDayIndex] || forecastData[0];

  const handleDownloadCsv = () => {
    window.location.href = '/api/export/forecast-30days';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Recursive Methodology Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-900/40 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Realistic 30-Day Recursive Forecast (2024-12-31 to 2025-01-29)
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Recursive Auto-Regressive
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Rather than using unavailable future actuals, our multi-step forecast feeds day <em>t</em>'s predictions forward into day <em>t+1</em> lag 1, day <em>t+7</em> lag 7, and trailing 7-day rolling averages. Weekend and month-boundary dynamics are preserved.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Download 30-Day Forecast CSV</span>
          </button>
        </div>
      </div>

      {/* 30-Day Aggregate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total 30-Day Projected Revenue</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            ${(totalSales / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Avg ${avgDailySales.toLocaleString()}/day
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total 30-Day Projected Quantity</span>
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {totalQuantity.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Avg {avgDailyQty.toLocaleString()} units/day
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Forecast Horizon & Range</span>
            <Calendar className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-indigo-300 mt-2 truncate">
            Dec 31 → Jan 29
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            30 Days • Daily Resolution
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Unit Filter</span>
            <Sparkles className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2 truncate">
            {selectedRestaurant === 'All' ? 'All Multi-Unit (1.0x)' : selectedRestaurant}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">
            {multiplier}x capacity factor applied
          </div>
        </div>

      </div>

      {/* 30-Day Forecast Trajectory Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Day-by-Day Forecast Curve with Uncertainty Bounds
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice the cyclical surges on Fridays and Saturdays as well as the month-end demand lift.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Projected {selectedTarget === 'revenue' ? 'Sales ($)' : 'Qty (Units)'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-700" /> 88% - 114% Bounds
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => val.slice(5)} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                tickFormatter={(val) => selectedTarget === 'revenue' ? `$${(val / 1000).toFixed(0)}k` : `${val}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(_val, _name, item: any) => [
                  selectedTarget === 'revenue' 
                    ? `$${item.payload.predictedSales.toLocaleString()} (Bounds: $${item.payload.salesLowerBound.toLocaleString()} - $${item.payload.salesUpperBound.toLocaleString()})`
                    : `${item.payload.predictedQuantity} units`,
                  selectedTarget === 'revenue' ? 'Forecast Revenue' : 'Forecast Quantity'
                ]}
                labelFormatter={(label, items) => `${label} (${items?.[0]?.payload?.weekday})`}
              />
              <Area 
                type="monotone" 
                dataKey={selectedTarget === 'revenue' ? 'predictedSales' : 'predictedQuantity'} 
                stroke={selectedTarget === 'revenue' ? '#f59e0b' : '#10b981'} 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#forecastGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Day Selector Table & Top Dishes for Selected Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 30-Day Table */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              Day-by-Day Forecast Schedule (Click Day to Inspect Dishes)
            </h3>
            <span className="text-xs font-mono text-slate-400">30 Rows</span>
          </div>

          <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weekday</th>
                  <th className="py-2.5 px-3 text-right">Projected Sales</th>
                  <th className="py-2.5 px-3 text-right">Units</th>
                  <th className="py-2.5 px-3 text-center">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {forecastData.map((d, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <tr
                      key={d.dayNumber}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-500/10 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-amber-400">#{d.dayNumber}</td>
                      <td className="py-2 px-3 text-slate-300">{d.date}</td>
                      <td className="py-2 px-3">{d.weekday}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-400">
                        ${d.predictedSales.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-200">
                        {d.predictedQuantity}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {d.isWeekend && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Wkd
                            </span>
                          )}
                          {d.isFriday && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Fri
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Top Dishes for Selected Day */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">
                Day #{activeDay.dayNumber} Detail
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeDay.date} ({activeDay.weekday})
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Top Demand Menu Items
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              High-velocity dishes recommended for prep & raw ingredient ordering
            </p>
          </div>

          <div className="space-y-2.5">
            {activeDay.topDishes.map((dish, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{dish.foodName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {dish.restaurantName} • ${dish.price}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">${dish.sales.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{dish.quantity} units</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300">Staffing & Procurement Tip</span>
            <p>
              Expected volume on {activeDay.weekday} is {activeDay.isWeekend ? '28% higher than midweek' : 'standard weekday baseline'}. Align kitchen stations for top 3 appetizers and beverages.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
