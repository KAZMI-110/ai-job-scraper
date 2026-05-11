<div align="center">

# 🚀 AI Job Scraper Pro

### Global Job Intelligence Platform — Powered by AI

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ai--job--scraper--three.vercel.app-7c3aed?style=for-the-badge)](https://ai-job-scraper-three.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Search jobs across 5+ real sources, get AI-powered career analysis, and export professional reports — all in one tool.**

[Live Demo](https://ai-job-scraper-three.vercel.app) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Sources](#-data-sources)

---

</div>

## ✨ Features

### 🔍 Multi-Source Job Scraping
Scrapes real jobs from **5 different sources simultaneously** — all firing in parallel for maximum speed and coverage:

| Source | API Key Required | Direct Apply Links |
|--------|:---:|:---:|
| **JSearch** (RapidAPI) | ✅ | ✅ Company career pages |
| **Adzuna** | ✅ | ✅ Direct job listings |
| **Remotive** | ❌ Free | ✅ Direct apply URLs |
| **Arbeitnow** | ❌ Free | ✅ Direct apply URLs |
| **Jobicy** | ❌ Free | ✅ Direct apply URLs |

> 3 out of 5 sources work **without any API keys** — the app is fully functional out of the box.

### 🌍 12+ Countries Supported
Search jobs across **Pakistan, USA, UK, Germany, Canada, Australia, India, UAE, Singapore, Netherlands, Sweden**, and **Remote Worldwide** — with country-specific salary data, top companies, and market insights.

### 🤖 AI-Powered Career Analysis
Every search includes an intelligent analysis panel with:
- **Top Skills** in demand for the role
- **Market Demand** level (High / Medium / Low)
- **Competition Assessment**
- **Salary Benchmarks** per country
- **Career Roadmap** — step-by-step learning path
- **Country-Specific Insights**

### 📊 Professional Export Tools
- **PDF Reports** — Generate branded, professional career intelligence reports
- **CSV Export** — Download structured data for spreadsheets and further analysis

### 🎯 Smart Filtering & Search
- Filter by **Job Type** (Remote / Hybrid / On-site)
- Filter by **Experience Level** (Intern / Junior / Mid / Senior / Lead)
- Sort by **Newest**, **Relevance**, or **Salary**
- **City-level** targeting within each country

### 📄 CV-Based Job Matching
- Upload your CV/Resume (PDF)
- AI extracts your skills automatically
- Jobs are ranked by **relevance match score** (0–100%)

### 💾 Persistent Features
- **Save/Bookmark** jobs for later
- **Search History** with one-click replay
- All data persisted in localStorage

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **PDF Generation** | jsPDF |
| **CV Parsing** | pdf-parse |
| **Deployment** | Vercel |
| **APIs** | JSearch, Adzuna, Remotive, Arbeitnow, Jobicy |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/KAZMI-110/ai-job-scraper.git
cd ai-job-scraper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# ── JSearch (RapidAPI) — Primary job data source ──────────────────────────
# Get your key at: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
JSEARCH_API_KEY=your_jsearch_api_key_here

# ── Adzuna — Secondary job data source ────────────────────────────────────
# Get your keys at: https://developer.adzuna.com/
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
```

> **Note:** The app works without any API keys! Remotive, Arbeitnow, and Jobicy are completely free and require no configuration.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 Data Sources

### Free Sources (No API Key Needed)

| Source | Coverage | What You Get |
|--------|----------|-------------|
| [Remotive](https://remotive.com) | Remote jobs worldwide | Direct company apply links |
| [Arbeitnow](https://arbeitnow.com) | European + global jobs | Direct company apply links |
| [Jobicy](https://jobicy.com) | Remote tech jobs | Direct apply links + salary data |

### Premium Sources (Free Tier Available)

| Source | How to Get Key | Free Tier |
|--------|---------------|-----------|
| [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) | Sign up on RapidAPI | 200 requests/month |
| [Adzuna](https://developer.adzuna.com/) | Sign up on Adzuna | 250 requests/month |

---

## 📁 Project Structure

```
ai-job-scraper/
├── app/
│   ├── api/
│   │   ├── jobs/                    # Main job search API endpoint
│   │   ├── job-scraper-pro/         # Pro scraper API + data engine
│   │   ├── job-scraper-tool/        # Legacy scraper endpoint
│   │   └── parse-pdf/               # CV/Resume PDF parser
│   ├── components/
│   │   └── JobCard.tsx              # Main job card component
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard page (primary UI)
│   ├── job-scraper-pro/
│   │   ├── page.tsx                 # Pro scraper page
│   │   ├── JobCard.tsx              # Pro job card component
│   │   ├── FilterSidebar.tsx        # Filter controls
│   │   ├── AnalysisPanel.tsx        # AI analysis display
│   │   └── exportUtils.ts           # CSV/PDF export logic
│   ├── types/
│   │   └── job.ts                   # TypeScript interfaces
│   ├── globals.css                  # Global styles + design system
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── lib/
│   └── jobApi.ts                    # Multi-source job fetching engine
├── .env.local                       # Environment variables (not committed)
├── next.config.ts                   # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add your environment variables in **Settings → Environment Variables**:
   - `JSEARCH_API_KEY`
   - `ADZUNA_APP_ID`
   - `ADZUNA_APP_KEY`
4. Deploy — Vercel handles everything automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KAZMI-110/ai-job-scraper)

---

## 📸 Screenshots

### Landing Page
> Premium dark-mode landing page with gradient accents and smooth animations

### Dashboard
> Full-featured job search with real-time scraping from 5+ sources

### AI Analysis Panel
> Intelligent career insights including skills demand, salary benchmarks, and career roadmaps

### Export Reports
> Generate branded PDF reports and CSV exports for professional use

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Syed Ali Kazmi**

[![GitHub](https://img.shields.io/badge/GitHub-KAZMI--110-181717?style=for-the-badge&logo=github)](https://github.com/KAZMI-110)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Syed_Ali_Kazmi-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/syed-ali-kazmi-6232062a0/)

*Built as a portfolio project — BS AI Student* 🎓

</div>

---

<div align="center">

**⭐ If you found this useful, consider giving it a star!**

*© 2026 AI Job Scraper Pro — Global Talent Intelligence Platform*

</div>