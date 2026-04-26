"use client";
import { useState } from "react";
import type { JobListing } from "./types";

interface Props {
  job: JobListing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

const typeStyle: Record<string, string> = {
  Remote: "badge-remote",
  Hybrid: "badge-hybrid",
  "On-site": "badge-onsite",
};
const expStyle: Record<string, string> = {
  Intern: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Junior: "bg-green-500/10 text-green-400 border-green-500/20",
  Mid:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Senior: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Lead:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function ProJobCard({ job, isSaved, onToggleSave }: Props) {
  const [copied, setCopied] = useState(false);

  function copyDetails() {
    const text = `${job.title} @ ${job.company}\nLocation: ${job.location}\nType: ${job.jobType} | Level: ${job.experienceLevel}\nSalary: ${job.salary}\nPosted: ${job.postedDate}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-3 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 leading-snug truncate">{job.title}</h3>
          <p className="text-xs text-violet-400 font-medium mt-0.5 truncate">{job.company}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleSave(job.id)}
            title={isSaved ? "Unsave" : "Save job"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isSaved ? "text-amber-400 bg-amber-500/15" : "text-slate-600 hover:text-amber-400 hover:bg-amber-500/10"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
          <button
            onClick={copyDetails}
            title="Copy details"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            {copied
              ? <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`badge ${typeStyle[job.jobType]}`}>{job.jobType}</span>
        <span className={`badge border ${expStyle[job.experienceLevel]}`}>{job.experienceLevel}</span>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1 truncate">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          <span className="truncate">{job.location}</span>
        </span>
        <span className="flex items-center gap-1 truncate">
          <svg className="w-3 h-3 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
          <span className="truncate text-emerald-400/80">{job.salary}</span>
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {job.tags.slice(0, 4).map((t) => (
          <span key={t} className="skill-pill text-[10px] px-2 py-0.5">{t}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-[10px] text-slate-600 flex items-center gap-1">
          <span className="pulse-dot w-1.5 h-1.5" />
          {job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}
        </span>
        <button className="text-[10px] text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Apply Now →
        </button>
      </div>
    </div>
  );
}
