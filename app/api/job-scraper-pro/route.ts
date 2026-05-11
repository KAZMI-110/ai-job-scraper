import { NextRequest, NextResponse } from "next/server";
import {
  COUNTRIES, COUNTRY_DATA,
  getTitleVariants, getTagsForRole, getAnalysis,
} from "./data";
import type { JobListing, AIAnalysis, ProScrapeResponse } from "../../job-scraper-pro/types";

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY ?? "";

const EXP_LEVELS: JobListing["experienceLevel"][] = ["Intern","Junior","Mid","Senior","Lead"];
const JOB_TYPES: JobListing["jobType"][] = ["Remote","Hybrid","On-site"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// ── Job search platforms to rotate for fallback apply links ──────────────
const APPLY_PLATFORMS = [
  (title: string, company: string, location: string) =>
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}&location=${encodeURIComponent(location)}`,
  (title: string, company: string, location: string) =>
    `https://www.indeed.com/jobs?q=${encodeURIComponent(`${title} ${company}`)}&l=${encodeURIComponent(location)}`,
  (title: string, company: string, location: string) =>
    `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(`${title} ${company}`)}&locKeyword=${encodeURIComponent(location)}`,
  (title: string, company: string, _location: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${company} ${title} careers apply`)}&ibp=htl;jobs`,
];

// ── Try to fetch real jobs from JSearch API ──────────────────────────────
async function fetchRealJobs(
  jobTitle: string, 
  countryCode: string, 
  selectedCity?: string
): Promise<JobListing[]> {
  if (!JSEARCH_API_KEY) return [];

  const country = COUNTRIES.find((c) => c.code === countryCode);
  const countryName = country?.name ?? "United States";
  const locationStr = selectedCity && selectedCity !== "All Cities"
    ? `${selectedCity}, ${countryName}` 
    : countryName;

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      `${jobTitle} in ${locationStr}`
    )}&page=1&num_pages=2&date_posted=all`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.data || !Array.isArray(data.data)) return [];

    const allTags = getTagsForRole(jobTitle);

    return data.data.map((job: Record<string, unknown>, i: number) => {
      const title = String(job.job_title ?? jobTitle);
      const expLevel = guessExpLevel(title);
      const jobType = guessJobType(job);
      const daysAgo = job.job_posted_at_datetime_utc
        ? Math.floor((Date.now() - new Date(job.job_posted_at_datetime_utc as string).getTime()) / 86400000)
        : rand(0, 14);

      return {
        id: String(job.job_id ?? `live-${i}`),
        title,
        company: String(job.employer_name ?? "Unknown Company"),
        location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || locationStr,
        country: countryName,
        countryCode,
        jobType,
        experienceLevel: expLevel,
        salary: job.job_min_salary
          ? `$ ${Number(job.job_min_salary).toLocaleString()} – ${Number(job.job_max_salary).toLocaleString()} / yr`
          : "Competitive Salary",
        tags: allTags.sort(() => 0.5 - Math.random()).slice(0, rand(3, 5)),
        postedDate: job.job_posted_at_datetime_utc
          ? new Date(job.job_posted_at_datetime_utc as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        postedDaysAgo: daysAgo,
        applyUrl: String(job.job_apply_link ?? job.job_google_link ?? "#"),
      } as JobListing;
    });
  } catch (err) {
    console.error("JSearch Pro error:", err);
    return [];
  }
}

// ── Try to fetch from Remotive (free, no key) ──────────────────────────────
async function fetchRemotiveJobs(jobTitle: string, countryCode: string): Promise<JobListing[]> {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(jobTitle)}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.jobs || !Array.isArray(data.jobs)) return [];

    const country = COUNTRIES.find((c) => c.code === countryCode);
    const countryName = country?.name ?? "Remote";
    const allTags = getTagsForRole(jobTitle);

    return data.jobs.map((job: Record<string, unknown>, i: number) => {
      const title = String(job.title ?? jobTitle);
      const daysAgo = job.publication_date
        ? Math.floor((Date.now() - new Date(job.publication_date as string).getTime()) / 86400000)
        : rand(0, 14);

      return {
        id: String(job.id ?? `remotive-${i}`),
        title,
        company: String(job.company_name ?? "Unknown Company"),
        location: String(job.candidate_required_location ?? "Worldwide Remote"),
        country: countryName,
        countryCode,
        jobType: "Remote" as const,
        experienceLevel: guessExpLevel(title),
        salary: job.salary ? String(job.salary) : "Competitive Salary",
        tags: allTags.sort(() => 0.5 - Math.random()).slice(0, rand(3, 5)),
        postedDate: job.publication_date
          ? new Date(job.publication_date as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        postedDaysAgo: daysAgo,
        applyUrl: String(job.url ?? "#"),
      } as JobListing;
    });
  } catch (err) {
    console.error("Remotive Pro error:", err);
    return [];
  }
}

function guessExpLevel(title: string): JobListing["experienceLevel"] {
  const t = title.toLowerCase();
  if (t.includes("intern")) return "Intern";
  if (t.includes("junior") || t.includes("jr") || t.includes("entry")) return "Junior";
  if (t.includes("senior") || t.includes("sr") || t.includes("staff")) return "Senior";
  if (t.includes("lead") || t.includes("principal") || t.includes("director")) return "Lead";
  return "Mid";
}

function guessJobType(job: Record<string, unknown>): JobListing["jobType"] {
  const remote = job.job_is_remote;
  if (remote === true) return "Remote";
  const title = String(job.job_title ?? "").toLowerCase();
  const desc = String(job.job_description ?? "").toLowerCase().substring(0, 500);
  if (title.includes("remote") || desc.includes("fully remote")) return "Remote";
  if (desc.includes("hybrid")) return "Hybrid";
  return "On-site";
}

// ── Fallback: generate demo jobs with real apply links ──────────────────────
function generateJobs(jobTitle: string, countryCode: string, selectedCity?: string): JobListing[] {
  const cd = COUNTRY_DATA[countryCode] ?? COUNTRY_DATA["US"];
  const titleVariants = getTitleVariants(jobTitle);
  const allTags = getTagsForRole(jobTitle);
  const jobs: JobListing[] = [];
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const countryName = country?.name ?? countryCode;

  const typeWeights =
    countryCode === "REMOTE"
      ? [1, 0, 0]
      : [0.35, 0.40, 0.25];

  let id = 0;
  for (let ci = 0; ci < cd.companies.length; ci++) {
    for (let ei = 0; ei < EXP_LEVELS.length; ei++) {
      const expLevel = EXP_LEVELS[ei];

      // Weighted job type selection
      const typeRoll = Math.random();
      const jobType: JobListing["jobType"] =
        typeRoll < typeWeights[0] ? "Remote" :
        typeRoll < typeWeights[0] + typeWeights[1] ? "Hybrid" : "On-site";

      const titleVariant = seededPick(titleVariants, ci + ei);
      const prefix = expLevel === "Intern" ? "Intern – " :
                     expLevel === "Lead"   ? "Lead "    : "";
      const title = prefix
        ? `${prefix}${titleVariant}`
        : `${expLevel === "Mid" ? "" : expLevel + " "}${titleVariant}`.trim();

      // Salary scaled by experience
      const multiplier = { Intern: 0.4, Junior: 0.6, Mid: 0.85, Senior: 1.1, Lead: 1.35 }[expLevel] ?? 1;
      const salMin = Math.round(cd.salaryMin * multiplier / 1000) * 1000;
      const salMax = Math.round(cd.salaryMax * multiplier / 1000) * 1000;
      const salary = `${cd.symbol} ${salMin.toLocaleString()} – ${salMax.toLocaleString()} ${cd.salaryUnit}`;

      const daysAgo = rand(0, 28);
      const postedDate = new Date();
      postedDate.setDate(postedDate.getDate() - daysAgo);

      // Random 3-5 tags from pool
      const shuffled = [...allTags].sort(() => 0.5 - Math.random());
      const tags = shuffled.slice(0, rand(3, 5));

      // Use selected city if specified, else round-robin across all cities
      const cityName = (selectedCity && selectedCity !== "All Cities")
        ? selectedCity
        : seededPick(cd.cities, ci);
      const location = countryCode === "REMOTE" ? "Worldwide Remote" : `${cityName}, ${countryName}`;

      const company = cd.companies[ci];

      // Rotate between different real job platforms for apply URLs
      const platformIdx = (ci + ei) % APPLY_PLATFORMS.length;
      const platformFn = APPLY_PLATFORMS[platformIdx];
      const applyUrl = platformFn(title, company, countryCode === "REMOTE" ? "Remote" : `${cityName}, ${countryName}`);

      jobs.push({
        id: `job-${countryCode}-${id++}`,
        title,
        company,
        location,
        country: countryName,
        countryCode,
        jobType,
        experienceLevel: expLevel,
        salary,
        tags,
        postedDate: postedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        postedDaysAgo: daysAgo,
        applyUrl,
      });
    }
  }

  // Shuffle so results don't look sorted by company
  return jobs.sort(() => 0.5 - Math.random()).slice(0, 120);
}

function buildAnalysis(jobTitle: string, countryCode: string, city?: string): AIAnalysis {
  const cd = COUNTRY_DATA[countryCode] ?? COUNTRY_DATA["US"];
  const base = getAnalysis(jobTitle);
  const allTags = getTagsForRole(jobTitle);

  // Salary benchmark (mid-level)
  const mid = Math.round((cd.salaryMin + cd.salaryMax) / 2);
  const avgSalary = `${cd.symbol} ${mid.toLocaleString()} ${cd.salaryUnit}`;

  return {
    topSkills: base.topSkills,
    marketDemand: base.marketDemand,
    competitionLevel: base.competitionLevel,
    avgSalary,
    careerRoadmap: base.careerRoadmap,
    countryInsight: cd.insight,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, countryCode, city } = body as { jobTitle: string; countryCode: string; city?: string };

    if (!jobTitle?.trim() || jobTitle.trim().length < 2)
      return NextResponse.json({ error: "Please enter a valid job title." }, { status: 400 });

    if (!countryCode || !COUNTRY_DATA[countryCode])
      return NextResponse.json({ error: "Please select a valid country." }, { status: 400 });

    const selectedCity = city && city !== "All Cities" ? city : undefined;

    // Try real APIs first (JSearch + Remotive in parallel)
    const [realJobs, remotiveJobs] = await Promise.all([
      fetchRealJobs(jobTitle.trim(), countryCode, selectedCity),
      fetchRemotiveJobs(jobTitle.trim(), countryCode),
    ]);

    const allLiveJobs = [...realJobs, ...remotiveJobs];

    let jobs: JobListing[];
    if (allLiveJobs.length > 5) {
      // Use real data — we have enough
      jobs = allLiveJobs.slice(0, 120);
    } else {
      // Simulate slight processing delay for demo data (realistic feel)
      await new Promise((r) => setTimeout(r, 700));
      // Mix any live results with fallback data
      const fallbackJobs = generateJobs(jobTitle.trim(), countryCode, selectedCity);
      jobs = [...allLiveJobs, ...fallbackJobs].slice(0, 120);
    }

    const analysis = buildAnalysis(jobTitle.trim(), countryCode, selectedCity);
    const country = COUNTRIES.find((c) => c.code === countryCode);

    const response: ProScrapeResponse = {
      jobs,
      analysis,
      searchParams: {
        jobTitle: jobTitle.trim(),
        country: country?.name ?? countryCode,
        countryCode,
        city: city ?? "All Cities",
      },
      totalCount: jobs.length,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}
