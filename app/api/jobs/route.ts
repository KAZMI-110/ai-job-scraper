import { NextRequest, NextResponse } from "next/server";
import {
  fetchJobs,
  extractSkills,
  calculateMatchScore,
  deduplicateJobs,
} from "@/lib/jobApi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query,
      location,
      page,
      cvText,
    }: {
      query?: string;
      location?: string;
      page?: number;
      cvText?: string;
    } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Please enter a job title or keyword." },
        { status: 400 }
      );
    }

    const { jobs: rawJobs, source } = await fetchJobs(
      query.trim(),
      location?.trim() || "United States",
      page ?? 1
    );

    let jobs = deduplicateJobs(rawJobs);

    // CV-based ranking
    let userSkills: string[] = [];
    if (cvText?.trim()) {
      userSkills = extractSkills(cvText);
      jobs = jobs
        .map((job) => ({
          ...job,
          matchScore: calculateMatchScore(
            `${job.title} ${job.description}`,
            userSkills
          ),
        }))
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    return NextResponse.json({
      jobs,
      totalCount: jobs.length,
      source,          // "live" | "demo"
      userSkills,      // so UI can show extracted skills
    });
  } catch (err) {
    console.error("/api/jobs error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
