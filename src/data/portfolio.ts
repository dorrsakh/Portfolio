export const chapters = [
  {
    id: "assets",
    short: "Assets",
    label: "The asset library",
    title: "Less searching. More creating.",
    description:
      "A viewport-aware masonry library brings images, videos, and collections together. Upload progress lives right where the finished asset will appear.",
    image: "/media/dreamaan-assets.webp",
    alt: "The redesigned Dreamaan asset library with a responsive masonry media grid",
    problem:
      "Inconsistent controls, oversized previews, and upload progress detached from the gallery made browsing more complex than it needed to be.",
    contribution:
      "Unified assets and collections with responsive masonry, stable pagination, in-place upload progress, and accessible card actions.",
    details: [
      "Viewport-aware masonry and loading states",
      "Collections and a shared media picker",
      "Upload progress replaced in place by the finished asset",
    ],
    pr: 1693,
  },
  {
    id: "search",
    short: "Search",
    label: "Unified discovery",
    title: "One search. A clearer path.",
    description:
      "Text, people, tags, and linked entities share a single search experience, with editable filter chips and a dedicated mobile sheet.",
    image: "/media/dreamaan-search.webp",
    alt: "Dreamaan unified search with grouped suggestions and editable filters",
    problem:
      "Separate filtering controls and suggestions limited to already-loaded assets made discovery inconsistent.",
    contribution:
      "Consolidated discovery into unified search, project-wide suggestions, editable chips, people-role filters, and URL-backed state.",
    details: [
      "Search names, codes, tags, people, and linked entities",
      "Editable chips with clear filter semantics",
      "Desktop panel and dedicated mobile search sheet",
    ],
    pr: 1693,
  },
  {
    id: "studio",
    short: "Studio",
    label: "The creative workspace",
    title: "Complex tools. A calmer flow.",
    description:
      "Responsive generation settings, connected reference workflows, and carefully handled feedback help creators stay focused on their work.",
    image: "/media/dreamaan-studio-generation.webp",
    alt: "Dreamaan Studio creative workspace with media and generation controls",
    problem:
      "A creative workspace has to balance model settings, references, and generation feedback without overwhelming the person using it.",
    contribution:
      "Contributed responsive interface refinements and connected frontend interactions to generation workflows, supported by testing and API investigation.",
    details: [
      "Responsive composer and generation settings",
      "Clear pending and completed feedback",
      "Attention to model limits and validation",
    ],
    pr: 1730,
  },
  {
    id: "references",
    short: "References",
    label: "Elements & references",
    title: "Bring the right ideas together.",
    description:
      "Compact reference cards and the shared asset picker make adding images, video, and elements a connected part of the creative process.",
    image: "/media/dreamaan-references.webp",
    alt: "Studio reference settings with the redesigned Elements controls",
    problem:
      "The earlier Elements workflow relied on blank rows and a separate legacy picker, adding friction to reference selection.",
    contribution:
      "Reworked Elements into compact expandable cards with the shared picker, batch selection, direct Add actions, and local drag-and-drop routing.",
    details: [
      "Shared asset picker and batch selection",
      "Compact cards and prompt mentions",
      "Preserved limits, mapping, and retry selection",
    ],
    pr: 1730,
  },
];
export const projects = [
  {
    name: "Game Hub",
    category: "DISCOVERY / WEB APPLICATION",
    description:
      "A game discovery project with searchable catalogs, genre and platform filters, sorting, and infinite loading.",
    stack: ["React", "TypeScript", "React Query", "Zustand"],
    url: "https://github.com/dorrsakh/Game-hub",
  },
  {
    name: "Calorie Tracker",
    category: "EVERYDAY TOOLS / WEB APPLICATION",
    description:
      "A daily tracker for meals, workouts, and personal calorie limits, with progress summaries and local storage persistence.",
    stack: ["JavaScript", "Bootstrap", "Local Storage"],
    url: "https://github.com/dorrsakh/Calorie-Tracker",
  },
];
export const experiences = [
  {
    company: "Rastaar",
    role: "Software Engineer",
    date: "FEB 2026 — PRESENT",
    description:
      "Building web features for an AI-driven animation and cinematic production platform. My work spans responsive interfaces, UI/UX, API integration, debugging, and automated testing, supported by reviewed and validated AI-assisted workflows.",
    stack: ["React", "TypeScript", "Playwright", "AI-assisted development"],
  },
  {
    company: "Pardik Smart Home",
    role: "Software Developer",
    date: "DEC 2024 — FEB 2026",
    description:
      "Developed scalable smart home web interfaces with React, TypeScript, and Next.js. Worked on performance optimization and responsive UI alongside cross-functional teams.",
    stack: ["React", "Next.js", "TypeScript"],
  },
  {
    company: "Bluprint",
    role: "Frontend Developer",
    date: "MAR 2024 — NOV 2024",
    description:
      "Implemented responsive UI components and integrated frontend applications with backend services, focusing on maintainability, optimization, and user experience.",
    stack: ["Responsive UI", "API integration", "Frontend development"],
  },
  {
    company: "Dash Team",
    role: "Python Instructor",
    date: "JUL 2021 — SEP 2021",
    description:
      "Taught foundational Python, prepared structured learning materials, and mentored beginner students.",
    stack: ["Python", "Teaching", "Mentoring"],
  },
];
