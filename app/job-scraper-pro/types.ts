export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  countryCode: string;
  jobType: "Remote" | "Hybrid" | "On-site";
  experienceLevel: "Intern" | "Junior" | "Mid" | "Senior" | "Lead";
  salary: string;
  tags: string[];
  postedDate: string;
  postedDaysAgo: number;
}

export interface AIAnalysis {
  topSkills: string[];
  marketDemand: "High" | "Medium" | "Low";
  competitionLevel: "Low" | "Medium" | "High";
  avgSalary: string;
  careerRoadmap: string[];
  countryInsight: string;
}

export interface SearchParams {
  jobTitle: string;
  country: string;
  countryCode: string;
  city: string;
}

export interface SearchHistoryItem {
  id: string;
  jobTitle: string;
  country: string;
  countryCode: string;
  city: string;
  timestamp: string;
  resultCount: number;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export interface ProScrapeResponse {
  jobs: JobListing[];
  analysis: AIAnalysis;
  searchParams: SearchParams;
  totalCount: number;
}

export interface FilterState {
  remoteOnly: boolean;
  experienceLevel: string;
  sortBy: "newest" | "relevance" | "salary";
}
