// ── Country metadata ───────────────────────────────────────────────────────
export const COUNTRIES = [
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "REMOTE", name: "Remote (Worldwide)", flag: "🌍" },
];

// ── Country-specific data ──────────────────────────────────────────────────
export const COUNTRY_DATA: Record<string, {
  cities: string[];
  companies: string[];
  salaryMin: number;
  salaryMax: number;
  salaryUnit: string;
  symbol: string;
  insight: string;
}> = {
  PK: {
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", "Faisalabad"],
    companies: [
      "Systems Limited","NetSol Technologies","TRG Pakistan","Arbisoft","Confiz",
      "10Pearls","Techlogix","DevBatch","Genetech Solutions","Programmers Force",
      "Contour Software","Folio3","VentureDive","Tkxel","Elixir Technologies",
      "Daraz.pk","Jazz Digital","i2c Inc","NextBridge","LMKR",
      "Xgrid","Aifinance","Savvy","Centrika","Incubex",
      "Systems Ltd","Netsol Tech","Code District","Cubix","Invozone",
    ],
    salaryMin: 80000, salaryMax: 450000, salaryUnit: "PKR/mo", symbol: "PKR",
    insight: "Pakistan's tech sector is growing rapidly with 40%+ YoY job growth, especially in Lahore and Karachi. Remote work for international clients is highly lucrative.",
  },
  US: {
    cities: ["San Francisco, CA","New York, NY","Austin, TX","Seattle, WA","Chicago, IL","Boston, MA","Denver, CO","Los Angeles, CA"],
    companies: [
      "Google","Meta","Amazon","Microsoft","Apple","Netflix","Stripe","Airbnb",
      "Salesforce","Adobe","Twilio","Databricks","Snowflake","Figma","Notion",
      "Linear","Vercel","Cloudflare","Datadog","GitHub","MongoDB","Elastic","Okta",
      "PagerDuty","HashiCorp","Atlassian","Zoom","Coinbase","OpenAI","Anthropic",
    ],
    salaryMin: 80000, salaryMax: 220000, salaryUnit: "USD/yr", symbol: "$",
    insight: "The US tech market leads globally with the highest salaries and most remote-friendly roles. SF and NY dominate, but Austin and Denver are fast-growing hubs.",
  },
  UK: {
    cities: ["London","Manchester","Birmingham","Edinburgh","Bristol","Leeds","Cambridge"],
    companies: [
      "DeepMind","Revolut","Monzo","Wise","Deliveroo","Improbable","Darktrace",
      "Graphcore","ARM Holdings","BT Group","HSBC Tech","Barclays","Sky UK",
      "BBC R&D","Ocado Tech","Funding Circle","Starling Bank","Checkout.com",
      "Featurespace","Deloitte UK","Accenture UK","Capgemini UK","ThoughtWorks UK",
      "Babylon Health","OakNorth","Multiverse","Cleo","Cazoo","Tractable","Elvie",
    ],
    salaryMin: 38000, salaryMax: 130000, salaryUnit: "GBP/yr", symbol: "£",
    insight: "The UK tech scene is centred in London with a thriving fintech ecosystem. Post-Brexit visa changes have created new opportunities for global talent.",
  },
  DE: {
    cities: ["Berlin","Munich","Hamburg","Frankfurt","Cologne","Stuttgart","Düsseldorf"],
    companies: [
      "SAP","Siemens Digital","BMW Group IT","Volkswagen Digital","Zalando","N26",
      "Delivery Hero","HelloFresh","Idealo","Auto1 Group","Celonis","Personio",
      "FlixMobility","Trivago","About You","IONOS","Deutsche Bank Tech","Allianz Technology",
      "Bosch Connected","Continental Digital","Rocket Internet","HomeToGo","Adjust",
      "SumUp","Contentful","Trade Republic","Moonfare","Tourlane","Billie","GetYourGuide",
    ],
    salaryMin: 50000, salaryMax: 135000, salaryUnit: "EUR/yr", symbol: "€",
    insight: "Germany is Europe's largest tech job market with strong demand for engineers. Berlin is the startup capital; Munich leads in enterprise and automotive tech.",
  },
  CA: {
    cities: ["Toronto, ON","Vancouver, BC","Montreal, QC","Calgary, AB","Ottawa, ON","Waterloo, ON"],
    companies: [
      "Shopify","Hootsuite","Wave Financial","Wealthsimple","Lightspeed","D2L",
      "Achievers","Rangle.io","Tulip Retail","Vendasta","Kobo","Miovision","Clearco",
      "Borrowell","TouchBistro","Wattpad","Nuvei","Coveo","AlayaCare","Jobber",
      "Thinkific","Unbounce","Bench Accounting","7shifts","Trulioo","Blockstream",
      "Hatch","Ada","Rewind","Certn",
    ],
    salaryMin: 70000, salaryMax: 165000, salaryUnit: "CAD/yr", symbol: "CA$",
    insight: "Canada offers excellent work-life balance with strong immigration pathways. Toronto and Vancouver are tech hotspots with competitive salaries and quality of life.",
  },
  AU: {
    cities: ["Sydney, NSW","Melbourne, VIC","Brisbane, QLD","Perth, WA","Adelaide, SA"],
    companies: [
      "Atlassian","Canva","Afterpay","Seek","REA Group","Xero","Campaign Monitor",
      "Deputy","SafetyCulture","Buildkite","Culture Amp","Envato","Airtasker",
      "Prospa","Employment Hero","Linktree","Airwallex","WiseTech Global","Nearmap",
      "TechnologyOne","MYOB","Iress","Nuix","LiveHire","Finder","Zip Co",
      "Tyro Payments","Brighte","Siteminder","Whispir",
    ],
    salaryMin: 80000, salaryMax: 185000, salaryUnit: "AUD/yr", symbol: "A$",
    insight: "Australia's tech sector is booming driven by fintech and SaaS unicorns. Sydney and Melbourne lead, with growing startup scenes in Brisbane and Perth.",
  },
  IN: {
    cities: ["Bangalore","Mumbai","Delhi NCR","Hyderabad","Pune","Chennai","Kolkata"],
    companies: [
      "Infosys","TCS","Wipro","HCL Technologies","Tech Mahindra","Razorpay",
      "CRED","Zepto","Meesho","PhonePe","Groww","Unacademy","upGrad","Flipkart",
      "Swiggy","Zomato","Ola","Byju's","Nykaa","Freshworks","Zoho","Paytm",
      "PolicyBazaar","IndiaMART","BrowserStack","MoEngage","Clevertap","Postman",
      "Chargebee","Setu","Open","Khatabook",
    ],
    salaryMin: 500000, salaryMax: 4500000, salaryUnit: "INR/yr", symbol: "₹",
    insight: "India is a global tech powerhouse with the world's largest pool of software engineers. Bangalore leads, with a rapidly expanding startup ecosystem and FAANG offices.",
  },
  AE: {
    cities: ["Dubai","Abu Dhabi","Sharjah","Ajman"],
    companies: [
      "Noon.com","Careem","Fetchr","Property Finder","Bayt.com","Emirates Group IT",
      "Etisalat Digital","du Digital","Network International","Mashreq Bank Tech",
      "FAB Tech","Majid Al Futtaim Tech","Chalhoub Group IT","Aramex IT","DP World Digital",
      "Tabby","Baraka","Sarwa","Pure Harvest","Mamo","Stake","YAP","Now Money",
      "talabat","Anghami","Souq (Amazon AE)","Bayut","dubizzle","Huspy","EMPG",
    ],
    salaryMin: 8000, salaryMax: 40000, salaryUnit: "AED/mo", symbol: "AED",
    insight: "UAE (especially Dubai) is a tax-free tech hub attracting global talent. High salaries with zero income tax make it very attractive for senior engineers.",
  },
  SG: {
    cities: ["Singapore"],
    companies: [
      "Sea Group","Grab","Shopee","Lazada","Razer","Carousell","PropertyGuru",
      "Funding Societies","Endowus","StashAway","Syfe","Fazz Financial","Aspire",
      "Nium","Coda","Circles.Life","Singtel Tech","DBS Digital","OCBC Digital",
      "UOB Digital","Standard Chartered Tech","Goldman Sachs SG","Agoda","Booking.com SG",
      "Gojek","ByteDance SG","TikTok SG","Ninja Van","Kredivo","MatchMove",
    ],
    salaryMin: 4000, salaryMax: 20000, salaryUnit: "SGD/mo", symbol: "SGD",
    insight: "Singapore is Southeast Asia's fintech and tech hub with world-class infrastructure, low taxes, and strong government support for the digital economy.",
  },
  NL: {
    cities: ["Amsterdam","Rotterdam","The Hague","Utrecht","Eindhoven"],
    companies: [
      "Booking.com","ASML","Philips Digital","ING Tech","ABN AMRO Tech","TomTom",
      "Adyen","Takeaway.com","Catawiki","Miro","Backbase","Mollie","MessageBird",
      "WeTransfer","Elastic NV","Coolblue","Picnic","Sendcloud","Vinted NL",
      "Temper","TicketSwap","Lightyear","Nationale Nederlanden Tech","Prosus",
      "Bynder","Channable","Usabilla","Springest","Recruitee","Directus",
    ],
    salaryMin: 45000, salaryMax: 125000, salaryUnit: "EUR/yr", symbol: "€",
    insight: "The Netherlands offers excellent work-life balance, English-friendly workplaces, and a thriving tech scene in Amsterdam anchored by Booking.com, Adyen, and ASML.",
  },
  SE: {
    cities: ["Stockholm","Gothenburg","Malmö","Uppsala"],
    companies: [
      "Spotify","Klarna","King","Truecaller","Mojang (Microsoft)","Voi","Einride",
      "Northvolt Digital","H&M Tech","IKEA Digital","Schibsted","Epidemic Sound",
      "Mentimeter","Funnel","Hemnet","Tink","Lendify","Anyfin","Storytel",
      "Fortnox","iZettle (PayPal)","Bambuser","Polestar Digital","Sinch","Cint",
      "Dixa","Visma","Teamtailor","Quinyx","Supermetrics",
    ],
    salaryMin: 450000, salaryMax: 1300000, salaryUnit: "SEK/yr", symbol: "SEK",
    insight: "Sweden produces more billion-dollar startups per capita than any country except the US. Stockholm has a thriving ecosystem anchored by Spotify and Klarna.",
  },
  REMOTE: {
    cities: ["Worldwide Remote"],
    companies: [
      "GitLab","Automattic","Zapier","Buffer","Remote.com","Deel","Doist","Basecamp",
      "Toptal","Turing","Andela","X-Team","Loom","Notion","Linear","Raycast","Vercel",
      "PlanetScale","Supabase","Fly.io","Render","Netlify","Postmark","Intercom",
      "Help Scout","Hotjar","Maze","Dovetail","Framer","Sanity",
    ],
    salaryMin: 60000, salaryMax: 200000, salaryUnit: "USD/yr", symbol: "$",
    insight: "Remote-first companies offer unparalleled flexibility with globally competitive salaries. Strong async culture and hiring from anywhere makes this the fastest-growing segment.",
  },
};

