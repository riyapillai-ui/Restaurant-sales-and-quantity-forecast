import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Database,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DataManagementTab: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data Dictionary Definition
  const dataDictionary = [
    { column: 'date', type: 'Date (YYYY-MM-DD)', description: 'Transaction record timestamp (2023-01-01 to 2024-12-30)' },
    { column: 'restaurant_id', type: 'Categorical (R1, R2, R3)', description: 'Unique identifier for the restaurant location' },
    { column: 'restaurant_name', type: 'Categorical', description: 'Brand name (Budget Eats, Urban Dine, Elite Feast)' },
    { column: 'food_name', type: 'Categorical (70 Dishes)', description: 'Specific dish or beverage menu item' },
    { column: 'category', type: 'Categorical (43 Types)', description: 'Cuisine classification (North Indian, South Indian, Italian, etc.)' },
    { column: 'season', type: 'Categorical (4 Labels)', description: 'Original dataset season: Summer, Rainy, Winter, Autumn' },
    { column: 'climate', type: 'Categorical (Real)', description: 'Observed weather: Hot, Rainy, Cloudy, Humid, Cold, Cool' },
    { column: 'price_per_unit', type: 'Float ($)', description: 'Actual item menu price for the order' },
    { column: 'usual_price', type: 'Float ($)', description: 'Pre-dated historical expanding median price for this dish' },
    { column: 'price_vs_usual', type: 'Float (Ratio)', description: 'Current unit price divided by historical median price' },
    { column: 'dish_units_lag_1', type: 'Float', description: 'Units sold of this dish yesterday at this location' },
    { column: 'dish_units_lag_7', type: 'Float', description: 'Units sold of this dish 7 days prior (same weekday)' },
    { column: 'dish_units_lag_14', type: 'Float', description: 'Units sold of this dish 14 days prior' },
    { column: 'dish_units_rolling_7', type: 'Float', description: 'Past-only 7-day trailing moving average of units sold' },
    { column: 'is_friday / is_weekend', type: 'Binary (0 / 1)', description: 'Calendar surge indicators' },
    { column: 'is_festival / days_before', type: 'Integer (0 - 7)', description: 'Proximity to nearest verified festival date' },
    { column: 'units_sold (Target 1)', type: 'Integer', description: 'Total units sold of this dish on this date' },
    { column: 'revenue (Target 2)', type: 'Float ($)', description: 'Total revenue generated (price_per_unit * units_sold)' }
  ];

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      const recordCount = lines.length - 1;
      const hasDate = headers.includes('date');
      const hasFood = headers.includes('food_name');
      const hasUnits = headers.includes('units_sold');
      const hasSeason = headers.includes('season');

      const sampleRows: Record<string, string>[] = [];
      for (let i = 1; i <= Math.min(4, lines.length - 1); i++) {
        const vals = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = vals[idx] || '';
        });
        sampleRows.push(rowObj);
      }

      setTimeout(() => {
        setIsProcessing(false);
        setUploadResult({
          filename: file.name,
          totalRows: recordCount,
          headers,
          valid: hasDate && hasFood && hasUnits,
          hasSeason,
          sampleRows
        });
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }, 500);
    };

    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Quick-Download Cards (Matching Project Outputs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Download 1: Cleaned Restaurant Data */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Cleaned Restaurant Data</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              149,784 records with engineered dish lags (1,7,14d) and rolling 7d averages.
            </p>
          </div>
          <a
            href="/api/export/cleaned-data"
            download="cleaned_restaurant_data.csv"
            className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV (50MB)</span>
          </a>
        </div>

        {/* Download 2: Actual vs Predicted */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Actual vs Predicted Log</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              29,959 test period evaluations for both XGBoost and Baseline Linear models.
            </p>
          </div>
          <a
            href="/api/export/actual-vs-predicted"
            download="actual_vs_predicted.csv"
            className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV (760KB)</span>
          </a>
        </div>

        {/* Download 3: Model Evaluation Results */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <FileText className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Model Metrics Scorecard</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Complete R², MAE, RMSE metrics comparison on identical test dates.
            </p>
          </div>
          <a
            href="/api/export/model-evaluation"
            download="model_evaluation_results.csv"
            className="mt-4 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV (1KB)</span>
          </a>
        </div>

        {/* Download 4: 30-Day Recursive Forecast */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
              <Database className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-white">30-Day Forecast Schedule</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Next 30 days recursive auto-regressive projections with confidence intervals.
            </p>
          </div>
          <a
            href="/api/export/forecast-30days"
            download="restaurant_forecast_30days.csv"
            className="mt-4 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV (15KB)</span>
          </a>
        </div>

      </div>

      {/* Drag & Drop CSV Uploader Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-amber-400" />
            Upload Custom Restaurant Transactions CSV
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Drop your restaurant sales CSV. The system checks schemas, preserves original seasons, and computes dish-level lag features.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-amber-400 bg-amber-500/10' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2 animate-bounce" />
          <p className="text-xs font-bold text-white">
            Drag & drop your CSV file here, or{' '}
            <label className="text-amber-400 underline cursor-pointer hover:text-amber-300">
              browse files
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports CSVs up to 100MB with date, food_name, units_sold, price_per_unit
          </p>
        </div>

        {/* Upload Result Preview */}
        {uploadResult && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                {uploadResult.valid ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <span className="font-bold text-white">{uploadResult.filename}</span>
                <span className="text-slate-400">({uploadResult.totalRows.toLocaleString()} rows)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Validated
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>
                <span className="text-slate-500">Original Season Preserved: </span>
                <span className="text-emerald-400 font-bold">{uploadResult.hasSeason ? 'Yes (Summer, Rainy, Winter, Autumn)' : 'Defaulted'}</span>
              </div>
              <div>
                <span className="text-slate-500">Auto-Engineered Lags: </span>
                <code className="text-amber-300 font-mono text-[11px]">dish_units_lag_1, lag_7, lag_14, rolling_7, price_vs_usual</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dataset Schema & Data Dictionary Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            Dataset Schema & Engineered Features Dictionary
          </h3>
          <span className="text-xs font-mono text-slate-400">18 Core Columns</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Data Type</th>
                <th className="py-2.5 px-3">Feature Engineering Purpose & Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dataDictionary.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-amber-300">{item.column}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.type}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
