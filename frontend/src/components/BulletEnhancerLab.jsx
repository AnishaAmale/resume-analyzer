import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Zap, Target, Award, RefreshCw } from 'lucide-react';

export default function BulletEnhancerLab({
  analyzedBullets = [],
  quickEnhancements = [],
  apiKey
}) {
  const [selectedBullet, setSelectedBullet] = useState(
    quickEnhancements.length > 0
      ? quickEnhancements[0].original
      : analyzedBullets.length > 0
      ? analyzedBullets[0].text
      : 'Worked on company website using HTML, CSS, and JavaScript'
  );
  const [customInput, setCustomInput] = useState(selectedBullet);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [rewrites, setRewrites] = useState(
    quickEnhancements.length > 0 ? quickEnhancements[0].suggestions : []
  );
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleSelectBullet = (bulletText) => {
    setSelectedBullet(bulletText);
    setCustomInput(bulletText);

    // Check if we already have quick enhancement for this bullet
    const precomputed = quickEnhancements.find((q) => q.original === bulletText);
    if (precomputed && precomputed.suggestions) {
      setRewrites(precomputed.suggestions);
    } else {
      triggerRewrite(bulletText, targetRole);
    }
  };

  const triggerRewrite = async (textToRewrite, role) => {
    const text = (textToRewrite || customInput).trim();
    if (!text) return;

    setLoading(true);
    try {
      const response = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bullet: text,
          target_role: role || targetRole,
          api_key: apiKey || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRewrites(data.rewrites || []);
      } else {
        alert('Failed to rewrite bullet. Please check your backend connection.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              STAR Bullet Point Enhancer Lab
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Transform passive phrases into high-impact, measurable STAR statements (Situation, Task, Action, Result).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Target Tone:</span>
            <select
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                triggerRewrite(customInput, e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Senior Full Stack Engineer">Senior Full Stack</option>
              <option value="Machine Learning Engineer">AI / ML Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Engineering Manager">Engineering Leader</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bullet List from Resume (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Detected Resume Bullets ({analyzedBullets.length})</span>
            <span>Click to optimize</span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {analyzedBullets.map((b, idx) => {
              const isSelected = selectedBullet === b.text;
              const isStrong = b.score >= 80;
              const isWeak = b.score < 50;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectBullet(b.text)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        isStrong
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isWeak
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {b.rating}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Score {b.score}/100</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Editor & Rewrites (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Original Bullet Statement:</span>
              <span className="text-slate-500 text-[11px]">Edit or type your own bullet</span>
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerRewrite(customInput, targetRole)}
                disabled={loading || !customInput.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate STAR Enhancements</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Variations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              High-Impact STAR Variations:
            </h4>

            {rewrites && rewrites.length > 0 ? (
              rewrites.map((rw, i) => (
                <div
                  key={i}
                  className="bg-slate-900/60 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl p-4 transition group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400">{rw.title}</span>
                      {rw.action_verb && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          Verb: {rw.action_verb}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(rw.text, i)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedIdx === i ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium pl-3 border-l-2 border-indigo-500">
                    {rw.text}
                  </p>

                  {rw.rationale && (
                    <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-950/40 p-2 rounded-lg">
                      💡 {rw.rationale}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
                Select or paste a bullet point above and click "Generate STAR Enhancements"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