// ── Role title variants ────────────────────────────────────────────────────
export const ROLE_VARIANTS: Record<string, string[]> = {
  frontend: ["Frontend Developer","Frontend Engineer","React Developer","Vue.js Developer","UI Developer","Web Developer","React.js Engineer","Angular Developer"],
  backend: ["Backend Developer","Backend Engineer","Node.js Developer","Python Developer","Java Engineer","API Developer","Server-Side Developer","Go Developer"],
  fullstack: ["Full Stack Developer","Full Stack Engineer","MERN Stack Developer","MEAN Stack Developer","Software Engineer","Web Application Developer","Next.js Developer","T3 Stack Developer"],
  data: ["Data Scientist","ML Engineer","AI Engineer","Data Analyst","Research Scientist","Applied Scientist","NLP Engineer","Computer Vision Engineer"],
  ml: ["Machine Learning Engineer","MLOps Engineer","AI/ML Engineer","Deep Learning Engineer","AI Researcher","Data Engineer","Feature Engineer","AI Product Engineer"],
  devops: ["DevOps Engineer","Site Reliability Engineer","Platform Engineer","Cloud Engineer","Infrastructure Engineer","Kubernetes Engineer","CI/CD Engineer","Cloud Architect"],
  uiux: ["UI/UX Designer","Product Designer","UX Researcher","Interaction Designer","Visual Designer","UX Engineer","Design Systems Engineer","UX/UI Lead"],
  mobile: ["Mobile Developer","iOS Developer","Android Developer","React Native Developer","Flutter Developer","Swift Developer","Kotlin Developer","Cross-Platform Developer"],
  product: ["Product Manager","Technical Product Manager","Senior PM","Associate PM","Group PM","Product Lead","Product Owner","Digital Product Manager"],
  security: ["Security Engineer","Cybersecurity Analyst","Penetration Tester","AppSec Engineer","Cloud Security Engineer","Security Architect","InfoSec Engineer","SOC Analyst"],
};

