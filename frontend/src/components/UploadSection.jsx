import React, { useState, useRef } from 'react';
import { Upload, FileText, Clipboard, Sparkles, X, Briefcase, Check } from 'lucide-react';

export default function UploadSection({
  onAnalyze,
  loading,
  sampleResumes,
  sampleJDs,
  onLoadSample
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSampleResumeSelect = (key) => {
    if (sampleResumes && sampleResumes[key]) {
      setFile(null);
      setResumeText(sampleResumes[key].text);
      setActiveTab('paste');
      if (onLoadSample) onLoadSample(key);
    }
  };

  const handleSampleJDSelect = (key) => {
    if (sampleJDs && sampleJDs[key]) {
      setJobDescription(sampleJDs[key].text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      alert('Please upload a resume file (PDF, DOCX, TXT) or paste your resume text.');
      return;
    }

    onAnalyze({
      file,
      resumeText: activeTab === 'paste' ? resumeText : '',
      jobDescription
    });
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
      {/* Quick Demo Previews */}
      <div className="mb-6 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quick 1-Click Test Resumes:</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => handleSampleResumeSelect('senior_fullstack')}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Alex Chen (Senior Full Stack - High ATS 85%+)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleResumeSelect('ai_ml_engineer')}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Priya Sharma (AI / ML Engineer - 90%+)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleResumeSelect('junior_developer')}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Jordan Miller (Junior Dev - Low 35% with Clichés)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Input Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Resume Document
              </label>
              <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeTab === 'paste'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[200px] ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : file
                    ? 'border-emerald-500/60 bg-emerald-950/20'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-100 text-sm">{file.name}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-3 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag & drop your resume, or <span className="text-indigo-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, DOC, or TXT</p>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here (Contact info, Summary, Experience, Education, Skills)..."
                className="w-full h-[200px] bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            )}
          </div>

          {/* Job Description Input Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Target Job Description (Optional for JD Match)
              </label>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  Clear JD
                </button>
              )}
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description to calculate keyword match %, skill gaps, and ATS alignment..."
              className="w-full h-[155px] bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />

            {/* Quick load sample JDs */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Sample JDs:</span>
              <button
                type="button"
                onClick={() => handleSampleJDSelect('fullstack_fintech')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 cursor-pointer transition"
              >
                FinTech Full Stack
              </button>
              <button
                type="button"
                onClick={() => handleSampleJDSelect('ml_ai_specialist')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 cursor-pointer transition"
              >
                GenAI / ML Specialist
              </button>
              <button
                type="button"
                onClick={() => handleSampleJDSelect('frontend_specialist')}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 cursor-pointer transition"
              >
                React Frontend
              </button>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Analyzing Resume & Matching ATS Rubric...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Comprehensive ATS Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
