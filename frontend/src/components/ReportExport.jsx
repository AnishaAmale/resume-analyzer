import React from 'react';
import { Printer, Download, CheckCircle, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';

export default function ReportExport({ analysisData }) {
  if (!analysisData) return null;

  const ats = analysisData.ats_analysis || {};
  const contact = analysisData.contact_info || {};
  const jobMatch = analysisData.job_match || {};
  const filename = analysisData.filename || 'Resume_Analysis';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, '')}_ATS_Report.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Export & Share ATS Audit</h4>
          <p className="text-xs text-slate-400">Save a clean PDF or machine-readable JSON report.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 border border-slate-600 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl text-slate-100 space-y-6 print:border-none print:shadow-none print:p-0 print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block mb-1">
              ATS COMPATIBILITY AUDIT REPORT
            </span>
            <h2 className="text-2xl font-black text-white">{contact.name || 'Candidate Profile'}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
              {contact.email && <span>Email: {contact.email}</span>}
              {contact.phone && <span>Phone: {contact.phone}</span>}
              {contact.linkedin && <span>LinkedIn: {contact.linkedin}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex flex-col items-center bg-slate-800 border border-slate-700 rounded-xl px-5 py-3">
              <span className="text-3xl font-black text-indigo-400">{ats.overall_score || 0}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">ATS Score (Grade {ats.grade})</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Measurable Metrics</span>
            <span className="text-base font-bold text-emerald-400">{ats.metric_percentage || 0}%</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Action Verbs Ratio</span>
            <span className="text-base font-bold text-indigo-400">{ats.action_verb_percentage || 0}%</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Word Count</span>
            <span className="text-base font-bold text-slate-200">{ats.word_count || 0}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Bullet Count</span>
            <span className="text-base font-bold text-slate-200">{ats.bullet_count || 0}</span>
          </div>
        </div>

        {/* Strengths & Critical Fixes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Key Strengths */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Verified Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {ats.strengths && ats.strengths.length > 0 ? (
                ats.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No significant strengths recorded.</li>
              )}
            </ul>
          </div>

          {/* Critical Fixes */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Priority Action Items
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {ats.critical_fixes && ats.critical_fixes.length > 0 ? (
                ats.critical_fixes.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">!</span>
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-400 font-medium">No critical blockers detected!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Job Match Section if available */}
        {jobMatch.has_jd && (
          <div className="border-t border-slate-700/60 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              Job Match Summary ({jobMatch.match_score}%)
            </h4>
            <p className="text-xs text-slate-300">
              Matched {jobMatch.matched_count} requirements. Missing {jobMatch.missing_count} required keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