function getRoleKey(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("frontend") || t.includes("react") || t.includes("vue") || t.includes("angular") || t.includes("ui dev")) return "frontend";
  if (t.includes("backend") || t.includes("node") || t.includes("python dev") || t.includes("java dev") || t.includes("api dev")) return "backend";
  if (t.includes("full") || t.includes("mern") || t.includes("mean") || t.includes("next.js dev")) return "fullstack";
  if (t.includes("data sci") || t.includes("nlp") || t.includes("computer vision")) return "data";
  if (t.includes("machine") || t.includes("ml") || t.includes("deep learning") || t.includes("mlops")) return "ml";
  if (t.includes("devops") || t.includes("sre") || t.includes("platform") || t.includes("cloud") || t.includes("kubernetes")) return "devops";
  if (t.includes("ux") || t.includes("ui/ux") || t.includes("designer") || t.includes("product design")) return "uiux";
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("flutter") || t.includes("react native")) return "mobile";
  if (t.includes("product manager") || t.includes("pm") || t.includes("product owner")) return "product";
  if (t.includes("security") || t.includes("cyber") || t.includes("pentest") || t.includes("infosec")) return "security";
  return "fullstack";
}

export function getTitleVariants(jobTitle: string): string[] {
  const key = getRoleKey(jobTitle);
  return ROLE_VARIANTS[key] ?? [jobTitle];
}

