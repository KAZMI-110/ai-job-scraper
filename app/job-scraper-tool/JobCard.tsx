"use client";
import { JobListing } from "./types";

function typeBadge(type: JobListing["jobType"]) {
  const map = {
    Remote: "badge badge-remote",
    Hybrid: "badge badge-hybrid",
    "On-site": "badge badge-onsite",
  };
  return map[type];
}

export default function JobCard({ job, index }: { job: JobListing; index: number }) {
  const delays = ["fade-up", "fade-up-delay-1", "fade-up-delay-2", "fade-up-delay-3", "fade-up-delay-4"];
  return (
    <div className={`glass-card p-6 flex flex-col gap-4 ${delays[index] ?? "fade-up"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-700 text-slate-100 leading-tight">{job.title}</h3>
          <p className="text-sm text-violet-400 font-600 mt-0.5">{job.company}</p>
        </div>
        <span className={typeBadge(job.jobType)}>{job.jobType}</span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.salary}
        </span>
      </div>

      <div className="divider" />

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed">{job.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span key={tag} className="skill-pill">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-slate-600 flex items-center gap-1.5">
          <span className="pulse-dot" />
          {job.timestamp}
        </span>
        <button className="text-xs text-violet-400 hover:text-violet-300 font-500 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
}
