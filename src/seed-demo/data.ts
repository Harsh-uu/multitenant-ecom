// Demo catalogue used by src/seed-demo/index.ts. Everything here is fictional.

export type DemoProduct = {
  name: string;
  category: string; // subcategory slug from src/seed.ts
  price: number;
  tags: string[];
  blurb: string;
  includes: string[];
  refundPolicy?: "30-day" | "14-day" | "7-day" | "3-day" | "1-day" | "no-refunds";
  isPrivate?: boolean;
};

export type DemoStore = {
  slug: string;
  name: string;
  owner: { first: string; last: string };
  color: string;
  products: DemoProduct[];
};

export const DEMO_EMAIL_DOMAIN = "example.com";
export const DEMO_PASSWORD = "demo1234";

export const TAGS = [
  "bestseller",
  "beginner-friendly",
  "advanced",
  "template",
  "ebook",
  "video-course",
  "toolkit",
  "bundle",
  "new",
  "printable",
  "presets",
  "cheat-sheet",
];

export const STORES: DemoStore[] = [
  {
    slug: "pixelcraft",
    name: "Pixel Craft Studio",
    owner: { first: "Lena", last: "Fischer" },
    color: "#B5B9FF",
    products: [
      { name: "Figma UI Kit Pro", category: "ui-ux", price: 49, tags: ["template", "bestseller"], blurb: "A complete, auto-layout Figma design system with 600+ components, light and dark themes and responsive variants.", includes: ["600+ components with variants", "Light and dark themes", "Auto-layout everywhere", "Free lifetime updates"] },
      { name: "Mobile App Wireframe Pack", category: "ui-ux", price: 24, tags: ["template", "beginner-friendly"], blurb: "Over 180 low-fidelity screens to map out iOS and Android flows in minutes, not days.", includes: ["180+ wireframe screens", "Onboarding, checkout and settings flows", "Figma and Sketch files"] },
      { name: "Brand Identity Starter", category: "graphic-design", price: 35, tags: ["toolkit", "template"], blurb: "Logo grids, palette builders and brand guideline templates to ship a cohesive identity for any client.", includes: ["24-page brand guideline template", "Logo construction grids", "Palette and type pairing sheets"] },
      { name: "Grotesk Display Typeface", category: "typography", price: 29, tags: ["new"], blurb: "A bold, geometric display family in six weights, made for headlines that need to shout.", includes: ["6 weights with italics", "OTF, TTF and WOFF2", "Desktop and web licence"] },
      { name: "Low-Poly 3D Asset Pack", category: "3d-modeling", price: 39, tags: ["bundle", "advanced"], blurb: "120 game-ready low-poly models with clean topology and a single shared texture atlas.", includes: ["120 models in FBX, OBJ and GLB", "Shared 1K texture atlas", "Blender source files"] },
      { name: "Design Critique Checklist", category: "ui-ux", price: 0, tags: ["cheat-sheet", "printable", "beginner-friendly"], blurb: "A free, printable checklist for running sharper design reviews with your team.", includes: ["2-page printable PDF", "Notion template version"], refundPolicy: "no-refunds" },
    ],
  },
  {
    slug: "codewithmaya",
    name: "Code with Maya",
    owner: { first: "Maya", last: "Patel" },
    color: "#7EC8E3",
    products: [
      { name: "Next.js Production Playbook", category: "web-development", price: 59, tags: ["ebook", "advanced", "bestseller"], blurb: "Everything I learned shipping Next.js apps to millions of users: caching, data fetching, auth and deployment.", includes: ["220-page ebook (PDF and EPUB)", "Companion GitHub repo", "Deployment checklist"] },
      { name: "TypeScript from Zero", category: "programming-languages", price: 39, tags: ["video-course", "beginner-friendly"], blurb: "A friendly, project-based video course that takes you from JavaScript to confident TypeScript.", includes: ["6 hours of video", "40 exercises with solutions", "Certificate of completion"] },
      { name: "Docker & Kubernetes Cheat Sheets", category: "devops", price: 12, tags: ["cheat-sheet", "printable"], blurb: "Twelve dense, printable reference sheets for the commands you keep searching for.", includes: ["12 printable PDFs", "Dark-mode versions"] },
      { name: "React Native Starter Kit", category: "mobile-development", price: 79, tags: ["template", "toolkit"], blurb: "A production-ready Expo starter with auth, payments, push notifications and CI already wired up.", includes: ["Full source code", "Auth, payments and push set up", "GitHub Actions CI"] },
      { name: "SaaS Boilerplate", category: "web-development", price: 129, tags: ["template", "bundle", "advanced"], blurb: "Launch your SaaS this weekend: multi-tenant auth, billing, emails and an admin dashboard.", includes: ["Next.js + Postgres source", "Stripe billing", "Transactional email templates", "Admin dashboard"] },
      { name: "Git Workflows Mini-Course", category: "programming-languages", price: 15, tags: ["video-course", "beginner-friendly", "new"], blurb: "Branching, rebasing and recovering from mistakes without fear, in under two hours.", includes: ["90 minutes of video", "Practice repository"] },
    ],
  },
  {
    slug: "moneymindset",
    name: "Money Mindset",
    owner: { first: "Daniel", last: "Okafor" },
    color: "#FFB347",
    products: [
      { name: "Personal Budget Spreadsheet", category: "personal-finance", price: 19, tags: ["template", "bestseller", "beginner-friendly"], blurb: "A zero-based budgeting spreadsheet that tracks spending, savings goals and net worth automatically.", includes: ["Google Sheets and Excel versions", "Net worth tracker", "Video walkthrough"] },
      { name: "Index Investing Guide", category: "investing", price: 29, tags: ["ebook", "beginner-friendly"], blurb: "A plain-English guide to building a low-cost, diversified portfolio and sticking with it.", includes: ["140-page ebook", "Portfolio rebalancing calculator"] },
      { name: "Freelancer Bookkeeping Kit", category: "accounting", price: 25, tags: ["toolkit", "template"], blurb: "Invoices, expense trackers and quarterly tax estimators built for solo freelancers.", includes: ["Invoice templates", "Expense tracker", "Quarterly tax estimator"] },
      { name: "Startup Pitch Deck Template", category: "entrepreneurship", price: 35, tags: ["template", "new"], blurb: "The 14-slide structure behind decks that raised over $40M, ready to customise.", includes: ["Keynote, PowerPoint and Google Slides", "Annotated example deck"] },
      { name: "Real Estate Deal Analyzer", category: "real-estate", price: 45, tags: ["toolkit", "advanced"], blurb: "Analyse rental properties in minutes with cash flow, cap rate and IRR calculations.", includes: ["Deal analyzer spreadsheet", "Sample deals", "Video tutorial"] },
      { name: "Side Hustle Playbook", category: "gigs-side-projects", price: 17, tags: ["ebook", "beginner-friendly"], blurb: "Thirty tested side-hustle ideas with startup costs, time commitment and first-month action plans.", includes: ["90-page ebook", "Idea scoring worksheet"] },
    ],
  },
  {
    slug: "inkandquill",
    name: "Ink & Quill",
    owner: { first: "Sofia", last: "Marino" },
    color: "#D8B5FF",
    products: [
      { name: "Novel Outlining Workbook", category: "fiction", price: 22, tags: ["printable", "beginner-friendly", "bestseller"], blurb: "Plot your novel scene by scene with worksheets for structure, character arcs and subplots.", includes: ["60-page printable workbook", "Scrivener template"] },
      { name: "Copywriting Swipe File", category: "copywriting", price: 39, tags: ["toolkit", "bestseller"], blurb: "500 high-converting headlines, emails and landing page sections, organised by goal.", includes: ["500+ annotated examples", "Searchable Notion database"] },
      { name: "Self-Publishing Roadmap", category: "self-publishing", price: 27, tags: ["ebook"], blurb: "From finished manuscript to Amazon bestseller list: formatting, covers, pricing and launch.", includes: ["Step-by-step ebook", "Launch week checklist", "Cover brief template"] },
      { name: "Blog Post Templates", category: "blogging", price: 15, tags: ["template", "beginner-friendly"], blurb: "Twelve proven blog post structures that make the blank page disappear.", includes: ["12 fill-in-the-blank templates", "SEO checklist"] },
      { name: "Short Story Prompt Deck", category: "fiction", price: 9, tags: ["printable", "new"], blurb: "120 printable prompt cards to break writer's block and spark new stories.", includes: ["120 prompt cards", "Print-at-home PDF"] },
      { name: "Memoir Writing Course", category: "non-fiction", price: 49, tags: ["video-course"], blurb: "Turn your life into a compelling narrative with weekly lessons and writing exercises.", includes: ["8 weekly video lessons", "Exercise workbook"] },
    ],
  },
  {
    slug: "lensandlight",
    name: "Lens & Light",
    owner: { first: "Kenji", last: "Tanaka" },
    color: "#FF6B6B",
    products: [
      { name: "Moody Film Lightroom Presets", category: "portrait", price: 19, tags: ["presets", "bestseller"], blurb: "Twenty presets inspired by Portra and Ektar film stocks, tuned for skin tones.", includes: ["20 Lightroom presets", "Mobile DNG versions", "Install guide"] },
      { name: "Landscape Masterclass", category: "landscape", price: 69, tags: ["video-course", "advanced"], blurb: "Plan, shoot and edit epic landscapes with field lessons from Iceland, Patagonia and the Alps.", includes: ["9 hours of video", "RAW files to practise on", "Editing walkthroughs"] },
      { name: "Street Photography Field Guide", category: "street-photography", price: 21, tags: ["ebook", "beginner-friendly"], blurb: "Composition, confidence and camera settings for candid street photography.", includes: ["110-page ebook", "Settings cheat sheet"] },
      { name: "Macro Focus Stacking Guide", category: "macro", price: 18, tags: ["ebook", "advanced"], blurb: "Get razor-sharp macro shots with focus stacking, from capture to final blend.", includes: ["Illustrated ebook", "Sample stack files"] },
      { name: "Golden Hour Preset Pack", category: "nature", price: 15, tags: ["presets", "new"], blurb: "Warm, glowing presets for sunrise and sunset scenes.", includes: ["15 presets", "Before/after examples"] },
      { name: "Portrait Posing Cards", category: "portrait", price: 12, tags: ["printable", "cheat-sheet", "beginner-friendly"], blurb: "Fifty posing prompts for natural-looking portraits, on your phone or printed.", includes: ["50 posing cards", "Phone wallpaper versions"] },
    ],
  },
  {
    slug: "beatlab",
    name: "Beat Lab",
    owner: { first: "Marcus", last: "Reed" },
    color: "#FFD700",
    products: [
      { name: "Lo-Fi Drum Sample Pack", category: "music-production", price: 25, tags: ["bundle", "bestseller"], blurb: "800 dusty, vinyl-sampled drum hits and loops for lo-fi and boom-bap beats.", includes: ["800 WAV samples", "40 drum loops", "Royalty-free licence"] },
      { name: "Songwriting Bootcamp", category: "songwriting", price: 55, tags: ["video-course", "beginner-friendly"], blurb: "Write a complete song every week for six weeks, with feedback-ready assignments.", includes: ["6-week video course", "Lyric and melody worksheets"] },
      { name: "Music Theory for Producers", category: "music-theory", price: 35, tags: ["ebook", "beginner-friendly"], blurb: "Chords, scales and progressions explained with piano-roll diagrams instead of sheet music.", includes: ["Illustrated ebook", "MIDI chord progressions"] },
      { name: "Synthwave Serum Presets", category: "music-production", price: 19, tags: ["presets", "new"], blurb: "64 retro synth patches for leads, basses and pads.", includes: ["64 Serum presets", "Demo project"] },
      { name: "Mixing Checklist", category: "music-production", price: 0, tags: ["cheat-sheet", "printable"], blurb: "A free one-page checklist to get cleaner mixes, faster.", includes: ["Printable PDF"], refundPolicy: "no-refunds" },
      { name: "History of Hip-Hop Ebook", category: "music-history", price: 14, tags: ["ebook"], blurb: "From Bronx block parties to global charts: fifty years of hip-hop in twelve chapters.", includes: ["180-page ebook", "Curated playlist"] },
    ],
  },
  {
    slug: "fitwithraj",
    name: "Fit with Raj",
    owner: { first: "Raj", last: "Malhotra" },
    color: "#FF9AA2",
    products: [
      { name: "12-Week Strength Program", category: "workout-plans", price: 49, tags: ["bestseller", "advanced"], blurb: "A progressive barbell program with video demos for every lift and an auto-adjusting log.", includes: ["12-week plan", "Exercise video library", "Progress tracker"] },
      { name: "Home Workout Plan", category: "workout-plans", price: 19, tags: ["beginner-friendly", "printable"], blurb: "No gym, no problem: 30-minute bodyweight workouts for busy weeks.", includes: ["8-week printable plan", "Follow-along videos"] },
      { name: "High-Protein Meal Prep Guide", category: "nutrition", price: 24, tags: ["ebook", "bestseller"], blurb: "Forty high-protein recipes with shopping lists and macros for every meal.", includes: ["40 recipes with macros", "Weekly shopping lists"] },
      { name: "Morning Yoga Flow Series", category: "yoga", price: 29, tags: ["video-course", "beginner-friendly"], blurb: "Twenty-one gentle morning flows to build mobility and start the day calm.", includes: ["21 follow-along videos", "Pose guide"] },
      { name: "Macro Calculator Spreadsheet", category: "nutrition", price: 9, tags: ["toolkit", "template"], blurb: "Calculate your calories and macros for cutting, bulking or maintaining.", includes: ["Google Sheets calculator", "Instructions"] },
      { name: "Marathon Training Plan", category: "workout-plans", price: 35, tags: ["advanced", "new"], blurb: "A 16-week plan that gets first-timers to the finish line injury-free.", includes: ["16-week schedule", "Pacing calculator", "Race-day checklist"] },
    ],
  },
  {
    slug: "calmcollective",
    name: "Calm Collective",
    owner: { first: "Ava", last: "Nguyen" },
    color: "#96E6B3",
    products: [
      { name: "Notion Life OS", category: "productivity", price: 39, tags: ["template", "bestseller"], blurb: "One Notion workspace for goals, habits, projects, notes and journaling.", includes: ["Notion template", "Setup video", "Weekly review guide"] },
      { name: "Deep Work Planner", category: "productivity", price: 15, tags: ["printable", "template"], blurb: "A daily planner built around time-blocking and focus sessions.", includes: ["Printable PDF", "GoodNotes version"] },
      { name: "Mindfulness Journal", category: "mindfulness", price: 12, tags: ["printable", "beginner-friendly"], blurb: "A 90-day guided journal with daily prompts for gratitude and reflection.", includes: ["90-day printable journal"] },
      { name: "Career Pivot Toolkit", category: "career-growth", price: 45, tags: ["toolkit", "advanced"], blurb: "Resume templates, networking scripts and a 60-day plan to land a role in a new field.", includes: ["Resume and cover letter templates", "Networking scripts", "60-day action plan"] },
      { name: "Habit Tracker Bundle", category: "personal-development", price: 10, tags: ["printable", "bundle", "new"], blurb: "Monthly, weekly and yearly habit trackers in six colourways.", includes: ["18 printable trackers"] },
      { name: "Guided Meditation Audio Pack", category: "mindfulness", price: 19, tags: ["bundle", "beginner-friendly"], blurb: "Twenty guided meditations, from 5-minute resets to 30-minute body scans.", includes: ["20 MP3 meditations", "Transcripts"] },
    ],
  },
  {
    slug: "brushstrokes",
    name: "Brush Strokes Academy",
    owner: { first: "Clara", last: "Jensen" },
    color: "#FFCAB0",
    products: [
      { name: "Watercolor Botanicals Course", category: "watercolor", price: 45, tags: ["video-course", "beginner-friendly", "bestseller"], blurb: "Paint loose, luminous flowers and leaves in ten relaxed real-time lessons.", includes: ["10 video lessons", "Printable line drawings", "Supply list"] },
      { name: "Acrylic Landscapes Workshop", category: "acrylic", price: 39, tags: ["video-course"], blurb: "Paint dramatic skies, mountains and water with a limited acrylic palette.", includes: ["6 real-time paint-alongs", "Reference photos"] },
      { name: "Charcoal Portrait Basics", category: "charcoal", price: 29, tags: ["video-course", "beginner-friendly"], blurb: "Proportions, values and blending for expressive charcoal portraits.", includes: ["5 hours of video", "Proportion guides"] },
      { name: "Procreate Brush Set", category: "watercolor", price: 15, tags: ["toolkit", "new"], blurb: "Forty natural-media brushes that mimic real watercolour, gouache and ink.", includes: ["40 Procreate brushes", "Colour palettes"] },
      { name: "Oil Painting Color Mixing Guide", category: "oil", price: 22, tags: ["ebook", "advanced"], blurb: "Mix any colour from a six-tube palette with charts and exercises.", includes: ["Illustrated ebook", "Printable mixing charts"] },
      { name: "Pastel Still Life Reference Pack", category: "pastel", price: 9, tags: ["bundle", "printable"], blurb: "Sixty high-resolution still life photos licensed for practice and sale.", includes: ["60 reference photos", "Commercial licence"] },
    ],
  },
  {
    slug: "learnloop",
    name: "LearnLoop",
    owner: { first: "Omar", last: "Haddad" },
    color: "#FFE066",
    products: [
      { name: "Spanish in 30 Days", category: "language-learning", price: 35, tags: ["video-course", "beginner-friendly", "bestseller"], blurb: "Daily 20-minute lessons that get you holding real conversations in a month.", includes: ["30 video lessons", "Audio flashcards", "Workbook"] },
      { name: "SAT Math Prep Bundle", category: "test-preparation", price: 49, tags: ["bundle", "advanced"], blurb: "Practice tests, video solutions and a study plan for a 750+ math score.", includes: ["6 full practice tests", "Video solutions", "8-week study plan"] },
      { name: "Course Creator Toolkit", category: "online-courses", price: 59, tags: ["toolkit", "template"], blurb: "Plan, record and launch your first online course with templates for every step.", includes: ["Curriculum planner", "Recording checklist", "Launch email sequence"] },
      { name: "Japanese Kana Flashcards", category: "language-learning", price: 9, tags: ["printable", "beginner-friendly", "new"], blurb: "Learn hiragana and katakana with mnemonic flashcards and stroke-order guides.", includes: ["92 printable flashcards", "Anki deck"] },
      { name: "Tutoring Business Starter", category: "tutoring", price: 29, tags: ["template", "toolkit"], blurb: "Pricing calculators, lesson plans and parent communication templates for independent tutors.", includes: ["Pricing calculator", "Lesson plan templates", "Email templates"] },
      { name: "IELTS Writing Masterclass", category: "test-preparation", price: 39, tags: ["video-course", "advanced"], blurb: "Band-9 strategies for Task 1 and Task 2 with graded sample essays.", includes: ["4 hours of video", "40 graded sample essays"], isPrivate: true },
    ],
  },
];