// ── Role tags ──────────────────────────────────────────────────────────────
export const ROLE_TAGS: Record<string, string[]> = {
  frontend: ["React","TypeScript","Next.js","CSS","Tailwind","GraphQL","Jest","Webpack","Vite","Figma"],
  backend: ["Node.js","Python","REST APIs","PostgreSQL","MongoDB","Docker","Redis","gRPC","Kafka","AWS"],
  fullstack: ["React","Node.js","TypeScript","PostgreSQL","Docker","AWS","CI/CD","Redis","GraphQL","Next.js"],
  data: ["Python","Pandas","NumPy","Scikit-learn","TensorFlow","SQL","Tableau","Spark","R","Jupyter"],
  ml: ["Python","PyTorch","TensorFlow","MLflow","Docker","Kubernetes","Scikit-learn","CUDA","HuggingFace","Ray"],
  devops: ["Kubernetes","Docker","Terraform","AWS","Azure","GCP","CI/CD","Ansible","Prometheus","Linux"],
  uiux: ["Figma","Prototyping","User Research","Design Systems","Adobe XD","Usability Testing","Accessibility","Wireframing","Storybook","Zeplin"],
  mobile: ["React Native","Swift","Kotlin","Flutter","Dart","iOS","Android","Firebase","Expo","Fastlane"],
  product: ["Agile","Scrum","Roadmapping","SQL","A/B Testing","JIRA","User Stories","Analytics","Figma","OKRs"],
  security: ["Penetration Testing","OWASP","SIEM","Kubernetes Security","AWS Security","Python","Burp Suite","Nessus","CISSP","Zero Trust"],
};

export function getTagsForRole(jobTitle: string): string[] {
  const key = getRoleKey(jobTitle);
  return ROLE_TAGS[key] ?? ["JavaScript","Git","Agile","REST APIs","SQL","Docker","AWS","TypeScript","CI/CD","Linux"];
}

