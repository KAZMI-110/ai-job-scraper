"use client";

import { useState } from "react";
import type { ScrapeResponse } from "./types";
import JobCard from "./JobCard";
import AnalysisPanel from "./AnalysisPanel";
import { exportCSV, exportPDF } from "./exportUtils";

const SUGGESTIONS = [
  "Frontend Developer", "Data Scientist", "Full Stack Developer",
  "Machine Learning Engineer", "DevOps Engineer", "UI UX Designer",
  "Backend Developer", "Product Manager",
];

export default function JobScraperPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ScrapeResponse | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleSearch(e: React.FormEvent | null, overrideQuery?: string) {
    e?.preventDefault();
    const q = (overrideQuery ?? query).trim();
    if (!q) { setError("Please enter a job title."); return; }
    setError("");
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/job-scraper-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: q }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setData(json as ScrapeResponse);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(s: string) {
    setQuery(s);
    handleSearch(null, s);
  }

  async function handlePDF() {
    if (!data) return;
    setPdfLoading(true);
    await exportPDF(data.jobs, data.analysis, data.searchQuery);
    setPdfLoading(false);
  }

  return (
    <div className="relative min-h-screen z-10">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#080b14]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-700 text-slate-100 text-sm sm:text-base tracking-tight">
              AI Job Scraper<span className="text-violet-400 ml-1">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="pulse-dot" />
            <span className="hidden sm:inline">Live Engine</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-12">
        {/* ── Hero ── */}
        <div className="text-center mb-12 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-xs text-violet-300 font-500 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-900 text-slate-100 leading-[1.1] mb-4 tracking-tight">
            Find Your Next<br />
            <span className="gradient-text">Dream Job</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Enter any job title to instantly scrape listings, get AI career analysis, and export professional reports.
          </p>
        </div>

        {/* ── Search form ── */}
        <div className="max-w-2xl mx-auto mb-8 fade-up-delay-1">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="job-title-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Scientist…"
                className="glass-input w-full pl-10 pr-4 py-3.5 text-sm"
              />
            </div>
            <button
              id="search-btn"
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3.5 text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><span className="spinner w-4 h-4" /> Searching…</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Scrape Jobs
              </>}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          {/* Suggestions */}
          {!data && !loading && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 h-52">
                <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-5" />
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {data && !loading && (
          <>
            {/* Results header + export */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 fade-up">
              <div>
                <h2 className="text-xl font-700 text-slate-100">
                  {data.jobs.length} Listings Found
                </h2>
                <p className="text-sm text-slate-500">
                  Results for &ldquo;<span className="text-violet-400">{data.searchQuery}</span>&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="export-csv-btn"
                  onClick={() => exportCSV(data.jobs, data.searchQuery)}
                  className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
                <button
                  id="export-pdf-btn"
                  onClick={handlePDF}
                  disabled={pdfLoading}
                  className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {pdfLoading
                    ? <><span className="spinner w-4 h-4" /> Generating…</>
                    : <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export PDF
                    </>}
                </button>
              </div>
            </div>

            {/* Job cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>

            {/* AI Analysis */}
            <AnalysisPanel analysis={data.analysis} query={data.searchQuery} />
          </>
        )}

        {/* ── Empty state ── */}
        {!data && !loading && (
          <div className="text-center py-20 text-slate-600 fade-up-delay-2">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Search for a job title above to get started</p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>AI Job Scraper Pro — Built for BS AI Students 🎓</span>
          <span className="font-mono">{new Date().getFullYear()} · Portfolio Tool</span>
        </div>
      </footer>
    </div>
  );
}
