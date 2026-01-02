/**
 * Central configuration file for personal portfolio data
 * Update this file with your personal information, projects, and experience
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string[];
  technologies: string[];
}

export interface Skill {
  name: string;
  level: "expert" | "advanced" | "intermediate";
  category: "frontend" | "backend" | "tools" | "design";
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  longBio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  location: string;
  resumeUrl?: string;
}

// Personal Information
export const personalInfo: PersonalInfo = {
  name: "Dorsa Khalili",
  title: "Frontend Developer",
  bio: "Passionate about creating beautiful, interactive web experiences",
  longBio: "I'm a creative developer who loves building modern web applications with a focus on user experience and performance. With expertise in React, TypeScript, and modern CSS, I bring designs to life with smooth animations and intuitive interactions.",
  email: "your.email@example.com",
  github: "https://github.com/dorrsakh",
  linkedin: "https://linkedin.com/in/dorsa-khalili",
  location: "Your City, Country",
  resumeUrl: "/resume.pdf",
};

// Skills
export const skills: Skill[] = [
  // Frontend
  { name: "React", level: "expert", category: "frontend" },
  { name: "TypeScript", level: "expert", category: "frontend" },
  { name: "Next.js", level: "advanced", category: "frontend" },
  { name: "HTML/CSS", level: "expert", category: "frontend" },
  { name: "Tailwind CSS", level: "expert", category: "frontend" },
  { name: "JavaScript", level: "expert", category: "frontend" },
  // Tools
  { name: "Git", level: "expert", category: "tools" },
  { name: "Vite", level: "expert", category: "tools" },
  { name: "Webpack", level: "advanced", category: "tools" },
  // Design
  { name: "Figma", level: "advanced", category: "design" },
  { name: "UI/UX Design", level: "advanced", category: "design" },
];

// Projects
export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution with real-time inventory management",
    longDescription: "Built a full-stack e-commerce platform using React and Node.js. Features include real-time inventory tracking, secure payment integration, admin dashboard, and comprehensive product search. The platform handles thousands of products with optimized performance.",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Stripe"],
    featured: true,
    category: "Web Application",
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Collaborative task management with real-time updates",
    longDescription: "A Kanban-style task management application with real-time collaboration features. Built with React, TypeScript, and Socket.io for live updates. Includes drag-and-drop functionality, team workspaces, and advanced filtering options.",
    technologies: ["React", "TypeScript", "Socket.io", "Express", "PostgreSQL"],
    featured: true,
    category: "Web Application",
    githubUrl: "https://github.com/yourusername/taskapp",
    liveUrl: "https://taskapp-demo.com",
  },
  {
    id: "3",
    title: "Portfolio Website",
    description: "Personal portfolio with smooth animations and modern design",
    longDescription: "A responsive portfolio website showcasing my work and skills. Features smooth scroll animations using GSAP, interactive project galleries, and a modern minimalist design. Built with performance and accessibility in mind.",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS", "Vite"],
    featured: false,
    category: "Portfolio",
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.com",
  },
  {
    id: "4",
    title: "Weather Dashboard",
    description: "Real-time weather data visualization with interactive maps",
    longDescription: "A comprehensive weather dashboard that displays real-time weather data from multiple sources. Features include interactive maps, detailed forecasts, historical data visualization, and location-based recommendations.",
    technologies: ["React", "TypeScript", "D3.js", "OpenWeather API", "Mapbox"],
    featured: false,
    category: "Dashboard",
    githubUrl: "https://github.com/yourusername/weather",
    liveUrl: "https://weather-demo.com",
  },
];

// Experience
export const experiences: Experience[] = [
  {
    id: "1",
    company: "Tech Company Inc.",
    position: "Senior Frontend Developer",
    location: "San Francisco, CA",
    startDate: "2022",
    endDate: "Present",
    description: [
      "Lead frontend development for multiple product lines, serving 100K+ users",
      "Architected and implemented design system used across 5+ products",
      "Mentored junior developers and conducted code reviews",
      "Improved application performance by 40% through optimization strategies",
    ],
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
  },
  {
    id: "2",
    company: "StartupXYZ",
    position: "Frontend Developer",
    location: "Remote",
    startDate: "2020",
    endDate: "2022",
    description: [
      "Built responsive web applications using React and TypeScript",
      "Collaborated with designers to implement pixel-perfect UI components",
      "Integrated RESTful APIs and implemented state management solutions",
      "Contributed to open-source projects and internal tooling",
    ],
    technologies: ["React", "TypeScript", "Redux", "Styled Components", "Jest"],
  },
  {
    id: "3",
    company: "Digital Agency",
    position: "Junior Frontend Developer",
    location: "New York, NY",
    startDate: "2019",
    endDate: "2020",
    description: [
      "Developed client websites using HTML, CSS, and JavaScript",
      "Collaborated with cross-functional teams on various projects",
      "Learned modern frameworks and best practices",
      "Maintained and updated existing codebases",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Vue.js", "WordPress"],
  },
];

