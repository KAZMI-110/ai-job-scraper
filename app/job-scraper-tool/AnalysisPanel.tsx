"use client";
import { AIAnalysis } from "./types";

const demandClass: Record<string, string> = {
  High: "badge-demand-high",
  Medium: "badge-demand-medium",
  Low: "badge-demand-low",
};

const demandDesc: Record<string, string> = {
  High: "Strong hiring activity — great time to enter this field.",
  Medium: "Steady demand with selective hiring — specialisation helps.",
  Low: "Niche or saturated market — differentiation is critical.",
};

export default function AnalysisPanel({ analysis, query }: { analysis: AIAnalysis; query: string }) {
  return (
    <section className="mt-10 fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-700 text-slate-100">AI Career Analysis</h2>
          <p className="text-sm text-slate-500">Insights for <span className="text-violet-400">{query}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skills */}
        <div className="glass-card p-6 fade-up-delay-1">
          <h3 className="text-sm font-600 text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.requiredSkills.map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

        {/* Market demand */}
        <div className="glass-card p-6 fade-up-delay-2">
          <h3 className="text-sm font-600 text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
            Market Demand
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <span className={`badge text-sm px-3 py-1 ${demandClass[analysis.marketDemand]}`}>
              {analysis.marketDemand}
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{demandDesc[analysis.marketDemand]}</p>

          {/* Demand bar */}
          <div className="mt-4">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: analysis.marketDemand === "High" ? "85%" : analysis.marketDemand === "Medium" ? "55%" : "25%",
                  background: analysis.marketDemand === "High" ? "#10b981" : analysis.marketDemand === "Medium" ? "#f59e0b" : "#ef4444",
                }}
              />
            </div>
          </div>
        </div>

        {/* Career advice */}
        <div className="glass-card p-6 fade-up-delay-3">
          <h3 className="text-sm font-600 text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Career Advice
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">{analysis.careerAdvice}</p>
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass-card p-6 mt-5 fade-up-delay-4">
        <h3 className="text-sm font-600 text-slate-300 uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          Learning Roadmap
        </h3>
        <div className="flex flex-col gap-3">
          {analysis.learningRoadmap.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-700 text-violet-400">
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
