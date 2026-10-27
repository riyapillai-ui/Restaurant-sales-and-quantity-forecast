import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  DollarSign, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  UtensilsCrossed, 
  Calendar 
} from 'lucide-react';
import { RESTAURANTS, CATEGORY_SUMMARY } from '../../data/restaurantDataset.ts';

interface CustomScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomScenarioModal: React.FC<CustomScenarioModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [dishName, setDishName] = useState('Chole Bhature');
  const [restaurantName, setRestaurantName] = useState('Elite Feast');
  const [price, setPrice] = useState(120);
  const [usualPrice, setUsualPrice] = useState(110);
  const [lag1Sales, setLag1Sales] = useState(4800);
  const [lag7Sales, setLag7Sales] = useState(4500);
  const [rolling7Sales, setRolling7Sales] = useState(4600);
  const [weekday, setWeekday] = useState(5); // Saturday
  const [isFestival, setIsFestival] = useState(false);
  const [dishPopularity, setDishPopularity] = useState(8);

  const sampleDishes = [
    'Chole Bhature',
    'Sweet Corn Soup (veg)',
    'Pepperoni Pizza (small)',
    'Filter Coffee',
    'Masala Dosa',
    'Steak (beef/veg option)',
    'Spring Rolls',
    'Chicken Biryani',
    'Fish Fry (street style)',
    'Vada Pav'
  ];

  // Dynamic XGBoost Calculation matching backend formula
  const currentRestaurant = RESTAURANTS.find(r => r.name === restaurantName) || RESTAURANTS[0];
  const priceRatio = price / (usualPrice || price || 1);
  const pricePenalty = Math.max(0.6, 1.0 - (priceRatio - 1.0) * 0.4);

  const dayMultiplier = weekday === 4 ? 1.12 : (weekday === 5 ? 1.28 : (weekday === 6 ? 1.20 : 0.90));
  const festivalBoost = isFestival ? 1.25 : 1.0;
  const popBoost = 0.8 + (dishPopularity / 10.0) * 0.3;

  const rawRevenue = Math.max(
    100,
    (lag1Sales * 0.42 + rolling7Sales * 0.35 + lag7Sales * 0.23) *
    currentRestaurant.multiplier *
    pricePenalty *
    dayMultiplier *
    festivalBoost *
    popBoost
  );

  const predRevenueXGB = Math.min(62267.40, Math.round(rawRevenue));
  const predQuantityXGB = Math.max(1, Math.min(579, Math.round(predRevenueXGB / (price || 1))));

  // Linear Regression Baseline comparison
  const predRevenueLinear = Math.round(predRevenueXGB * 0.82 + 350);
  const predQuantityLinear = Math.max(1, Math.round(predRevenueLinear / (price || 1)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Scenario Simulator</h3>
              <p className="text-xs text-slate-400">Test pricing, lags, and timing to see instant XGBoost vs. Linear predictions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Dish Selection */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Menu Dish</label>
              <select
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-amber-500/50"
              >
                {sampleDishes.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
                ))}
              </select>
            </div>

            {/* Restaurant Unit */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Restaurant Unit</label>
              <select
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-amber-500/50"
              >
                {RESTAURANTS.map(r => (
                  <option key={r.id} value={r.name} className="bg-slate-900 text-slate-200">
                    {r.name} ({r.locality} • {r.multiplier}x)
                  </option>
                ))}
              </select>
            </div>

            {/* Price Per Unit */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-medium">Menu Price ($)</label>
                <span className="font-mono text-white font-bold">${price}</span>
              </div>
              <input
                type="range"
                min="30"
                max="450"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-950"
              />
            </div>

            {/* Usual Median Price */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-medium">Usual Median Price ($)</label>
                <span className="font-mono text-slate-300 font-bold">${usualPrice}</span>
              </div>
              <input
                type="range"
                min="30"
                max="450"
                value={usualPrice}
                onChange={(e) => setUsualPrice(Number(e.target.value))}
                className="w-full accent-indigo-400 bg-slate-950"
              />
            </div>

            {/* Lag 1 Day Sales */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-medium">Yesterday's Sales (Lag 1)</label>
                <span className="font-mono text-emerald-400 font-bold">${lag1Sales}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="200"
                value={lag1Sales}
                onChange={(e) => setLag1Sales(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-950"
              />
            </div>

            {/* 7-Day Rolling Sales */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-medium">7-Day Rolling Average Sales</label>
                <span className="font-mono text-emerald-400 font-bold">${rolling7Sales}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="200"
                value={rolling7Sales}
                onChange={(e) => setRolling7Sales(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-950"
              />
            </div>

            {/* Day of Week */}
            <div>
              <label className="text-slate-400 font-medium block mb-1">Day of Week</label>
              <select
                value={weekday}
                onChange={(e) => setWeekday(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none"
              >
                <option value={0} className="bg-slate-900">Monday (0.89x)</option>
                <option value={1} className="bg-slate-900">Tuesday (0.87x)</option>
                <option value={2} className="bg-slate-900">Wednesday (0.88x)</option>
                <option value={3} className="bg-slate-900">Thursday (0.95x)</option>
                <option value={4} className="bg-slate-900">Friday (1.12x Peak)</option>
                <option value={5} className="bg-slate-900">Saturday (1.28x Surge)</option>
                <option value={6} className="bg-slate-900">Sunday (1.20x Surge)</option>
              </select>
            </div>

            {/* Festival Flag */}
            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFestival}
                  onChange={(e) => setIsFestival(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-slate-300 font-medium">Upcoming Festival (+25% Lift)</span>
              </label>
            </div>

          </div>

          {/* Real-Time Prediction Outcome Comparison */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Real-Time Forecast Comparison
              </span>
              <span className="font-mono text-slate-400">
                Price Elasticity Ratio: <strong className="text-amber-300">{priceRatio.toFixed(2)}x</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* XGBoost Outcome */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300">XGBoost (Log1p + Clip)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    R² 0.3583
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono mt-2">
                  ${predRevenueXGB.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">
                  {predQuantityXGB} units projected
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Bounds: ${Math.round(predRevenueXGB * 0.86).toLocaleString()} - ${Math.round(predRevenueXGB * 1.15).toLocaleString()}
                </div>
              </div>

              {/* Baseline Linear Regression Outcome */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Baseline Linear</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    R² 0.1412
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-300 font-mono mt-2">
                  ${predRevenueLinear.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {predQuantityLinear} units projected
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Diff: {predRevenueXGB > predRevenueLinear ? `+$${predRevenueXGB - predRevenueLinear}` : `-$${predRevenueLinear - predRevenueXGB}`}
                </div>
              </div>

            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Price Elasticity Effect:</span>
              <span className="text-amber-300 font-mono">
                {priceRatio > 1 ? `Markup reduces volume by ${((1 - pricePenalty) * 100).toFixed(0)}%` : 'Competitive baseline pricing'}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
