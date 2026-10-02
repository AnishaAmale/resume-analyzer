import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Copy, Check, Sparkles, Filter, Layers } from 'lucide-react';

export default function SkillGapView({ jobMatch, resumeSkills }) {
  const [copiedSkill, setCopiedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSkill(text);
    setTimeout(() => setCopiedSkill(null), 1800);
  };

  const categoryNames = {
    languages: 'Languages',
    frameworks: 'Frameworks & Libraries',
    cloud_devops: 'Cloud & DevOps',
    databases: 'Databases & Storage',
    ai_data: 'AI, ML & Data',
    tools: 'Developer Tools',
    soft_skills: 'Core Competencies / Soft Skills'
  };

  const hasJD = jobMatch && jobMatch.has_jd;

  if (!hasJD) {
    // Show resume skills overview if no JD provided
    const totalResumeSkills = resumeSkills
      ? Object.values(resumeSkills).reduce((acc, list) => acc + list.length, 0)
      : 0;

    return (
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Detected Resume Skills ({totalResumeSkills})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Skills extracted and recognized by standard ATS taxonomies.
            </p>
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Provide a target Job Description above to unlock matched vs missing skill gap comparison.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeSkills &&
            Object.entries(resumeSkills).map(([catKey, skills]) => {
              if (!skills || skills.length === 0) return null;
              return (
                <div key={catKey} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {categoryNames[catKey] || catKey}
                    </span>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {skills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // With Job Description Match
  const matchScore = jobMatch.match_score || 0;
  const matchedSkills = jobMatch.matched_skills || {};
  const missingSkills = jobMatch.missing_skills || {};
  const matchedCount = jobMatch.matched_count || 0;
  const missingCount = jobMatch.missing_count || 0;
  const totalJDSkills = jobMatch.total_jd_skills || 0;
  const recommendations = jobMatch.priority_recommendations || [];

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Banner: Match Score */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={matchScore >= 70 ? '#10b981' : matchScore >= 50 ? '#f59e0b' : '#f43f5e'}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (matchScore / 100) * 251.2}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-black text-xl text-white">{matchScore}%</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Job Description Alignment</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Matched <strong className="text-emerald-400">{matchedCount}</strong> out of{' '}
              <strong className="text-white">{totalJDSkills}</strong> target keywords & requirements.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span>Keyword Match: <strong className="text-slate-200">{jobMatch.keyword_match_score}%</strong></span>
              <span>•</span>
              <span>Semantic Similarity: <strong className="text-slate-200">{jobMatch.semantic_similarity}%</strong></span>
            </div>
          </div>
        </div>

        {/* Quick copy missing skills helper */}
        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">Missing Requirements</span>
          <span className="text-xl font-bold text-rose-400">{missingCount} Keywords</span>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Targeted Skill Gap Optimizations
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Two Columns: Matched vs Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Matched Keywords ({matchedCount})
            </h4>
            <span className="text-xs text-slate-400 font-mono">Present in Resume</span>
          </div>

          {matchedCount === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">No exact skill matches found.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(matchedSkills).map(([catKey, skills]) => {
                if (!skills || skills.length === 0) return null;
                return (
                  <div key={catKey} className="bg-slate-900/50 border border-emerald-900/30 rounded-xl p-3">
                    <span className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider block mb-2">
                      {categoryNames[catKey] || catKey}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Missing Skills Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Missing Critical Keywords ({missingCount})
            </h4>
            <span className="text-xs text-slate-400 font-mono">Click to copy</span>
          </div>

          {missingCount === 0 ? (
            <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-300">Outstanding Match!</p>
              <p className="text-xs text-slate-400 mt-1">Your resume covers all detected skills in this job description.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(missingSkills).map(([catKey, skills]) => {
                if (!skills || skills.length === 0) return null;
                return (
                  <div key={catKey} className="bg-slate-900/50 border border-rose-900/30 rounded-xl p-3">
                    <span className="text-[11px] font-semibold text-rose-400/80 uppercase tracking-wider block mb-2">
                      {categoryNames[catKey] || catKey}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => {
                        const isCopied = copiedSkill === skill;
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => copyToClipboard(skill)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium transition cursor-pointer"
                            title="Click to copy keyword"
                          >
                            <span>{skill}</span>
                            {isCopied ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400 opacity-60" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
