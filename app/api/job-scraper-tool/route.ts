import { NextRequest, NextResponse } from "next/server";

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

// ─── Static Data ─────────────────────────────────────────────────────────────

const JOB_DATABASE: Record<
  string,
  { companies: string[]; locations: string[]; salaries: string[]; tags: string[] }
> = {
  default: {
    companies: [
      "TechCorp Inc.", "DataFlow Ltd.", "CloudNine Systems", "InnovateTech", "NexGen Solutions",
      "Apex Digital", "Quantum Works", "Stellar AI", "FutureByte", "Orion Labs",
    ],
    locations: [
      "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "London, UK",
      "Toronto, Canada", "Berlin, Germany", "Singapore", "Dubai, UAE", "Sydney, Australia",
    ],
    salaries: [
      "$80,000 – $110,000", "$90,000 – $130,000", "$100,000 – $150,000",
      "$70,000 – $95,000", "$110,000 – $160,000",
    ],
    tags: ["Full-Time", "Benefits", "Equity", "401k", "Health Insurance"],
  },
};

const ANALYSIS_DATABASE: Record<string, AIAnalysis> = {
  "frontend developer": {
    requiredSkills: ["React", "TypeScript", "Next.js", "CSS/Tailwind", "REST APIs", "Git", "Testing (Jest/Cypress)"],
    marketDemand: "High",
    careerAdvice:
      "Frontend Development is one of the most in-demand skills in 2025. Focus on mastering React and TypeScript first, then explore Next.js for full-stack capabilities. Build a strong portfolio with 3–5 real-world projects and contribute to open-source.",
    learningRoadmap: [
      "HTML, CSS & JavaScript Fundamentals (1–2 months)",
      "React.js & Component Architecture (1–2 months)",
      "TypeScript Basics & Advanced Patterns (3–4 weeks)",
      "Next.js App Router & Server Components (3–4 weeks)",
      "State Management (Zustand / Redux) (2–3 weeks)",
      "Testing with Jest & Cypress (2 weeks)",
      "Deploy projects on Vercel & build portfolio",
    ],
  },
  "data scientist": {
    requiredSkills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow/PyTorch", "SQL", "Data Visualization", "Statistics"],
    marketDemand: "High",
    careerAdvice:
      "Data Science continues to be among the hottest fields. Start by mastering Python and statistics, then move into ML frameworks. Kaggle competitions and real datasets are your best practice ground. A strong GitHub and published notebooks are key to landing interviews.",
    learningRoadmap: [
      "Python Programming & OOP (1–2 months)",
      "Statistics & Probability Fundamentals (3–4 weeks)",
      "Pandas, NumPy & Data Wrangling (3–4 weeks)",
      "Machine Learning with Scikit-learn (1–2 months)",
      "Deep Learning with TensorFlow/PyTorch (1–2 months)",
      "SQL & Database Querying (2–3 weeks)",
      "Data Visualization (Matplotlib, Seaborn, Plotly)",
      "Kaggle competitions & capstone projects",
    ],
  },
  "backend developer": {
    requiredSkills: ["Node.js / Python / Java", "REST & GraphQL APIs", "SQL & NoSQL Databases", "Docker", "AWS/GCP/Azure", "Authentication (JWT/OAuth)", "Microservices"],
    marketDemand: "High",
    careerAdvice:
      "Backend development is the backbone of every application. Pick one language deeply (Node.js or Python are great starters), understand databases, and learn cloud deployment. Focus on system design concepts early — they're critical for senior roles.",
    learningRoadmap: [
      "Choose a language: Node.js or Python (1–2 months)",
      "RESTful API Design Principles (2–3 weeks)",
      "SQL (PostgreSQL) & NoSQL (MongoDB) (1 month)",
      "Authentication: JWT, OAuth 2.0 (2 weeks)",
      "Docker & Containerization (2–3 weeks)",
      "Cloud Deployment (AWS EC2, S3, Lambda) (1 month)",
      "System Design & Architecture Patterns",
    ],
  },
  "ui ux designer": {
    requiredSkills: ["Figma", "Prototyping", "User Research", "Design Systems", "Accessibility", "Adobe XD", "Wireframing"],
    marketDemand: "Medium",
    careerAdvice:
      "UX Design is growing as companies invest more in user experience. Master Figma first, build a portfolio with case studies (not just mockups — show your process). Understanding basic HTML/CSS gives you a major edge when collaborating with developers.",
    learningRoadmap: [
      "Design Fundamentals: Color, Typography, Layout (2–3 weeks)",
      "Figma Mastery: Components & Auto-Layout (1 month)",
      "User Research Methods & UX Writing (3–4 weeks)",
      "Prototyping & Usability Testing (2–3 weeks)",
      "Design Systems & Component Libraries (2–3 weeks)",
      "Accessibility (WCAG) Standards (1–2 weeks)",
      "Build 3–5 case study projects for portfolio",
    ],
  },
  "machine learning engineer": {
    requiredSkills: ["Python", "TensorFlow / PyTorch", "MLOps", "Docker/Kubernetes", "Feature Engineering", "Model Deployment", "SQL", "Cloud ML Platforms"],
    marketDemand: "High",
    careerAdvice:
      "ML Engineering blends data science with software engineering. Strong coding skills + ML theory = top-tier roles. Focus on building production-ready ML pipelines, not just model notebooks. Companies want engineers who can ship models, not just train them.",
    learningRoadmap: [
      "Python & Software Engineering Best Practices (1 month)",
      "Machine Learning Theory & Algorithms (1–2 months)",
      "Deep Learning: CNNs, RNNs, Transformers (2 months)",
      "MLOps: MLflow, DVC, Model Versioning (1 month)",
      "Docker & Kubernetes for ML (2–3 weeks)",
      "Cloud ML: AWS SageMaker / GCP Vertex AI (1 month)",
      "End-to-end ML project with deployment",
    ],
  },
  "devops engineer": {
    requiredSkills: ["Linux", "Docker & Kubernetes", "CI/CD Pipelines", "Terraform", "AWS/Azure/GCP", "Monitoring (Prometheus/Grafana)", "Bash Scripting"],
    marketDemand: "High",
    careerAdvice:
      "DevOps is essential at every tech company. Start with Linux fundamentals and Docker, then master Kubernetes. Cloud certifications (AWS/Azure) significantly boost your marketability. Focus on automation mindset — if you do it twice, script it.",
    learningRoadmap: [
      "Linux Fundamentals & Bash Scripting (1 month)",
      "Docker & Container Concepts (2–3 weeks)",
      "Kubernetes Orchestration (1–2 months)",
      "CI/CD: GitHub Actions, Jenkins (2–3 weeks)",
      "Infrastructure as Code: Terraform (3–4 weeks)",
      "Cloud Platform (AWS/Azure) Certification (2–3 months)",
      "Monitoring: Prometheus, Grafana, ELK Stack",
    ],
  },
  "full stack developer": {
    requiredSkills: ["React / Vue", "Node.js", "TypeScript", "PostgreSQL / MongoDB", "REST APIs", "Docker", "Git", "Next.js"],
    marketDemand: "High",
    careerAdvice:
      "Full Stack is highly versatile — you can work at startups as a one-person army or specialize later. Master the MERN or Next.js + PostgreSQL stack. Build complete projects end-to-end; employers love seeing you can own a feature from database to UI.",
    learningRoadmap: [
      "HTML, CSS, JavaScript Core (1–2 months)",
      "React.js & TypeScript (1–2 months)",
      "Node.js & Express APIs (1 month)",
      "Database: PostgreSQL & MongoDB (1 month)",
      "Next.js Full-Stack (App Router) (3–4 weeks)",
      "Authentication & Security (JWT, OAuth) (2 weeks)",
      "Docker & Deployment on Vercel/Railway (2 weeks)",
      "Build & deploy 2–3 full-stack projects",
    ],
  },
  "product manager": {
    requiredSkills: ["Product Strategy", "User Research", "Agile/Scrum", "Data Analysis", "Roadmapping", "Stakeholder Management", "SQL Basics", "A/B Testing"],
    marketDemand: "Medium",
    careerAdvice:
      "Product Management is highly competitive but very rewarding. Start by deeply understanding users and working closely with engineering. Build side projects to demonstrate product thinking. A technical background (even basic) is a huge differentiator.",
    learningRoadmap: [
      "Product Management Fundamentals (2–3 weeks)",
      "User Research & Customer Interviews (2–3 weeks)",
      "Agile & Scrum Methodologies (2 weeks)",
      "Data-Driven Decision Making & SQL (1 month)",
      "Roadmapping & Prioritization Frameworks (2 weeks)",
      "A/B Testing & Experimentation (2 weeks)",
      "Build a product case study portfolio",
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateJobListings(query: string): JobListing[] {
  const key = query.toLowerCase().trim();
  const db = JOB_DATABASE.default;

  // Normalize job type variations
  const jobTypes: Array<"Remote" | "Hybrid" | "On-site"> = ["Remote", "Hybrid", "On-site"];
  const count = Math.floor(Math.random() * 3) + 3; // 3–5 jobs

  const jobs: JobListing[] = [];
  const usedCompanies = new Set<string>();

  for (let i = 0; i < count; i++) {
    let company: string;
    do {
      company = pickRandom(db.companies);
    } while (usedCompanies.has(company));
    usedCompanies.add(company);

    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    now.setDate(now.getDate() - daysAgo);

    jobs.push({
      id: `job-${Date.now()}-${i}`,
      title: titleCase(query),
      company,
      location: pickRandom(db.locations),
      jobType: pickRandom(jobTypes),
      salary: pickRandom(db.salaries),
      description: `We are looking for a talented ${titleCase(query)} to join our growing team. You will work on exciting projects, collaborate with cross-functional teams, and help shape the future of our products.`,
      timestamp: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      tags: db.tags.sort(() => 0.5 - Math.random()).slice(0, 3),
    });
  }

  return jobs;
}

function getAnalysis(query: string): AIAnalysis {
  const key = query.toLowerCase().trim();
  // Try exact match first, then fuzzy keyword match
  if (ANALYSIS_DATABASE[key]) return ANALYSIS_DATABASE[key];

  const matched = Object.keys(ANALYSIS_DATABASE).find((k) =>
    key.includes(k) || k.includes(key)
  );

  if (matched) return ANALYSIS_DATABASE[matched];

  // Generic fallback
  return {
    requiredSkills: [
      "Problem Solving", "Communication", "Teamwork", "Adaptability",
      "Technical Proficiency", "Continuous Learning", "Attention to Detail",
    ],
    marketDemand: "Medium",
    careerAdvice:
      "Focus on building both technical and soft skills relevant to your field. Networking, building a portfolio, and staying updated with industry trends are key to career growth in any domain.",
    learningRoadmap: [
      "Research the core technical skills required for this role",
      "Take structured online courses (Coursera, Udemy, edX)",
      "Build 2–3 hands-on projects to demonstrate competency",
      "Join communities: LinkedIn, Discord, GitHub",
      "Apply to internships or junior positions",
      "Continue learning and iterate on feedback",
    ],
  };
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle } = body as { jobTitle: string };

    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid job title (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const trimmed = jobTitle.trim();

    // Simulate slight processing delay (realistic feel)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const jobs = generateJobListings(trimmed);
    const analysis = getAnalysis(trimmed);

    const response: ScrapeResponse = {
      jobs,
      analysis,
      searchQuery: trimmed,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
