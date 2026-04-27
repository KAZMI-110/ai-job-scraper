"use client";

import { useState, useEffect } from "react";
import { Job } from "@/app/types/job";
import JobCard from "@/app/components/JobCard";
import Link from "next/link";
import { COUNTRIES, getCitiesForCountry } from "@/app/api/job-scraper-pro/data";
import { jsPDF } from "jspdf";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [city, setCity] = useState("All Cities");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [source, setSource] = useState<"live" | "demo" | null>(null);

  const availableCities = getCitiesForCountry(countryCode);

  const TRENDING_SEARCHES = [
    "Frontend Developer", "Data Scientist", "Project Manager", "DevOps Engineer", "UI/UX Designer"
  ];

  const searchJobs = async (resetPage = true) => {
    if (!query) {
      setError("Please enter a job title or keyword.");
      return;
    }

    const currentPage = resetPage ? 1 : page;
    if (resetPage) {
      setPage(1);
      setJobs([]);
    }

    setLoading(true);
    setError("");

    const selectedCountry = COUNTRIES.find(c => c.code === countryCode)?.name || "United States";
    const fullLocation = city === "All Cities" ? selectedCountry : `${city}, ${selectedCountry}`;

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          location: fullLocation,
          page: currentPage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch jobs");
      }

      setSource(data.source);
      
      if (resetPage) {
        setJobs(data.jobs);
      } else {
        setJobs(prev => [...prev, ...data.jobs]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (jobs.length === 0) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("JobScraper Pro - Intelligence Report", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 20, 30);
    doc.text(`Search Query: ${query}`, 20, 35);
    doc.text(`Location: ${city}, ${countryCode}`, 20, 40);
    
    let yPos = 55;
    
    jobs.forEach((job, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${job.title}`, 20, yPos);
      
      yPos += 7;
      doc.setFontSize(11);
      doc.setTextColor(70);
      doc.setFont("helvetica", "normal");
      doc.text(`Company: ${job.company} | Salary: ${job.salary}`, 20, yPos);
      
      yPos += 5;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Location: ${job.location} | Source: ${job.source}`, 20, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(120);
      const splitDesc = doc.splitTextToSize(job.description.substring(0, 200) + "...", 170);
      doc.text(splitDesc, 20, yPos);
      
      yPos += (splitDesc.length * 4) + 10;
    });
    
    doc.save(`JobScraper-Report-${query.replace(/\s+/g, "-")}.pdf`);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  useEffect(() => {
    if (page > 1) {
      searchJobs(false);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pb-32 font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#030712]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">JobScraper <span className="text-indigo-400">Pro</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
             <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Documentation</button>
             <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all">Support</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-none">
            Global Job Intelligence <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Powered by AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Search jobs by title & country, apply smart filters, and export professional reports instantly.
          </p>

          {/* Centered Search Bar */}
          <div className="max-w-5xl mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-stretch gap-1">
            <div className="flex-[2.5] relative group flex items-center">
               <svg className="absolute left-6 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <input 
                 type="text" 
                 placeholder="Job Title (e.g. Software Engineer)"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 className="w-full bg-transparent pl-14 pr-6 py-5 text-white outline-none font-medium placeholder:text-slate-600 text-base"
                 onKeyDown={(e) => e.key === 'Enter' && searchJobs(true)}
               />
            </div>
            
            <div className="hidden md:block w-px bg-white/10 my-3" />

            <div className="flex-1 flex items-center px-4">
              <select 
                value={countryCode}
                onChange={(e) => { setCountryCode(e.target.value); setCity("All Cities"); }}
                className="w-full bg-transparent py-5 text-slate-300 outline-none cursor-pointer font-medium appearance-none text-sm"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-slate-900">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="hidden md:block w-px bg-white/10 my-3" />

            <div className="flex-1 flex items-center px-4">
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent py-5 text-slate-300 outline-none cursor-pointer font-medium appearance-none text-sm"
              >
                {availableCities.map(c => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => searchJobs(true)}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-[26px] transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 m-0.5 shrink-0"
            >
              {loading ? (
                <span className="spinner w-5 h-5 border-white/30 border-t-white" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Scraping
                </>
              )}
            </button>
          </div>

          {/* Trending Searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mr-2">Trending Profiles</span>
             {TRENDING_SEARCHES.map(term => (
               <button 
                 key={term} 
                 onClick={() => { setQuery(term); }}
                 className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] font-bold text-slate-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all"
               >
                 {term}
               </button>
             ))}
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl mb-12 flex items-center gap-4 fade-up">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
           <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Market Intel</h2>
              <p className="text-slate-500 text-sm font-medium">Real-time analysis of available high-impact roles.</p>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                 <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${source === 'live' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    <div className={`absolute -inset-1 rounded-full animate-ping opacity-20 ${source === 'live' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{source === 'live' ? 'Live Stream' : 'Archive Demo'}</span>
              </div>
              <button 
                onClick={exportToPDF}
                disabled={jobs.length === 0}
                className="group px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 disabled:border-white/5 border border-indigo-500/20 rounded-xl text-xs font-bold text-white uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-indigo-600/10"
              >
                <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </button>
           </div>
        </div>

        {/* Job Grid */}
        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            <div className="mt-24 text-center">
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all text-sm tracking-wide"
              >
                {loading ? (
                   <span className="flex items-center gap-3">
                     <span className="spinner w-4 h-4 border-slate-500" />
                     Loading...
                   </span>
                ) : "Expand Data Search"}
              </button>
            </div>
          </>
        ) : !loading && (
          <div className="text-center py-48 border-2 border-dashed border-white/5 rounded-[64px] bg-white/[0.01]">
             <div className="w-20 h-20 bg-slate-900/50 rounded-[24px] flex items-center justify-center mx-auto mb-8 text-slate-700 border border-white/5 shadow-inner">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-300 mb-2">Engine Ready for Input</h3>
             <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
               Select target title and geographical location to initiate high-speed career intelligence scraping.
             </p>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && jobs.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 h-[400px] animate-pulse relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
                 <div className="h-8 bg-white/5 rounded-xl w-3/4 mb-6" />
                 <div className="h-4 bg-white/5 rounded-lg w-1/2 mb-12" />
                 <div className="flex gap-4 mb-12">
                   <div className="h-8 bg-white/5 rounded-full w-24" />
                   <div className="h-8 bg-white/5 rounded-full w-24" />
                 </div>
                 <div className="space-y-4">
                   <div className="h-3 bg-white/5 rounded-full w-full" />
                   <div className="h-3 bg-white/5 rounded-full w-full" />
                   <div className="h-3 bg-white/5 rounded-full w-4/5" />
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-48 pb-20 border-t border-white/5 text-center">
        <div className="pt-16 flex flex-col items-center">
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-10">JS_AI_PRO • GLOBAL INTELLIGENCE SYSTEM</p>
          
          <div className="flex items-center gap-8 mb-10">
            <a href="https://github.com/KAZMI-110" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
            </a>
            
            <div className="w-px h-6 bg-white/5" />
            
            <a href="https://www.linkedin.com/in/syed-ali-kazmi-6232062a0/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
            </a>
          </div>

          <p className="text-slate-500 text-sm font-medium">Developed by <span className="text-white font-bold">Syed Ali Kazmi</span></p>
          <p className="text-slate-500 text-sm mt-2 opacity-60">© {new Date().getFullYear()} AI Job Scraper Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
