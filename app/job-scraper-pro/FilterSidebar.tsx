"use client";
import type { FilterState } from "./types";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const EXP_LEVELS = ["All", "Intern", "Junior", "Mid", "Senior", "Lead"];
const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "relevance", label: "Most Relevant" },
  { value: "salary",    label: "Highest Salary" },
];

export default function FilterSidebar({ filters, onChange, totalCount, filteredCount }: Props) {
  function set<K extends keyof FilterState>(key: K, val: FilterState[K]) {
    onChange({ ...filters, [key]: val });
  }

  return (
    <aside className="glass-card p-5 flex flex-col gap-5 h-fit sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z"/>
          </svg>
          Filters
        </h3>
        <span className="text-xs text-slate-500">{filteredCount}/{totalCount}</span>
      </div>

      <div className="divider" />

      {/* Remote toggle */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Job Type</label>
        <button
          onClick={() => set("remoteOnly", !filters.remoteOnly)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            filters.remoteOnly
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
            </svg>
            Remote Only
          </span>
          {/* Toggle pill */}
          <div className={`w-8 h-4 rounded-full transition-all relative ${filters.remoteOnly ? "bg-emerald-500" : "bg-white/10"}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${filters.remoteOnly ? "left-4" : "left-0.5"}`} />
          </div>
        </button>
      </div>

      {/* Experience level */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Experience Level</label>
        <div className="flex flex-col gap-1.5">
          {EXP_LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => set("experienceLevel", lvl)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                filters.experienceLevel === lvl
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/4"
              }`}
            >
              {lvl === "All" ? "All Levels" : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Sort by */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Sort By</label>
        <div className="flex flex-col gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("sortBy", opt.value as FilterState["sortBy"])}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                filters.sortBy === opt.value
                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/4"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ remoteOnly: false, experienceLevel: "All", sortBy: "newest" })}
        className="btn-secondary text-xs py-2 w-full mt-1"
      >
        Reset Filters
      </button>
    </aside>
  );
}
