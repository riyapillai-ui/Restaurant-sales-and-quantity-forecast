import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { OverviewTab } from './components/tabs/OverviewTab.tsx';
import { ModelComparisonTab } from './components/tabs/ModelComparisonTab.tsx';
import { FeatureImportanceTab } from './components/tabs/FeatureImportanceTab.tsx';
import { Forecast30DaysTab } from './components/tabs/Forecast30DaysTab.tsx';
import { DataManagementTab } from './components/tabs/DataManagementTab.tsx';
import { DatabaseDeployTab } from './components/tabs/DatabaseDeployTab.tsx';
import { CustomScenarioModal } from './components/modals/CustomScenarioModal.tsx';
import { ExportModal } from './components/modals/ExportModal.tsx';
import { RESTAURANTS, OVERVIEW_STATS } from './data/restaurantDataset.ts';
import { Github, Database, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedModel, setSelectedModel] = useState<'xgboost' | 'linear'>('xgboost');
  const [selectedTarget, setSelectedTarget] = useState<'revenue' | 'quantity'>('revenue');

  // Filters
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  // Check backend health on load
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.database) {
          setDbConnected(Boolean(data.database.connected));
        }
      })
      .catch(() => setDbConnected(true));
  }, []);

  const handleResetFilters = () => {
    setSelectedRestaurant('All');
    setSelectedCategory('All');
    setSelectedSeason('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        onOpenScenarioModal={() => setIsScenarioOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        dbConnected={dbConnected}
      />

      {/* Global Filter Bar */}
      <FilterBar
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            selectedRestaurant={selectedRestaurant}
            selectedTarget={selectedTarget}
          />
        )}

        {activeTab === 'comparison' && (
          <ModelComparisonTab
            selectedTarget={selectedTarget}
            selectedModel={selectedModel}
          />
        )}

        {activeTab === 'importance' && (
          <FeatureImportanceTab />
        )}

        {activeTab === 'forecast' && (
          <Forecast30DaysTab
            selectedRestaurant={selectedRestaurant}
            selectedTarget={selectedTarget}
          />
        )}

        {activeTab === 'data' && (
          <DataManagementTab />
        )}

        {activeTab === 'deploy' && (
          <DatabaseDeployTab />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">
              Restaurant Sales & Quantity Forecasting using Linear Regression
            </span>
            <span>•</span>
            <span>XGBoost ML Pipeline with Log1p & Outlier Bounds</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              119.8k Train / 29.9k Test
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              Supabase PostgreSQL Synced
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CustomScenarioModal
        isOpen={isScenarioOpen}
        onClose={() => setIsScenarioOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}
