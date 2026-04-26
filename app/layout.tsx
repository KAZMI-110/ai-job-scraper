import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Global Job Scraper Pro",
  description:
    "Advanced AI-powered global job scraping, filtering, and career intelligence. Generate reports and roadmaps for 12+ countries.",
  keywords: ["global job scraper", "AI career analysis", "job listings", "tech jobs", "career roadmap", "SaaS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
