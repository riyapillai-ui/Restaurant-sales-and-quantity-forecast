import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ArrowUpRight, 
  TrendingDown, 
  Target, 
  GitCommit, 
  Info, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Line
} from 'recharts';
import { 
  MODEL_METRICS, 
  ACTUAL_VS_PREDICTED, 
  OVERVIEW_STATS 
} from '../../data/restaurantDataset.ts';

interface ModelComparisonTabProps {
  selectedTarget: 'revenue' | 'quantity';
  selectedModel: 'xgboost' | 'linear';
}

export const ModelComparisonTab: React.FC<ModelComparisonTabProps> = ({
  selectedTarget,
  selectedModel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter metrics for the selected target
  const linearMetric = MODEL_METRICS.find(m => m.target === selectedTarget && m.model.includes('Linear'))!;
  const xgbMetric = MODEL_METRICS.find(m => m.target === selectedTarget && m.model.includes('XGBoost'))!;

  // Prepare scatter data for actual vs predicted
  const scatterData = ACTUAL_VS_PREDICTED.map(item => {
    const actual = selectedTarget === 'revenue' ? item.actualRevenue : item.actualQuantity;
    const predictedXGB = selectedTarget === 'revenue' ? item.predictedRevenueXGB : item.predictedQuantityXGB;
    const predictedLinear = selectedTarget === 'revenue' ? item.predictedRevenueLinear : item.predictedQuantityLinear;

    return {
      name: item.foodName,
      restaurant: item.restaurantName,
      price: item.pricePerUnit,
      actual,
      predicted: selectedModel === 'xgboost' ? predictedXGB : predictedLinear,
      predictedXGB,
      predictedLinear,
      errorPct: Math.abs(((selectedModel === 'xgboost' ? predictedXGB : predictedLinear) - actual) / actual * 100).toFixed(1)
    };
  });

  // 45-degree reference line min/max
  const maxVal = Math.max(...scatterData.map(d => Math.max(d.actual, d.predicted)));
  const minVal = 0;

  // Filter comparison table
  const filteredRows = ACTUAL_VS_PREDICTED.filter(r => {
    const matchesSearch = 
      r.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRestaurant = restaurantFilter === 'All' || r.restaurantName === restaurantFilter;
    return matchesSearch && matchesRestaurant;
  });

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Chronological Zero-Leakage Split Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <GitCommit className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Chronological Train / Test Split Protocol
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero Future Leakage
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                To prevent data leakage in time-series forecasting, all data is partitioned chronologically by date. All dish-level lags (1, 7, 14 days), rolling averages, and price comparisons use strictly past-dated records. Both Linear Regression and XGBoost are tested on <strong>identical test dates</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Train: </span>
              <span className="text-white font-bold">{OVERVIEW_STATS.trainDateRange}</span>
              <div className="text-[10px] text-slate-500">{OVERVIEW_STATS.trainRecords.toLocaleString()} rows (80%)</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-indigo-800/40">
              <span className="text-slate-400">Test: </span>
              <span className="text-indigo-300 font-bold">{OVERVIEW_STATS.testDateRange}</span>
              <div className="text-[10px] text-slate-500">{OVERVIEW_STATS.testRecords.toLocaleString()} rows (20%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Baseline: Linear Regression Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          selectedModel === 'linear' 
            ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs">
                LR
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Linear Regression (Baseline)</h4>
                <p className="text-[11px] text-slate-400">Original benchmark model on {selectedTarget} target</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Baseline
            </span>
          </div>

          {/* Metric Scorecards */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">R² Score</span>
              <div className="text-xl font-extrabold text-white font-mono mt-1">
                {linearMetric.r2Score.toFixed(4)}
              </div>
              <span className="text-[10px] text-slate-500">Variance explained</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">MAE (Mean Error)</span>
              <div className="text-xl font-extrabold text-slate-300 font-mono mt-1">
                {selectedTarget === 'revenue' ? `$${linearMetric.mae.toFixed(0)}` : `${linearMetric.mae.toFixed(1)} u`}
              </div>
              <span className="text-[10px] text-slate-500">Avg absolute error</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">RMSE</span>
              <div className="text-xl font-extrabold text-slate-300 font-mono mt-1">
                {selectedTarget === 'revenue' ? `$${linearMetric.rmse.toFixed(0)}` : `${linearMetric.rmse.toFixed(1)} u`}
              </div>
              <span className="text-[10px] text-slate-500">Root mean squared</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>Linear Regression Constraints</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Struggles with heavy right-tail demand spikes and non-linear feature interactions (such as price elasticity vs. dish popularity).
            </p>
          </div>
        </div>

        {/* Advanced: XGBoost with Log-Target & Clipping */}
        <div className={`p-5 rounded-2xl border transition-all ${
          selectedModel === 'xgboost' 
            ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                XGB
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  XGBoost Regressor
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Log1p + Capped
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">Engineered dish lags (1,7,14d), rolling avgs & price elasticity</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Recommended
            </span>
          </div>

          {/* Metric Scorecards */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/50">
              <span className="text-[11px] text-slate-400 font-medium">R² Score</span>
              <div className="text-xl font-extrabold text-indigo-300 font-mono mt-1">
                {xgbMetric.r2Score.toFixed(4)}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3 w-3" />
                +{xgbMetric.r2ImprovementPct}% boost
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/50">
              <span className="text-[11px] text-slate-400 font-medium">MAE (Mean Error)</span>
              <div className="text-xl font-extrabold text-emerald-300 font-mono mt-1">
                {selectedTarget === 'revenue' ? `$${xgbMetric.mae.toFixed(0)}` : `${xgbMetric.mae.toFixed(1)} u`}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <TrendingDown className="h-3 w-3" />
                -{xgbMetric.maeReductionPct}% error
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/50">
              <span className="text-[11px] text-slate-400 font-medium">RMSE</span>
              <div className="text-xl font-extrabold text-emerald-300 font-mono mt-1">
                {selectedTarget === 'revenue' ? `$${xgbMetric.rmse.toFixed(0)}` : `${xgbMetric.rmse.toFixed(1)} u`}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <TrendingDown className="h-3 w-3" />
                -{xgbMetric.rmseReductionPct}% error
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Why XGBoost Delivers Genuine Accuracy Gains</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Target variables transformed with <code className="text-indigo-300 font-mono">log1p(y)</code> to handle skewness, capped at 99.5th percentile, and non-negative clipped. Gradient trees capture price-demand interactions cleanly.
            </p>
          </div>
        </div>

      </div>

      {/* Actual vs Predicted Interactive Scatter Plot */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Actual vs. Predicted Scatter Plot ({selectedModel === 'xgboost' ? 'XGBoost' : 'Linear Regression'})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Red dashed line indicates theoretical perfect prediction (Actual = Predicted). Points closer to the diagonal represent superior model fit.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Test Data Point
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-0.5 w-3 bg-rose-400" /> Perfect Line (y = x)
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis 
                type="number" 
                dataKey="actual" 
                name="Actual" 
                stroke="#94a3b8" 
                fontSize={10}
                domain={[0, maxVal * 1.05]}
                tickFormatter={(val) => selectedTarget === 'revenue' ? `$${(val / 1000).toFixed(0)}k` : `${val}`}
                label={{ value: `Actual ${selectedTarget === 'revenue' ? 'Revenue ($)' : 'Quantity (Units)'}`, position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="predicted" 
                name="Predicted" 
                stroke="#94a3b8" 
                fontSize={10}
                domain={[0, maxVal * 1.05]}
                tickFormatter={(val) => selectedTarget === 'revenue' ? `$${(val / 1000).toFixed(0)}k` : `${val}`}
                label={{ value: `Predicted ${selectedTarget === 'revenue' ? 'Revenue ($)' : 'Quantity (Units)'}`, angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="text-slate-400 font-mono">{data.restaurant} • Menu: ${data.price}</div>
                        <div className="pt-1 border-t border-slate-800 flex justify-between gap-4">
                          <span className="text-slate-400">Actual:</span>
                          <span className="font-mono text-white font-bold">
                            {selectedTarget === 'revenue' ? `$${data.actual.toLocaleString()}` : `${data.actual} units`}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Predicted ({selectedModel}):</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {selectedTarget === 'revenue' ? `$${data.predicted.toLocaleString()}` : `${data.predicted} units`}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 text-[11px]">
                          <span className="text-slate-400">Relative Delta:</span>
                          <span className="font-mono text-amber-300 font-medium">±{data.errorPct}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Predictions" 
                data={scatterData} 
                fill={selectedModel === 'xgboost' ? '#10b981' : '#f59e0b'} 
                fillOpacity={0.7} 
              />
              {/* 45-degree diagonal reference */}
              <Line 
                data={[{ actual: 0, predicted: 0 }, { actual: maxVal, predicted: maxVal }]} 
                dataKey="predicted" 
                stroke="#f43f5e" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                dot={false} 
                activeDot={false} 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actual vs Predicted Detailed Comparison Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              Test Set Prediction Audit Log ({OVERVIEW_STATS.testDateRange})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecting actual transactions vs. model predictions on held-out chronological test dates.
            </p>
          </div>

          {/* Search & Location Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search food item..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <select
              value={restaurantFilter}
              onChange={(e) => { setRestaurantFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Elite Feast">Elite Feast</option>
              <option value="Urban Dine">Urban Dine</option>
              <option value="Budget Eats">Budget Eats</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Dish Name</th>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Restaurant</th>
                <th className="py-3 px-3.5 text-right">Price</th>
                <th className="py-3 px-3.5 text-right">Actual {selectedTarget === 'revenue' ? 'Rev' : 'Qty'}</th>
                <th className="py-3 px-3.5 text-right text-indigo-400">XGBoost Pred</th>
                <th className="py-3 px-3.5 text-right text-amber-400">Linear Pred</th>
                <th className="py-3 px-3.5 text-right">Residual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedRows.map((row) => {
                const actual = selectedTarget === 'revenue' ? row.actualRevenue : row.actualQuantity;
                const predXgb = selectedTarget === 'revenue' ? row.predictedRevenueXGB : row.predictedQuantityXGB;
                const predLinear = selectedTarget === 'revenue' ? row.predictedRevenueLinear : row.predictedQuantityLinear;
                const residual = predXgb - actual;
                const isPositive = residual >= 0;

                return (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3.5 text-slate-400">{row.date}</td>
                    <td className="py-2.5 px-3.5 font-sans font-semibold text-white">{row.foodName}</td>
                    <td className="py-2.5 px-3.5 font-sans text-slate-400">{row.category}</td>
                    <td className="py-2.5 px-3.5 font-sans text-slate-300">{row.restaurantName}</td>
                    <td className="py-2.5 px-3.5 text-right text-slate-300">${row.pricePerUnit.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-right text-white font-bold">
                      {selectedTarget === 'revenue' ? `$${actual.toLocaleString()}` : `${actual}`}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-emerald-400 font-bold">
                      {selectedTarget === 'revenue' ? `$${predXgb.toLocaleString()}` : `${predXgb}`}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-amber-400/90">
                      {selectedTarget === 'revenue' ? `$${predLinear.toLocaleString()}` : `${predLinear}`}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        Math.abs(residual / actual) < 0.25 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isPositive ? '+' : ''}{selectedTarget === 'revenue' ? `$${residual.toFixed(0)}` : `${residual}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing {paginatedRows.length} of {filteredRows.length} test records</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              Previous
            </button>
            <span className="font-mono text-slate-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
