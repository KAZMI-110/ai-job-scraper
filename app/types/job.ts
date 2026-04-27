export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string;
  postedAt: string;
  source: "JSearch" | "Adzuna";
  matchScore?: number;
}

export interface JobApiResponse {
  jobs: Job[];
  totalCount: number;
  error?: string;
}

export interface SkillMatch {
  skill: string;
  found: boolean;
}
