import { NextRequest, NextResponse } from "next/server";
import {
  COUNTRIES, COUNTRY_DATA,
  getTitleVariants, getTagsForRole, getAnalysis,
} from "./data";
import type { JobListing, AIAnalysis, ProScrapeResponse } from "../../job-scraper-pro/types";

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

      jobs.push({
        id: `job-${countryCode}-${id++}`,
        title,
        company: cd.companies[ci],
        location,
        country: countryName,
        countryCode,
        jobType,
        experienceLevel: expLevel,
        salary,
        tags,
        postedDate: postedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        postedDaysAgo: daysAgo,
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

    // Simulate realistic API delay
    await new Promise((r) => setTimeout(r, 700));

    const selectedCity = city && city !== "All Cities" ? city : undefined;
    const jobs = generateJobs(jobTitle.trim(), countryCode, selectedCity);
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