// ── AI Analysis per role ───────────────────────────────────────────────────
export const ANALYSIS_DATA: Record<string, {
  topSkills: string[];
  marketDemand: "High" | "Medium" | "Low";
  competitionLevel: "Low" | "Medium" | "High";
  careerRoadmap: string[];
}> = {
  frontend: {
    topSkills: ["React / Next.js","TypeScript","CSS / Tailwind","REST & GraphQL APIs","Testing (Jest, Cypress)","Performance Optimization","Git & CI/CD"],
    marketDemand: "High", competitionLevel: "Medium",
    careerRoadmap: ["HTML, CSS, JavaScript fundamentals (1–2 mo)","React + TypeScript deep dive (1–2 mo)","Next.js App Router & SSR (3–4 wk)","State management (Zustand/Redux) (2–3 wk)","Testing & accessibility (2 wk)","Build 3 portfolio projects + deploy on Vercel"],
  },
  backend: {
    topSkills: ["Node.js / Python / Go","REST & GraphQL APIs","PostgreSQL & MongoDB","Docker & Kubernetes","AWS / GCP","Authentication (JWT, OAuth)","Microservices"],
    marketDemand: "High", competitionLevel: "Medium",
    careerRoadmap: ["Choose stack: Node.js or Python (1–2 mo)","Database design: SQL + NoSQL (1 mo)","API design & auth (2–3 wk)","Docker + Kubernetes (3–4 wk)","Cloud deployment on AWS (1 mo)","System design concepts","Build and ship 2 production-grade APIs"],
  },
  fullstack: {
    topSkills: ["React + Node.js","TypeScript","PostgreSQL / MongoDB","Docker","REST APIs","Next.js","Git & CI/CD"],
    marketDemand: "High", competitionLevel: "High",
    careerRoadmap: ["Frontend: React + TypeScript (1–2 mo)","Backend: Node.js + REST APIs (1 mo)","Database: PostgreSQL + MongoDB (1 mo)","Next.js full-stack (3–4 wk)","Auth, deployment, Docker (2–3 wk)","Ship 2–3 full-stack projects publicly"],
  },
  data: {
    topSkills: ["Python (Pandas, NumPy)","Machine Learning (Scikit-learn)","SQL & Data Wrangling","Statistics & Probability","Data Visualization","TensorFlow / PyTorch","Storytelling with Data"],
    marketDemand: "High", competitionLevel: "Medium",
    careerRoadmap: ["Python + statistics fundamentals (1–2 mo)","Pandas, NumPy, Matplotlib (3–4 wk)","ML algorithms with Scikit-learn (1–2 mo)","Deep learning basics (1 mo)","SQL & database querying (2–3 wk)","Kaggle competitions & capstone project"],
  },
  ml: {
    topSkills: ["Python","PyTorch / TensorFlow","MLOps (MLflow, DVC)","Docker & Kubernetes","Feature Engineering","Cloud ML Platforms","Statistics & Linear Algebra"],
    marketDemand: "High", competitionLevel: "Low",
    careerRoadmap: ["Python + software engineering (1 mo)","ML theory & algorithms (1–2 mo)","Deep learning: CNNs, RNNs, Transformers (2 mo)","MLOps: experiment tracking & pipelines (1 mo)","Cloud ML: SageMaker / Vertex AI (1 mo)","End-to-end ML project deployed to production"],
  },
  devops: {
    topSkills: ["Docker & Kubernetes","CI/CD Pipelines","Terraform / IaC","AWS / Azure / GCP","Linux & Bash","Monitoring (Prometheus, Grafana)","Security & Networking"],
    marketDemand: "High", competitionLevel: "Low",
    careerRoadmap: ["Linux fundamentals + Bash scripting (1 mo)","Docker & containerisation (2–3 wk)","Kubernetes orchestration (1–2 mo)","CI/CD: GitHub Actions, Jenkins (2–3 wk)","Terraform & IaC (3–4 wk)","Cloud certification (AWS/Azure) (2–3 mo)"],
  },
  uiux: {
    topSkills: ["Figma & Prototyping","User Research & Testing","Design Systems","Accessibility (WCAG)","Information Architecture","Visual Design","Basic HTML/CSS"],
    marketDemand: "Medium", competitionLevel: "High",
    careerRoadmap: ["Design fundamentals: colour, type, layout (2–3 wk)","Figma mastery: auto-layout, components (1 mo)","User research & usability testing (3–4 wk)","Design systems & component libraries (2–3 wk)","Accessibility standards (WCAG) (1–2 wk)","Build 3–5 case study projects for portfolio"],
  },
  mobile: {
    topSkills: ["React Native / Flutter","Swift (iOS) / Kotlin (Android)","Firebase","REST APIs","App Store Deployment","State Management","Performance Optimisation"],
    marketDemand: "High", competitionLevel: "Medium",
    careerRoadmap: ["Choose platform: cross-platform (RN/Flutter) or native (1–2 mo)","Core components, navigation & state (1–2 mo)","API integration & local storage (2–3 wk)","Firebase: auth, Firestore, notifications (2–3 wk)","App Store & Play Store deployment (1–2 wk)","Publish 2 apps publicly"],
  },
  product: {
    topSkills: ["Product Strategy","Agile & Scrum","User Research","Data Analysis & SQL","Roadmapping","Stakeholder Management","A/B Testing"],
    marketDemand: "Medium", competitionLevel: "High",
    careerRoadmap: ["PM fundamentals & frameworks (2–3 wk)","User research & customer interviews (2–3 wk)","Agile & Scrum methodologies (2 wk)","Data: SQL + analytics tools (1 mo)","Roadmapping & prioritisation (2 wk)","A/B testing & experimentation (2 wk)","Build product case study portfolio"],
  },
  security: {
    topSkills: ["Penetration Testing","OWASP Top 10","Cloud Security (AWS/Azure)","SIEM & Log Analysis","Python Scripting","Network Security","Incident Response"],
    marketDemand: "High", competitionLevel: "Low",
    careerRoadmap: ["Networking fundamentals & Linux (1–2 mo)","OWASP Top 10 & web security (1 mo)","Penetration testing basics (Burp Suite) (1–2 mo)","Cloud security (AWS/Azure) (1 mo)","Certifications: CEH, CompTIA Security+ (2–3 mo)","CTF competitions & bug bounty programs"],
  },
};

