import React from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  Layers, 
  Database, 
  UploadCloud, 
  SlidersHorizontal,
  Download,
  Calendar,
  Sparkles,
  Server
} from 'lucide-react';

export type ActiveTab = 'overview' | 'comparison' | 'importance' | 'forecast' | 'data' | 'deploy';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedModel: 'xgboost' | 'linear';
  setSelectedModel: (m: 'xgboost' | 'linear') => void;
  selectedTarget: 'revenue' | 'quantity';
  setSelectedTarget: (t: 'revenue' | 'quantity') => void;
  onOpenScenarioModal: () => void;
  onOpenExportModal: () => void;
  dbConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  selectedTarget,
  setSelectedTarget,
  onOpenScenarioModal,
  onOpenExportModal,
  dbConnected
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
    { id: 'comparison', label: 'Model Evaluation', icon: BrainCircuit, badge: 'R² +153%' },
    { id: 'importance', label: 'Feature Importance', icon: Layers },
    { id: 'forecast', label: '30-Day Forecast', icon: Calendar, badge: 'Recursive' },
    { id: 'data', label: 'CSV & Data', icon: UploadCloud },
    { id: 'deploy', label: 'Database & Render', icon: Server, badge: 'FastAPI' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner with App Branding & Primary Toggles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold text-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Restaurant Sales & Quantity Forecasting
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Linear vs. XGBoost
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-unit forecasting engine with 149k+ transactions, dish-level lags, and 30-day recursive rollout
              </p>
            </div>
          </div>

          {/* Controls: Model, Target & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Target Toggle: Revenue vs Quantity */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setSelectedTarget('revenue')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedTarget === 'revenue'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setSelectedTarget('quantity')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedTarget === 'quantity'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quantity (Units)
              </button>
            </div>

            {/* Model Selector: Linear Regression Baseline vs XGBoost */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setSelectedModel('linear')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedModel === 'linear'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Original baseline linear model"
              >
                Baseline Linear
              </button>
              <button
                onClick={() => setSelectedModel('xgboost')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  selectedModel === 'xgboost'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-sm shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Gradient boosted trees with log1p target and clipping"
              >
                <Sparkles className="h-3 w-3 text-amber-300" />
                XGBoost (Log+Clip)
              </button>
            </div>

            {/* Scenario Simulator Button */}
            <button
              onClick={onOpenScenarioModal}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Scenario</span> Simulator
            </button>

            {/* Export CSVs */}
            <button
              onClick={onOpenExportModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Live DB Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono ${
                dbConnected 
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' 
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
              }`}
              title="PostgreSQL / Supabase integration status"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="h-3 w-3" />
              <span className="hidden md:inline">Supabase</span>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isActive 
                        ? 'bg-amber-400/20 text-amber-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
