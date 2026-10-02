import React from 'react';
import { Award, TrendingUp, CheckCircle, AlertTriangle, FileText, Zap } from 'lucide-react';

export default function ScoreGauge({ atsAnalysis }) {
  if (!atsAnalysis) return null;

  const score = atsAnalysis.overall_score || 0;
  const grade = atsAnalysis.grade || 'C';
  const gradeLabel = atsAnalysis.grade_label || 'Needs Review';
  const subScores = atsAnalysis.sub_scores || {};

  // Circumference for r=70: 2 * PI * 70 ≈ 440
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return { stroke: '#10b981', bg: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (val >= 65) return { stroke: '#f59e0b', bg: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { stroke: '#f43f5e', bg: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-700/60"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={colors.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-black tracking-tight ${colors.bg}`}>{score}</span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">out of 100</span>
              <span className={`mt-1 text-xs px-2.5 py-0.5 rounded-full font-bold border ${colors.badge}`}>
                Grade {grade}
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" />
            {gradeLabel}
          </p>
        </div>

        {/* Breakdown Sub-scores */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <SubScoreBar
            label="Quantifiable Impact"
            current={subScores.impact || 0}
            max={25}
            hint={`${atsAnalysis.metric_percentage || 0}% bullets have numbers/%`}
            color="bg-emerald-500"
          />
          <SubScoreBar
            label="Skills Catalog & Depth"
            current={subScores.skills_depth || 0}
            max={20}
            hint="Industry skills diversity"
            color="bg-blue-500"
          />
          <SubScoreBar
            label="Action Verbs & Phrasing"
            current={subScores.action_verbs || 0}
            max={15}
            hint={`${atsAnalysis.action_verb_percentage || 0}% start with power verbs`}
            color="bg-indigo-500"
          />
          <SubScoreBar
            label="Section Architecture"
            current={subScores.sections || 0}
            max={15}
            hint="Experience, Education, Skills"
            color="bg-cyan-500"
          />
          <SubScoreBar
            label="Formatting & Length"
            current={subScores.formatting || 0}
            max={15}
            hint={`${atsAnalysis.word_count || 0} words, ${atsAnalysis.bullet_count || 0} bullets`}
            color="bg-purple-500"
          />
          <SubScoreBar
            label="Contact & Online Profiles"
            current={subScores.contact || 0}
            max={10}
            hint="Email, Phone, LinkedIn/GitHub"
            color="bg-teal-500"
          />
        </div>
      </div>
    </div>
  );
}

function SubScoreBar({ label, current, max, hint, color }) {
  const pct = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="text-slate-400 font-mono">
          <strong className="text-white">{current}</strong>/{max}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1 truncate">{hint}</p>}
    </div>
  );
}
