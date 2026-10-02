import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  Briefcase,
  Layers,
  Zap,
  Printer,
  Sparkles,
  Settings,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  User,
  Mail,
  Phone,
  Globe,
  Code,
  ExternalLink,
  Info
} from 'lucide-react';

import UploadSection from './components/UploadSection';
import ScoreGauge from './components/ScoreGauge';
import SkillGapView from './components/SkillGapView';
import BulletEnhancerLab from './components/BulletEnhancerLab';
import ReportExport from './components/ReportExport';
import ApiKeyModal from './components/ApiKeyModal';

export default function App() {
  const [samples, setSamples] = useState({ resumes: {}, job_descriptions: {} });
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'audit' | 'skills' | 'rewriter' | 'report' | 'raw'
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch sample resumes & JDs on mount
  useEffect(() => {
    fetch('/api/samples')
      .then((res) => res.json())
      .then((data) => setSamples(data))
      .catch((err) => console.error('Failed to load sample data:', err));
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleAnalyze = async ({ file, resumeText, jobDescription }) => {
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('resume_text', resumeText);
    }

    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    try {
      const headers = {};
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis request failed.');
      }

      const data = await response.json();
      setAnalysisData(data);
      setActiveTab('overview');

      // Trigger confetti if strong score (80+)
      if (data.ats_analysis && data.ats_analysis.overall_score >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with analysis backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="no-print sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  ResumeIQ
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ATS Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI & ATS Resume Analyzer & Bullet Enhancer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">AI Settings</span>
              {apiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="API Key Configured" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload & JD Section */}
        <UploadSection
          onAnalyze={handleAnalyze}
          loading={loading}
          sampleResumes={samples.resumes}
          sampleJDs={samples.job_descriptions}
        />

        {/* Results Workspace */}
        {analysisData && (
          <div className="space-y-6 animate-fade-in">
            {/* Candidate Header Pill */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {analysisData.contact_info?.name || analysisData.filename}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    {analysisData.contact_info?.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {analysisData.contact_info.email}
                      </span>
                    )}
                    {analysisData.contact_info?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {analysisData.contact_info.phone}
                      </span>
                    )}
                    {analysisData.contact_info?.linkedin && (
                      <a
                        href={analysisData.contact_info.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        LinkedIn
                      </a>
                    )}
                    {analysisData.contact_info?.github && (
                      <a
                        href={analysisData.contact_info.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-slate-300 hover:underline"
                      >
                        <Code className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {analysisData.job_match?.has_jd && (
                <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    JD Match Score:{' '}
                    <strong className="text-white font-bold">
                      {analysisData.job_match.match_score}%
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="no-print flex border-b border-slate-800 space-x-1 sm:space-x-2 overflow-x-auto pb-1">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<Sparkles className="w-4 h-4" />}
                label="Score & Overview"
              />
              <TabButton
                active={activeTab === 'audit'}
                onClick={() => setActiveTab('audit')}
                icon={<FileCheck className="w-4 h-4" />}
                label="ATS Audit Breakdown"
              />
              <TabButton
                active={activeTab === 'skills'}
                onClick={() => setActiveTab('skills')}
                icon={<Layers className="w-4 h-4" />}
                label={
                  analysisData.job_match?.has_jd
                    ? `Job Match & Skills (${analysisData.job_match.match_score}%)`
                    : 'Skills Catalog'
                }
              />
              <TabButton
                active={activeTab === 'rewriter'}
                onClick={() => setActiveTab('rewriter')}
                icon={<Zap className="w-4 h-4 text-amber-400" />}
                label="STAR Bullet Lab"
              />
              <TabButton
                active={activeTab === 'report'}
                onClick={() => setActiveTab('report')}
                icon={<Printer className="w-4 h-4" />}
                label="Report & Export"
              />
              <TabButton
                active={activeTab === 'raw'}
                onClick={() => setActiveTab('raw')}
                icon={<FileText className="w-4 h-4" />}
                label="Extracted Text"
              />
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <ScoreGauge atsAnalysis={analysisData.ats_analysis} />

                {/* Strengths & Action Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Verified Strengths */}
                  <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-4">
                      <CheckCircle className="w-4 h-4" />
                      ATS & Recruiter Strengths
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {analysisData.ats_analysis.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span className="leading-relaxed">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Priority Fixes */}
                  <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4" />
                      Critical Action Items
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {analysisData.ats_analysis.critical_fixes.length > 0 ? (
                        analysisData.ats_analysis.critical_fixes.map((fix, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-rose-400 font-bold">!</span>
                            <span className="leading-relaxed">{fix}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-emerald-400 font-medium">
                          No severe formatting or completeness blockers found!
                        </li>
                      )}
                      {analysisData.ats_analysis.feedback_notes.map((note, i) => (
                        <li key={`note-${i}`} className="flex items-start gap-2.5 text-slate-400">
                          <span className="text-amber-400 font-bold">•</span>
                          <span className="leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Detailed ATS Audit Breakdown */}
            {activeTab === 'audit' && (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">ATS Parsing & Rubric Audit</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    How enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) evaluate your file.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Contact Info Card */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Contact Information</span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Full Name:</span>
                        <span className="text-slate-200">{analysisData.contact_info?.name || 'Missing'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-200">{analysisData.contact_info?.email || 'Missing'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="text-slate-200">{analysisData.contact_info?.phone || 'Missing'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section Detection Card */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Detected Sections</span>
                    <div className="space-y-1 text-xs">
                      {['summary', 'experience', 'education', 'skills', 'projects', 'certifications'].map((sec) => {
                        const present = Boolean(analysisData.sections && analysisData.sections[sec]);
                        return (
                          <div key={sec} className="flex justify-between items-center">
                            <span className="capitalize text-slate-400">{sec}:</span>
                            <span className={present ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                              {present ? '✓ Found' : 'Not detected'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clichés & Buzzword Audit */}
                  <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Cliché & Buzzword Audit</span>
                    {analysisData.ats_analysis.cliches_found.length > 0 ? (
                      <div>
                        <p className="text-[11px] text-rose-300 mb-2">
                          Recruiters flag empty buzzwords lacking proof:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {analysisData.ats_analysis.cliches_found.map((c, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            >
                              "{c}"
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400">
                        ✓ No generic buzzwords detected. Clean, professional terminology!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Skills & Job Match */}
            {activeTab === 'skills' && (
              <SkillGapView
                jobMatch={analysisData.job_match}
                resumeSkills={analysisData.skills}
              />
            )}

            {/* Tab 4: STAR Bullet Lab */}
            {activeTab === 'rewriter' && (
              <BulletEnhancerLab
                analyzedBullets={analysisData.ats_analysis?.analyzed_bullets || []}
                quickEnhancements={analysisData.quick_enhancements || []}
                apiKey={apiKey}
              />
            )}

            {/* Tab 5: Report & Export */}
            {activeTab === 'report' && <ReportExport analysisData={analysisData} />}

            {/* Tab 6: Raw Extracted Text */}
            {activeTab === 'raw' && (
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-200">
                    Normalized Resume Text ({analysisData.raw_text?.length || 0} characters)
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(analysisData.raw_text)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                  >
                    Copy Text
                  </button>
                </div>
                <pre className="w-full max-h-[500px] overflow-y-auto p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {analysisData.raw_text}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>ResumeIQ • Built for Candidates and Recruiters • Offline & Secure Analysis</p>
      </footer>

      {/* Settings Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition cursor-pointer shrink-0 ${
        active
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