export const BUYERS = [
  { username: "alexkim", first: "Alex", last: "Kim" },
  { username: "priyashah", first: "Priya", last: "Shah" },
  { username: "samtaylor", first: "Sam", last: "Taylor" },
  { username: "jordanlee", first: "Jordan", last: "Lee" },
  { username: "meichen", first: "Mei", last: "Chen" },
  { username: "diegorivera", first: "Diego", last: "Rivera" },
];

export const REVIEWS: Record<number, string[]> = {
  5: [
    "Exactly what I needed. Clear, well organised and worth every cent.",
    "Honestly one of the best purchases I've made this year. Highly recommend.",
    "Super polished and easy to follow. I used it the same day I bought it.",
    "Saved me hours of work. The attention to detail is fantastic.",
    "Bought this on a whim and it completely changed how I work.",
    "Brilliant quality. You can tell the creator really knows their stuff.",
  ],
  4: [
    "Really solid. A couple of sections could go deeper, but great overall.",
    "Very useful and nicely presented. Would love a few more examples.",
    "Great value for the price. Took me a bit to get set up, then smooth sailing.",
    "Good content and well structured. I'll be coming back to it.",
  ],
  3: [
    "Decent, but some of it was stuff I already knew.",
    "Useful in parts. I expected a little more for the price.",
  ],
  2: ["It's okay, but it didn't quite match the description for me."],
};
