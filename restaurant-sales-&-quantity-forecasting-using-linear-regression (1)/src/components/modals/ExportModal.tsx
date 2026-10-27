import React from 'react';
import { X, Download, FileSpreadsheet, CheckCircle, FileText, Database } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'cleaned-data',
      title: 'Cleaned Restaurant Dataset',
      filename: 'cleaned_restaurant_data.csv',
      size: '50.4 MB',
      records: '149,784 rows',
      description: 'Cleaned transactions with engineered lags (1, 7, 14 days), rolling 7d averages, and preserved seasons.',
      icon: FileSpreadsheet,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      id: 'actual-vs-predicted',
      title: 'Actual vs. Predicted Comparison',
      filename: 'actual_vs_predicted.csv',
      size: '761 KB',
      records: '29,959 rows',
      description: 'Held-out chronological test evaluations comparing actual sales/quantity against XGBoost and Linear Regression.',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 'model-evaluation',
      title: 'Model Evaluation Results',
      filename: 'model_evaluation_results.csv',
      size: '1 KB',
      records: '4 model runs',
      description: 'Official metrics scorecard (MAE, RMSE, R² Score) for Linear Regression baseline vs. XGBoost on revenue and quantity.',
      icon: FileText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'forecast-30days',
      title: '30-Day Recursive Forecast',
      filename: 'restaurant_forecast_30days.csv',
      size: '15 KB',
      records: '30 daily projections',
      description: 'Iterative multi-step day-by-day revenue and quantity forecasts from 2024-12-31 to 2025-01-29 with confidence bounds.',
      icon: Database,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Project Deliverables</h3>
              <p className="text-xs text-slate-400">Download authentic datasets, predictions, and forecasts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-5 space-y-3">
          {exportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div 
                key={opt.id} 
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg ${opt.bg} flex items-center justify-center ${opt.color} shrink-0 mt-0.5`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{opt.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">({opt.size} • {opt.records})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <a
                  href={`/api/export/${opt.id}`}
                  download={opt.filename}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
