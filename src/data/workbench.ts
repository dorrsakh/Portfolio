export const tools = [
  [
    "react",
    "React",
    "R",
    "Interfaces for creative workflows and game discovery.",
    ["dreamaan", "gamehub"],
  ],
  [
    "nextjs",
    "Next.js",
    "N",
    "Connected routes and product experiences.",
    ["dreamaan"],
  ],
  [
    "typescript",
    "TypeScript",
    "T",
    "Clear contracts between the interface and API.",
    ["dreamaan", "gamehub"],
  ],
  [
    "tailwindcss",
    "Tailwind",
    "W",
    "Responsive layouts. Considered details.",
    ["dreamaan"],
  ],
  [
    "zustand",
    "Zustand",
    "Z",
    "Shared state for connected workflows.",
    ["dreamaan", "gamehub"],
  ],
  [
    "reactquery",
    "React Query",
    "Q",
    "Server data, caching, and loading states.",
    ["gamehub"],
  ],
  ["jest", "Jest", "J", "Focused checks for the behavior that matters.", []],
  [
    "playwright",
    "Playwright",
    "P",
    "Real browser journeys, tested end to end.",
    ["dreamaan"],
  ],
  ["figma", "Figma", "F", "From layout ideas to interface details.", []],
  ["git", "Git", "G", "Small changes. Clear history.", []],
  ["cursor", "Cursor", "C", "AI-assisted editing, reviewed and validated.", []],
  [
    "codex",
    "Codex",
    "X",
    "Implementation support, with a human eye on the result.",
    [],
  ],
  [
    "claude",
    "Claude",
    "A",
    "Exploration and coding support, carefully reviewed.",
    [],
  ],
  [
    "githubcopilot",
    "Copilot",
    "O",
    "Coding assistance within a tested workflow.",
    [],
  ],
  ["work", "Work", "↵", "Explore the things I build.", []],
  ["contact", "Contact", "M", "Have something in mind? Let’s talk.", []],
].map(([id, name, shortcut, note, projects]) => ({
  id: id as string,
  name: name as string,
  shortcut: shortcut as string,
  note: note as string,
  projects: projects as string[],
}));
export type Work = {
  id: string;
  name: string;
  category: string;
  description: string;
  poster: string;
  video?: string;
  stack: string[];
  url?: string;
  points: string[];
  note: string;
};
export const work: Work[] = [
  {
    id: "dreamaan",
    name: "Dreamaan",
    category: "AI creative platform · Rastaar",
    description: "From a first idea to a creative workflow.",
    poster: "/media/dreamaan-home.webp",
    video: "/media/dreamaan-home.webm",
    stack: ["react", "nextjs", "typescript"],
    points: [
      "Frontend interfaces and responsive UI/UX.",
      "Connected APIs, asset workflows, and studio interactions.",
      "Debugging and automated browser checks.",
    ],
    note: "Team project · Current redesign, including work in progress.",
  },
  {
    id: "gamehub",
    name: "Game Hub",
    category: "Game discovery",
    description: "Find your next world to get lost in.",
    poster: "/media/gamehub-poster.webp",
    video: "/media/gamehub-walkthrough.webm",
    stack: ["react", "typescript", "reactquery"],
    url: "https://github.com/dorrsakh/Game-hub",
    points: [
      "Search, genre filters, and sorting.",
      "Server data and loading states.",
      "Responsive browsing and theme switching.",
    ],
    note: "Actual app footage with a labeled offline catalog. RAWG was unavailable during recording.",
  },
  {
    id: "calorie",
    name: "Calorie Tracker",
    category: "Daily activity tracker",
    description: "Meals, movement, and a little daily clarity.",
    poster: "/media/calorie-poster.webp",
    video: "/media/calorie-walkthrough.webm",
    stack: ["javascript", "bootstrap"],
    url: "https://github.com/dorrsakh/Calorie-Tracker",
    points: [
      "Meal and workout tracking.",
      "Calorie limits and progress summaries.",
      "Local storage persistence.",
    ],
    note: "Actual application · Demonstration entries.",
  },
];
export const career = [
  {
    company: "Rastaar",
    role: "Software Engineer",
    date: "2026 — Now",
    note: "Building creative workflows at Dreamaan.",
  },
  {
    company: "Pardik Smart Home",
    role: "Software Developer",
    date: "2024 — 2026",
    note: "React, Next.js, and responsive product interfaces.",
  },
  {
    company: "Bluprint",
    role: "Frontend Developer",
    date: "2024",
    note: "Reusable components and backend integration.",
  },
  {
    company: "Dash Team",
    role: "Python Instructor",
    date: "2021",
    note: "Making programming approachable.",
  },
];
