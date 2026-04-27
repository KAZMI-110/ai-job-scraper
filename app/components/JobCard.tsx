import React from 'react';
import { Job } from '@/app/types/job';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const isHighMatch = job.matchScore !== undefined && job.matchScore >= 80;
  const isMediumMatch = job.matchScore !== undefined && job.matchScore >= 50 && job.matchScore < 80;

  return (
    <div className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-300 flex flex-col h-full">
      {/* Match Badge */}
      {job.matchScore !== undefined && (
        <div className="flex items-center justify-between mb-6">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isHighMatch ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
            isMediumMatch ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            {job.matchScore}% Relevance
          </div>
          {isHighMatch && (
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}
        </div>
      )}

      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
            {job.company}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[11px] text-slate-300 font-medium">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[11px] text-slate-400 font-medium">
            {job.source}
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-8">
          {job.description}
        </p>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Estimated Salary</p>
          <p className="text-sm text-white font-bold">{job.salary}</p>
        </div>
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          View Details
          <svg className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default JobCard;