export function getAnalysis(jobTitle: string) {
  const t = jobTitle.toLowerCase();
  if (t.includes("frontend") || t.includes("react dev") || t.includes("vue") || t.includes("angular")) return ANALYSIS_DATA.frontend;
  if (t.includes("backend") || t.includes("node.js dev") || t.includes("python dev")) return ANALYSIS_DATA.backend;
  if (t.includes("full")) return ANALYSIS_DATA.fullstack;
  if (t.includes("data sci") || t.includes("data analyst") || t.includes("nlp")) return ANALYSIS_DATA.data;
  if (t.includes("machine") || t.includes("ml ") || t.includes("mlops") || t.includes("deep learn") || t.includes("ai eng")) return ANALYSIS_DATA.ml;
  if (t.includes("devops") || t.includes("sre") || t.includes("platform eng") || t.includes("cloud eng") || t.includes("infra")) return ANALYSIS_DATA.devops;
  if (t.includes("ux") || t.includes("designer") || t.includes("product design")) return ANALYSIS_DATA.uiux;
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("flutter") || t.includes("react native")) return ANALYSIS_DATA.mobile;
  if (t.includes("product manager") || t.includes(" pm") || t.includes("product owner")) return ANALYSIS_DATA.product;
  if (t.includes("security") || t.includes("cyber") || t.includes("pentest") || t.includes("infosec")) return ANALYSIS_DATA.security;
  return ANALYSIS_DATA.fullstack;
}

// ── City lookup for frontend dropdown ─────────────────────────────────────
/** Returns ["All Cities", ...citiesForCountry] */
export function getCitiesForCountry(countryCode: string): string[] {
  const cities = COUNTRY_DATA[countryCode]?.cities ?? [];
  return ["All Cities", ...cities];
}

