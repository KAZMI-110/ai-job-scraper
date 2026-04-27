import { Job } from "@/app/types/job";
import {
  COUNTRIES, COUNTRY_DATA,
  getTitleVariants, getTagsForRole,
} from "@/app/api/job-scraper-pro/data";

// ── Server-side only env vars (no NEXT_PUBLIC_ prefix) ─────────────────────
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY ?? "";
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID ?? "";
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY ?? "";

// ── Skill bank for matching ─────────────────────────────────────────────────
const COMMON_SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
  "C++", "C#", "Go", "Rust", "Tailwind", "CSS", "HTML", "SQL", "NoSQL",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
  "Azure", "GCP", "Git", "REST API", "GraphQL", "REST APIs", "gRPC",
  "Ruby", "PHP", "Laravel", "Swift", "Kotlin", "Flutter", "React Native",
  "Machine Learning", "TensorFlow", "PyTorch", "AI", "Data Analysis", "Pandas",
  "NumPy", "Scikit-learn", "NLP", "Deep Learning", "MLOps", "CI/CD",
  "Agile", "Scrum", "Linux", "Bash", "Terraform", "Ansible", "Prometheus",
  "Figma", "Jira", "Firebase", "Stripe", "Webpack", "Vite", "Jest",
];

// ── JSearch (RapidAPI) ──────────────────────────────────────────────────────
async function fetchFromJSearch(
  query: string,
  location: string,
  page: number
): Promise<Job[]> {
  if (!JSEARCH_API_KEY) return [];

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
    `${query} in ${location}`
  )}&page=${page}&num_pages=1&date_posted=all`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`JSearch HTTP ${res.status}:`, await res.text());
      return [];
    }

    const data = await res.json();
    if (!data?.data || !Array.isArray(data.data)) return [];

    return data.data.map((job: Record<string, unknown>) => ({
      id: String(job.job_id ?? Math.random()),
      title: String(job.job_title ?? ""),
      company: String(job.employer_name ?? "Unknown Company"),
      location: [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(", "),
      description: String(job.job_description ?? ""),
      url: String(job.job_apply_link ?? "#"),
      salary: job.job_min_salary
        ? `${job.job_salary_currency ?? "$"} ${Number(job.job_min_salary).toLocaleString()} – ${Number(job.job_max_salary).toLocaleString()} / yr`
        : "Salary not disclosed",
      postedAt: job.job_posted_at_datetime_utc
        ? new Date(job.job_posted_at_datetime_utc as string).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently",
      source: "JSearch" as const,
    }));
  } catch (err) {
    console.error("JSearch fetch error:", err);
    return [];
  }
}

// ── Adzuna ──────────────────────────────────────────────────────────────────
const ADZUNA_COUNTRY_MAP: Record<string, string> = {
  "united states": "us", "us": "us", "usa": "us",
  "united kingdom": "gb", "uk": "gb", "gb": "gb",
  "canada": "ca", "ca": "ca",
  "australia": "au", "au": "au",
  "germany": "de", "de": "de",
  "india": "in", "in": "in",
  "singapore": "sg", "sg": "sg",
  "netherlands": "nl", "nl": "nl",
  "sweden": "se", "se": "se",
  "france": "fr", "fr": "fr",
  "italy": "it", "it": "it",
  "spain": "es", "es": "es",
  "brazil": "br", "br": "br",
  "mexico": "mx", "mx": "mx",
  "south africa": "za", "za": "za",
  "russia": "ru", "ru": "ru",
  "austria": "at", "at": "at",
  "belgium": "be", "be": "be",
  "switzerland": "ch", "ch": "ch",
  "poland": "pl", "pl": "pl",
  "new zealand": "nz", "nz": "nz",
};

function getAdzunaCountry(location: string): string {
  const lower = location.toLowerCase();
  for (const [key, code] of Object.entries(ADZUNA_COUNTRY_MAP)) {
    if (lower.includes(key)) return code;
  }
  return "us";
}

async function fetchFromAdzuna(
  query: string,
  location: string,
  page: number
): Promise<Job[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];

  const country = getAdzunaCountry(location);
  const url =
    `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}` +
    `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
    `&results_per_page=10&what=${encodeURIComponent(query)}` +
    `&where=${encodeURIComponent(location)}&content-type=application/json`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Adzuna HTTP ${res.status}:`, await res.text());
      return [];
    }

    const data = await res.json();
    if (!data?.results || !Array.isArray(data.results)) return [];

    return data.results.map((job: Record<string, unknown>) => {
      const company = job.company as Record<string, unknown> | undefined;
      const loc = job.location as Record<string, unknown> | undefined;
      return {
        id: String(job.id ?? Math.random()),
        title: String(job.title ?? ""),
        company: String(company?.display_name ?? "Unknown Company"),
        location: String(loc?.display_name ?? location),
        description: String(job.description ?? ""),
        url: String(job.redirect_url ?? "#"),
        salary:
          job.salary_min
            ? `${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()} / yr`
            : "Salary not disclosed",
        postedAt: job.created
          ? new Date(job.created as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        source: "Adzuna" as const,
      };
    });
  } catch (err) {
    console.error("Adzuna fetch error:", err);
    return [];
  }
}

// ── Fallback: Generate realistic demo jobs from local data ──────────────────
// Used when no API keys are configured — keeps the UI fully functional.
const DESCRIPTIONS: Record<string, string> = {
  frontend: `We are looking for a passionate Frontend Developer to join our engineering team. You will build responsive, high-performance web interfaces using React and TypeScript, collaborate with designers to implement pixel-perfect UI components, and optimize page load performance. Experience with Next.js, Tailwind CSS, and modern CI/CD pipelines is a strong plus. You'll work in an Agile environment with 2-week sprints and daily standups.`,
  backend: `We are hiring an experienced Backend Engineer to design and implement scalable RESTful APIs and microservices. You will work with Node.js or Python, manage PostgreSQL and MongoDB databases, and deploy containerized services on AWS using Docker and Kubernetes. Strong understanding of system design, caching strategies (Redis), and authentication (JWT/OAuth2) is required.`,
  fullstack: `Join our product engineering team as a Full Stack Developer. You will own features end-to-end — from database schema design and API development to React UI implementation. Our stack is Next.js, Node.js, PostgreSQL, and Docker deployed on AWS. We value clean code, automated testing, and developer-driven culture.`,
  data: `We are seeking a Data Scientist to extract insights from large datasets and build predictive models. You'll use Python (Pandas, NumPy, Scikit-learn) and SQL to analyse user behaviour, revenue trends, and operational metrics. Experience with TensorFlow or PyTorch and data visualization tools (Tableau, Looker) is highly desirable.`,
  ml: `Looking for an ML Engineer to build, train, and deploy machine learning models at scale. You will work with PyTorch and TensorFlow, manage experiment tracking via MLflow, and deploy models using Docker/Kubernetes on cloud infrastructure. Familiarity with large language models (LLMs), RAG pipelines, and HuggingFace is a major advantage.`,
  devops: `We need a DevOps / Platform Engineer to own our cloud infrastructure. Responsibilities include managing Kubernetes clusters, building CI/CD pipelines with GitHub Actions, writing Terraform IaC for AWS, and setting up observability stacks (Prometheus, Grafana, Loki). Strong Linux/Bash skills and security mindset required.`,
  mobile: `We are looking for a Mobile Developer to build and maintain our cross-platform app using React Native or Flutter. You will integrate REST APIs, implement offline-first storage, and publish to both App Store and Google Play. Experience with Firebase, push notifications, and app performance profiling is essential.`,
  default: `We are looking for a talented and motivated professional to join our growing team. You will collaborate with cross-functional teams, contribute to product development, and help drive our technical strategy forward. Strong communication skills, a growth mindset, and passion for building great products are key traits we value.`,
};

