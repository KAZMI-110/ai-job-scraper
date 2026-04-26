"use client";
import { JobListing, AIAnalysis } from "./types";

export function exportCSV(jobs: JobListing[], query: string) {
  const headers = ["Job Title", "Company", "Location", "Job Type", "Salary", "Date Posted"];
  const rows = jobs.map((j) => [
    `"${j.title}"`, `"${j.company}"`, `"${j.location}"`,
    j.jobType, `"${j.salary}"`, `"${j.timestamp}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobs-${query.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPDF(jobs: JobListing[], analysis: AIAnalysis, query: string) {
  const jspdfModule = await import("jspdf");
  const jsPDF = (jspdfModule as any).default || (jspdfModule as any).jsPDF || jspdfModule;
  const doc = new (jsPDF as any)({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  let y = 0;

  const checkPage = (needed: number) => {
    if (y + needed > 270) { doc.addPage(); y = 20; }
  };

  // ── Title page header ──
  doc.setFillColor(15, 10, 30);
  doc.rect(0, 0, W, 40, "F");
  doc.setTextColor(200, 180, 255);
  doc.setFontSize(9);
  doc.text("AI JOB SCRAPER & REPORT GENERATOR", 14, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${query} — Job Report`, 14, 26);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 140, 210);
  doc.text(`Generated: ${new Date().toLocaleString()}  |  ${jobs.length} listings`, 14, 34);
  y = 50;

  // ── Job listings ──
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 80, 240);
  doc.text("Job Listings", 14, y); y += 8;

  jobs.forEach((job, i) => {
    checkPage(38);
    // Card background
    doc.setFillColor(22, 16, 40);
    doc.roundedRect(12, y, W - 24, 34, 3, 3, "F");
    doc.setDrawColor(80, 50, 160);
    doc.roundedRect(12, y, W - 24, 34, 3, 3, "S");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(240, 230, 255);
    doc.text(`${i + 1}. ${job.title}`, 18, y + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 140, 210);
    doc.text(`${job.company}  •  ${job.location}  •  ${job.jobType}`, 18, y + 15);
    doc.setTextColor(100, 200, 150);
    doc.text(`Salary: ${job.salary}`, 18, y + 21);
    doc.setTextColor(100, 100, 130);
    doc.text(`Posted: ${job.timestamp}`, 18, y + 27);
    y += 40;
  });

  y += 6;
  checkPage(12);

  // ── AI Analysis ──
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 80, 240);
  doc.text("AI Career Analysis", 14, y); y += 8;

  // Skills
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 180, 255);
  doc.text("Required Skills:", 14, y); y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  const skillLine = analysis.requiredSkills.join("  •  ");
  const skillLines = doc.splitTextToSize(skillLine, W - 28);
  skillLines.forEach((line: string) => { checkPage(7); doc.text(line, 14, y); y += 6; });

  y += 4; checkPage(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 180, 255);
  doc.text(`Market Demand: `, 14, y);
  const col = analysis.marketDemand === "High" ? [50, 200, 120] : analysis.marketDemand === "Medium" ? [240, 180, 60] : [220, 80, 80];
  doc.setTextColor(col[0], col[1], col[2]);
  doc.text(analysis.marketDemand, 54, y); y += 8;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 180, 255);
  doc.text("Career Advice:", 14, y); y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  const adviceLines = doc.splitTextToSize(analysis.careerAdvice, W - 28);
  adviceLines.forEach((line: string) => { checkPage(7); doc.text(line, 14, y); y += 6; });

  y += 4; checkPage(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 180, 255);
  doc.text("Learning Roadmap:", 14, y); y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 200);
  analysis.learningRoadmap.forEach((step, i) => {
    checkPage(8);
    doc.text(`${i + 1}.  ${step}`, 16, y); y += 7;
  });

  // Footer
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(80, 60, 120);
    doc.text("AI Job Scraper & Report Generator — Portfolio Tool", 14, 290);
    doc.text(`Page ${p} of ${pages}`, W - 30, 290);
  }

  doc.save(`jobs-${query.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
