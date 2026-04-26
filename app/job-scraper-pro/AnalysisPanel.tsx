"use client";
import type { AIAnalysis } from "./types";

const demandColour: Record<string, string> = {
  High: "badge-demand-high", Medium: "badge-demand-medium", Low: "badge-demand-low",
};
const competitionColour: Record<string, string> = {
  Low: "text-green-400 bg-green-500/10 border-green-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  High: "text-red-400 bg-red-500/10 border-red-500/20",
};
const demandPct: Record<string, string> = { High: "85%", Medium: "55%", Low: "28%" };
const demandBg: Record<string, string> = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };

interface Props { analysis: AIAnalysis; query: string; country: string; }

export default function ProAnalysisPanel({ analysis, query, country }: Props) {
  return (
    <section className="mt-10 space-y-5 fade-up">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">AI Career Analysis</h2>
          <p className="text-xs text-slate-500">
            <span className="text-violet-400">{query}</span> · <span className="text-cyan-400">{country}</span>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Market demand */}
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Market Demand</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`badge px-3 py-1 ${demandColour[analysis.marketDemand]}`}>{analysis.marketDemand}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: demandPct[analysis.marketDemand], background: demandBg[analysis.marketDemand], transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Competition */}
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Competition</p>
          <span className={`badge border px-3 py-1 ${competitionColour[analysis.competitionLevel]}`}>
            {analysis.competitionLevel} Competition
          </span>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            {analysis.competitionLevel === "Low" && "Great time to enter — few applicants per role."}
            {analysis.competitionLevel === "Medium" && "Moderate competition — differentiation is key."}
            {analysis.competitionLevel === "High" && "Highly competitive — a strong portfolio is essential."}
          </p>
        </div>

        {/* Avg salary */}
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Avg. Salary (Mid)</p>
          <p className="text-lg font-bold text-emerald-400">{analysis.avgSalary}</p>
          <p className="text-xs text-slate-500 mt-1">Based on mid-level benchmark</p>
        </div>
      </div>

      {/* Skills + Roadmap row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top skills */}
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Top Required Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.topSkills.map((s) => <span key={s} className="skill-pill">{s}</span>)}
          </div>
        </div>

        {/* Country insight */}
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Country Insight — {country}
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">{analysis.countryInsight}</p>
        </div>
      </div>

      {/* Learning roadmap */}
      <div className="glass-card p-5">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Learning Roadmap
        </p>
        <div className="flex flex-col gap-3">
          {analysis.careerRoadmap.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-xs font-bold text-violet-400">
                {i + 1}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
