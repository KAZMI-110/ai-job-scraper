"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-6 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">JobScraper <span className="text-indigo-400">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link href="/dashboard" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20">
              Launch Pro
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-10 fade-up">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Next-Gen Job Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight text-white leading-[1] fade-up-delay-1">
            Global Job Intelligence <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Powered by AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 fade-up-delay-2 leading-relaxed">
            Search jobs by title & country, apply smart filters, and export professional reports instantly. The ultimate tool for elite career growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 fade-up-delay-3">
            <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-bold text-lg transition-all shadow-2xl shadow-indigo-600/30">
              Start Scraping Now
            </Link>
            <a href="#features" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[24px] font-bold text-lg transition-all backdrop-blur-sm">
              View Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-40 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Live Scraping</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Real-time connection to global job markets. Get the latest roles before they hit major boards.
              </p>
            </div>
            
            <div className="group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Intelligent Data</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Clean, structured data for every job. Salary estimates, location analysis, and company insights.
              </p>
            </div>
            
            <div className="group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Export Tools</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Generate professional reports and export your findings to PDF or CSV for easy tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-48 px-6 text-center bg-slate-950/50 border-t border-white/5">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight">
          Experience the <br />
          Pro Advantage.
        </h2>
        <Link href="/dashboard" className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-bold text-2xl transition-all shadow-2xl shadow-indigo-600/40">
          Open Dashboard
        </Link>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center bg-slate-950/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.6em] opacity-40 mb-8">
            Precision Intelligence System • v1.0.0
          </p>
          
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
          
          <div className="text-slate-500 text-sm font-medium">
            <p>Developed by <span className="text-white font-bold">Syed Ali Kazmi</span></p>
            <p className="mt-2 opacity-60">© 2026 AI Job Scraper Pro — Global Talent Intelligence Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
