"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  ProScrapeResponse, FilterState, SearchHistoryItem, JobListing,
} from "./types";
import { COUNTRIES, getCitiesForCountry } from "../api/job-scraper-pro/data";
import ProJobCard from "./JobCard";
import FilterSidebar from "./FilterSidebar";
import ProAnalysisPanel from "./AnalysisPanel";
import { exportCSV, exportPDF } from "./exportUtils";

const PAGE_SIZE = 15;
const TRENDING = [
  { role: "AI Engineer", country: "US", code: "US" },
  { role: "Full Stack Developer", country: "Germany", code: "DE" },
  { role: "Data Scientist", country: "Canada", code: "CA" },
  { role: "DevOps Engineer", country: "UK", code: "UK" },
  { role: "Frontend Developer", country: "Pakistan", code: "PK" },
  { role: "ML Engineer", country: "Singapore", code: "SG" },
];

export default function JobScraperProPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [city, setCity] = useState("All Cities");
  const [cityOptions, setCityOptions] = useState<string[]>(getCitiesForCountry("US"));
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ProScrapeResponse | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({ remoteOnly: false, experienceLevel: "All", sortBy: "newest" });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reset city when country changes
  useEffect(() => {
    const options = getCitiesForCountry(countryCode);
    setCityOptions(options);
    setCity("All Cities");
  }, [countryCode]);

  // Load persisted data
  useEffect(() => {
    try {
      const h = localStorage.getItem("jspro_history");
      if (h) setHistory(JSON.parse(h));
      const s = localStorage.getItem("jspro_saved");
      if (s) setSavedJobs(new Set(JSON.parse(s)));
    } catch {}
  }, []);

  // Apply filters + sort on the full dataset
  const filteredJobs = useMemo<JobListing[]>(() => {
    if (!data) return [];
    let jobs = [...data.jobs];
    if (filters.remoteOnly) jobs = jobs.filter((j) => j.jobType === "Remote");
    if (filters.experienceLevel !== "All") jobs = jobs.filter((j) => j.experienceLevel === filters.experienceLevel);
    if (filters.sortBy === "newest") jobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    if (filters.sortBy === "salary") {
      // sort by first number in salary string
      jobs.sort((a, b) => {
        const an = parseInt(a.salary.replace(/\D/g, "").slice(0, 8)) || 0;
        const bn = parseInt(b.salary.replace(/\D/g, "").slice(0, 8)) || 0;
        return bn - an;
      });
    }
    return jobs;
  }, [data, filters]);

  const visibleJobs = filteredJobs.slice(0, page * PAGE_SIZE);
  const hasMore = visibleJobs.length < filteredJobs.length;

  async function search(e?: React.FormEvent, overrideTitle?: string, overrideCode?: string, overrideCity?: string) {
    e?.preventDefault();
    const t = (overrideTitle ?? jobTitle).trim();
    const c = overrideCode ?? countryCode;
    const ct = overrideCity ?? city;
    if (!t) { setError("Please enter a job title."); return; }
    setError(""); setLoading(true); setData(null); setPage(1);

    try {
      const res = await fetch("/api/job-scraper-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: t, countryCode: c, city: ct }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      const d = json as ProScrapeResponse;
      setData(d);

      // Save to history
      const item: SearchHistoryItem = {
        id: Date.now().toString(),
        jobTitle: t,
        country: d.searchParams.country,
        countryCode: c,
        city: ct,
        timestamp: new Date().toLocaleString(),
        resultCount: d.totalCount,
      };
      const newHistory = [item, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("jspro_history", JSON.stringify(newHistory));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSave(id: string) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("jspro_saved", JSON.stringify([...next]));
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("jspro_history");
  }

  async function handlePDF() {
    if (!data) return;
    setPdfLoading(true);
    await exportPDF(filteredJobs, data.analysis, data.searchParams.jobTitle, data.searchParams.country, data.searchParams.city);
    setPdfLoading(false);
  }

  const savedList = data?.jobs.filter((j) => savedJobs.has(j.id)) ?? [];
  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <div className="relative min-h-screen z-10">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#080b14]/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm">AI Global Job Scraper</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-semibold">PRO</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <>
                <button onClick={() => { setShowSaved(!showSaved); setShowHistory(false); }}
                  className={`btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 ${showSaved ? "border-amber-500/30 text-amber-400" : ""}`}>
                  <svg className="w-3.5 h-3.5" fill={showSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  Saved ({savedJobs.size})
                </button>
              </>
            )}
            <button onClick={() => { setShowHistory(!showHistory); setShowSaved(false); }}
              className={`btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 ${showHistory ? "border-cyan-500/30 text-cyan-400" : ""}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              History
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono ml-2">
              <span className="pulse-dot" /><span className="hidden sm:inline">Live</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-20 pt-10">
        {/* ── Hero ── */}
        <div className="text-center mb-10 fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-xs text-violet-300 font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            100+ Live Listings · 12 Countries · AI-Powered Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-100 leading-tight mb-3 tracking-tight">
            Global Job Intelligence<br />
            <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Search jobs by title &amp; country, apply smart filters, and export professional reports instantly.
          </p>
        </div>

        {/* ── Search form ── */}
        <div className="max-w-3xl mx-auto mb-8 fade-up-delay-1">
          <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
            {/* Job title */}
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input id="pro-job-title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title e.g. Frontend Developer…"
                className="glass-input w-full pl-10 pr-4 py-3 text-sm" />
            </div>
            {/* Country */}
            <select
              id="pro-country-select"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="glass-input px-4 py-3 text-sm min-w-[160px] cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} style={{ background: "#0d1117" }}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            {/* City */}
            {cityOptions.length > 2 && (
              <select
                id="pro-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="glass-input px-4 py-3 text-sm min-w-[140px] cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c} style={{ background: "#0d1117" }}>{c}</option>
                ))}
              </select>
            )}
            {/* Submit */}
            <button id="pro-search-btn" type="submit" disabled={loading}
              className="btn-primary px-6 py-3 text-sm flex items-center gap-2 disabled:opacity-60">
              {loading
                ? <><span className="spinner w-4 h-4" />Scraping…</>
                : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Scrape Jobs</>}
            </button>
          </form>

          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>

        {/* ── Trending chips ── */}
        {!data && !loading && (
          <div className="fade-up-delay-2 mb-10">
            <p className="text-xs text-slate-600 text-center mb-3 uppercase tracking-widest">🔥 Trending Searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {TRENDING.map((t) => (
                <button key={`${t.role}-${t.code}`}
                  onClick={() => { setJobTitle(t.role); setCountryCode(t.code); setCity("All Cities"); search(undefined, t.role, t.code, "All Cities"); }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <span>{COUNTRIES.find((c) => c.code === t.code)?.flag}</span>
                  {t.role} · {t.country}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── History panel ── */}
        {showHistory && (
          <div className="glass-card p-5 mb-8 fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Search History</h3>
              <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
            </div>
            {history.length === 0
              ? <p className="text-xs text-slate-600">No history yet.</p>
              : <div className="flex flex-col gap-2">
                  {history.map((h) => (
                    <button key={h.id}
                      onClick={() => { setJobTitle(h.jobTitle); setCountryCode(h.countryCode); setCity(h.city ?? "All Cities"); search(undefined, h.jobTitle, h.countryCode, h.city ?? "All Cities"); setShowHistory(false); }}
                      className="flex items-center justify-between text-left px-3 py-2.5 rounded-xl bg-white/3 hover:bg-white/6 transition-all border border-white/5">
                      <div>
                        <p className="text-sm text-slate-300 font-medium">{h.jobTitle} · {COUNTRIES.find(c=>c.code===h.countryCode)?.flag} {h.country}{h.city && h.city !== "All Cities" ? ` · ${h.city}` : ""}</p>
                        <p className="text-xs text-slate-600">{h.timestamp} · {h.resultCount} results</p>
                      </div>
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>}
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-48">
                <div className="h-3.5 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-5" />
                <div className="flex gap-2 mb-4"><div className="h-5 bg-white/5 rounded-full w-16" /><div className="h-5 bg-white/5 rounded-full w-14" /></div>
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {data && !loading && (
          <>
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 fade-up">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {filteredJobs.length} Listings Found
                  {filteredJobs.length !== data.totalCount && <span className="text-sm font-normal text-slate-500 ml-2">(filtered from {data.totalCount})</span>}
                </h2>
                <p className="text-sm text-slate-500">
                  <span className="text-violet-400">{data.searchParams.jobTitle}</span>
                  {" · "}{selectedCountry?.flag} <span className="text-cyan-400">{data.searchParams.country}</span>
                  {data.searchParams.city && data.searchParams.city !== "All Cities" && (
                    <> · <span className="text-amber-400">{data.searchParams.city}</span></>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 lg:hidden">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 10h12M9 16h6"/>
                  </svg>
                  Filters
                </button>
                <button onClick={() => exportCSV(filteredJobs, data.searchParams.jobTitle, data.searchParams.country, data.searchParams.city)}
                  className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  CSV
                </button>
                <button onClick={handlePDF} disabled={pdfLoading}
                  className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5 disabled:opacity-60">
                  {pdfLoading ? <><span className="spinner w-3.5 h-3.5"/>PDF…</> : <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    PDF
                  </>}
                </button>
              </div>
            </div>

            {/* Saved jobs view */}
            {showSaved && (
              <div className="mb-8 fade-up">
                <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  Saved Jobs ({savedList.length})
                </h3>
                {savedList.length === 0
                  ? <p className="text-xs text-slate-600">No saved jobs yet. Click the bookmark icon on any card.</p>
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedList.map((j) => <ProJobCard key={j.id} job={j} isSaved={savedJobs.has(j.id)} onToggleSave={toggleSave} />)}
                    </div>}
                <div className="divider mt-6 mb-2" />
              </div>
            )}

            {/* Main grid + filter sidebar */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className={`w-56 flex-shrink-0 ${sidebarOpen ? "block" : "hidden"} lg:block`}>
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => { setFilters(f); setPage(1); }}
                  totalCount={data.totalCount}
                  filteredCount={filteredJobs.length}
                />
              </div>

              {/* Job grid */}
              <div className="flex-1 min-w-0">
                {filteredJobs.length === 0
                  ? <div className="text-center py-16 text-slate-600">
                      <p className="text-sm">No jobs match your filters. Try adjusting them.</p>
                      <button onClick={() => setFilters({ remoteOnly: false, experienceLevel: "All", sortBy: "newest" })}
                        className="btn-secondary text-xs px-4 py-2 mt-3">Reset Filters</button>
                    </div>
                  : <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {visibleJobs.map((j) => (
                          <ProJobCard key={j.id} job={j} isSaved={savedJobs.has(j.id)} onToggleSave={toggleSave} />
                        ))}
                      </div>
                      {/* Load more */}
                      {hasMore && (
                        <div className="text-center mt-8">
                          <p className="text-xs text-slate-600 mb-3">Showing {visibleJobs.length} of {filteredJobs.length} results</p>
                          <button onClick={() => setPage((p) => p + 1)}
                            className="btn-secondary px-6 py-2.5 text-sm">
                            Load More Jobs
                          </button>
                        </div>
                      )}
                    </>}
              </div>
            </div>

            {/* AI Analysis */}
            <ProAnalysisPanel
              analysis={data.analysis}
              query={data.searchParams.jobTitle}
              country={data.searchParams.country}
            />
          </>
        )}

        {/* ── Empty state ── */}
        {!data && !loading && (
          <div className="text-center py-20 text-slate-700 fade-up-delay-3">
            <svg className="w-14 h-14 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064"/>
            </svg>
            <p className="text-sm">Enter a job title &amp; country above to start scraping</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700">
          <span>AI Global Job Scraper Pro — Built for BS AI Students 🎓</span>
          <span className="font-mono">{new Date().getFullYear()} · Portfolio Ready</span>
        </div>
      </footer>
    </div>
  );
}
