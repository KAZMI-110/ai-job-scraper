export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: "Remote" | "Hybrid" | "On-site";
  salary: string;
  description: string;
  timestamp: string;
  tags: string[];
}

export interface AIAnalysis {
  requiredSkills: string[];
  marketDemand: "High" | "Medium" | "Low";
  careerAdvice: string;
  learningRoadmap: string[];
}

export interface ScrapeResponse {
  jobs: JobListing[];
  analysis: AIAnalysis;
  searchQuery: string;
}