function getDescription(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("front")) return DESCRIPTIONS.frontend;
  if (t.includes("back") || t.includes("node") || t.includes("python")) return DESCRIPTIONS.backend;
  if (t.includes("full")) return DESCRIPTIONS.fullstack;
  if (t.includes("data sci")) return DESCRIPTIONS.data;
  if (t.includes("machine") || t.includes("ml ") || t.includes("ai eng")) return DESCRIPTIONS.ml;
  if (t.includes("devops") || t.includes("cloud") || t.includes("sre")) return DESCRIPTIONS.devops;
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("flutter")) return DESCRIPTIONS.mobile;
  return DESCRIPTIONS.default;
}

function generateFallbackJobs(
  jobTitle: string,
  location: string,
  page: number
): Job[] {
  // Resolve country code from location string
  const lower = location.toLowerCase();
  let countryCode = "US";
  for (const c of COUNTRIES) {
    if (lower.includes(c.name.toLowerCase()) || lower.includes(c.code.toLowerCase())) {
      countryCode = c.code;
      break;
    }
  }

  const cd = COUNTRY_DATA[countryCode] ?? COUNTRY_DATA["US"];
  const titleVariants = getTitleVariants(jobTitle);
  const tags = getTagsForRole(jobTitle);
  const expLevels = ["Junior", "Mid-Level", "Senior", "Lead"] as const;
  const jobTypes = ["Remote", "Hybrid", "On-site"] as const;
  const jobs: Job[] = [];

  const startIdx = (page - 1) * 10;
  const endIdx = startIdx + 10;

  // Generate 40 total, slice to page
  for (let i = 0; i < 40; i++) {
    const company = cd.companies[i % cd.companies.length];
    const expLevel = expLevels[i % expLevels.length];
    const jobType = jobTypes[i % jobTypes.length];
    const titleBase = titleVariants[i % titleVariants.length];
    const title = expLevel === "Lead" ? `Lead ${titleBase}` : `${expLevel} ${titleBase}`;
    const city = cd.cities[i % cd.cities.length];

    const multiplier =
      expLevel === "Junior" ? 0.65 :
      expLevel === "Mid-Level" ? 0.85 :
      expLevel === "Senior" ? 1.1 : 1.35;

    const salMin = Math.round((cd.salaryMin * multiplier) / 1000) * 1000;
    const salMax = Math.round((cd.salaryMax * multiplier) / 1000) * 1000;

    const daysAgo = (i * 2) % 30;
    const posted = new Date();
    posted.setDate(posted.getDate() - daysAgo);

    const slug = `${company.toLowerCase().replace(/\s+/g, "-")}-${title.toLowerCase().replace(/\s+/g, "-")}-${i}`;

    jobs.push({
      id: `fallback-${slug}`,
      title,
      company,
      location: jobType === "Remote" ? "Remote / Worldwide" : `${city}`,
      description: `${getDescription(title)}\n\nKey skills required: ${tags.slice(0, 5).join(", ")}.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${company} ${title} job apply`)}`,
      salary: `${cd.symbol} ${salMin.toLocaleString()} – ${salMax.toLocaleString()} ${cd.salaryUnit}`,
      postedAt: posted.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      source: "JSearch",
    });
  }

  return jobs.slice(startIdx, endIdx);
}

// ── Public API ──────────────────────────────────────────────────────────────
export async function fetchJobs(
  query: string,
  location: string = "United States",
  page: number = 1
): Promise<{ jobs: Job[]; source: "live" | "demo" }> {
  // Try live APIs first
  const jSearchJobs = await fetchFromJSearch(query, location, page);
  if (jSearchJobs.length > 0) return { jobs: jSearchJobs, source: "live" };

  const adzunaJobs = await fetchFromAdzuna(query, location, page);
  if (adzunaJobs.length > 0) return { jobs: adzunaJobs, source: "live" };

  // No API keys configured → use local data engine as demo
  const fallback = generateFallbackJobs(query, location, page);
  return { jobs: fallback, source: "demo" };
}

// ── Skill utilities ─────────────────────────────────────────────────────────
export function extractSkills(text: string): string[] {
  const found = new Set<string>();
  COMMON_SKILLS.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(text)) found.add(skill);
  });
  return Array.from(found);
}

export function calculateMatchScore(jobDesc: string, userSkills: string[]): number {
  if (!userSkills.length) return 0;
  const jobSkills = extractSkills(jobDesc);
  if (!jobSkills.length) return Math.min(userSkills.length * 5, 40); // partial credit
  const matched = userSkills.filter((s) =>
    jobSkills.some((j) => j.toLowerCase() === s.toLowerCase())
  );
  return Math.min(Math.round((matched.length / Math.max(jobSkills.length, 1)) * 100), 100);
}

export function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
