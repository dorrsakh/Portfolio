import { useState } from "react";
import type { CSSProperties } from "react";
import {
  Atom,
  Braces,
  Layers,
  Wind,
  Database,
  RefreshCw,
  FlaskConical,
  ScanLine,
  PenTool,
  GitBranch,
  Terminal,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const skills = [
  {
    name: "React",
    label: "Interfaces, composed.",
    group: "Build",
    icon: Atom,
    color: "#8ed5e8",
    description:
      "Reusable components, clear state, and interactions that feel natural.",
    code: "<Interface>\n  <ThoughtfulDetails />\n</Interface>",
  },
  {
    name: "Next.js",
    label: "From page to product.",
    group: "Build",
    icon: Layers,
    color: "#eeede8",
    description:
      "Application routes and connected experiences, built around real workflows.",
    code: "app/\n  projects/\n    [slug]/\n      page.tsx",
  },
  {
    name: "TypeScript",
    label: "A little more certainty.",
    group: "Build",
    icon: Braces,
    color: "#9cbbef",
    description:
      "Explicit contracts that make complex UI and API integration easier to reason about.",
    code: "type Interface = {\n  intent: 'clear';\n  details: 'considered';\n};",
  },
  {
    name: "Tailwind CSS",
    label: "Every pixel, considered.",
    group: "Build",
    icon: Wind,
    color: "#8cd6d6",
    description:
      "Responsive layouts and consistent styling, from the first screen to the smallest state.",
    code: "flex items-center\ngap-4 md:gap-8\nfocus-visible:ring-2",
  },
  {
    name: "Zustand",
    label: "State without the noise.",
    group: "Connect",
    icon: Database,
    color: "#ddbb9c",
    description:
      "Shared application state for connected controls and multi-step experiences.",
    code: "const { selectedAsset }\n  = useStudioStore();\n\n// One source of truth.",
  },
  {
    name: "React Query",
    label: "Keep the UI in sync.",
    group: "Connect",
    icon: RefreshCw,
    color: "#f0a1ad",
    description:
      "API data, caching, and loading states that keep the interface responsive.",
    code: "useQuery({\n  queryKey: ['assets'],\n  queryFn: fetchAssets,\n});",
  },
  {
    name: "Jest",
    label: "Confidence in the details.",
    group: "Refine",
    icon: FlaskConical,
    color: "#d9a9ce",
    description:
      "Focused tests for the behavior that matters, including the awkward edge cases.",
    code: "expect(result)\n  .toEqual(expected);\n\n// Check the behavior.",
  },
  {
    name: "Playwright",
    label: "Try the whole journey.",
    group: "Refine",
    icon: ScanLine,
    color: "#afd6a9",
    description:
      "Browser tests for real interactions, keyboard access, and responsive experiences.",
    code: "await page\n  .getByRole('button')\n  .click();",
  },
  {
    name: "Figma",
    label: "An eye before the code.",
    group: "Refine",
    icon: PenTool,
    color: "#c6b0ef",
    description:
      "Exploring layouts and interaction details where design meets implementation.",
    code: "Idea → Layout\n     → Interaction\n     → Implementation",
  },
  {
    name: "Git",
    label: "Small changes. Clear history.",
    group: "Workflow",
    icon: GitBranch,
    color: "#e9a18f",
    description:
      "Reviewable changes, collaboration, and careful integration into a shared codebase.",
    code: "feature → review\n        → refine\n        → merge",
  },
  {
    name: "Cursor",
    label: "A faster feedback loop.",
    group: "Workflow",
    icon: Terminal,
    color: "#c5c7d6",
    description:
      "AI-assisted editing with close attention to the code, context, and final behavior.",
    code: "Understand the task.\nMake the change.\nReview the result.",
  },
  {
    name: "AI assistants",
    label: "Assisted. Still considered.",
    group: "Workflow",
    icon: Sparkles,
    color: "#e7c493",
    description:
      "Claude, Copilot, and Codex support the process. I review, test, and own the result.",
    code: "Context → Explore\n        → Verify\n        → Refine",
  },
];
const groups = ["All", "Build", "Connect", "Refine", "Workflow"];
export function SkillPlayground() {
  const [selected, setSelected] = useState(0);
  const [group, setGroup] = useState("All");
  const skill = skills[selected];
  const Icon = skill.icon;
  function filter(next: string) {
    setGroup(next);
    if (next !== "All" && skill.group !== next)
      setSelected(skills.findIndex((s) => s.group === next));
  }
  return (
    <section
      className="skill-playground"
      aria-labelledby="skills-heading"
      data-reveal
      style={{ "--skill-color": skill.color } as CSSProperties}
    >
      <div className="skills-heading">
        <div>
          <span className="section-index">The everyday toolkit</span>
          <h3 id="skills-heading">
            Different tools.
            <br />
            <span>One considered experience.</span>
          </h3>
        </div>
        <p>
          Select a tool.
          <br />
          See where it fits.
        </p>
      </div>
      <div
        className="skill-filters"
        role="group"
        aria-label="Filter technologies"
      >
        {groups.map((g) => (
          <button key={g} aria-pressed={group === g} onClick={() => filter(g)}>
            {g}
          </button>
        ))}
      </div>
      <div className="skills-workbench">
        <div
          className="skill-nodes"
          role="group"
          aria-label="Explore technologies"
        >
          {skills.map((s, i) => {
            const NodeIcon = s.icon;
            return (
              <button
                hidden={group !== "All" && s.group !== group}
                key={s.name}
                className="skill-node"
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
                style={{ "--node-color": s.color } as CSSProperties}
              >
                <span className="skill-node-icon">
                  <NodeIcon size={29} strokeWidth={1.35} />
                </span>
                <span>{s.name}</span>
                <ArrowUpRight className="skill-node-arrow" size={12} />
              </button>
            );
          })}
        </div>
        <div className="skill-detail" aria-live="polite" aria-atomic="true">
          <div className="skill-detail-top">
            <span>
              {skill.group} / {String(selected + 1).padStart(2, "0")}
            </span>
            <span className="skill-signal">In my toolkit</span>
          </div>
          <div className="skill-visual" aria-hidden="true">
            <div className="skill-orbit orbit-one" />
            <div className="skill-orbit orbit-two" />
            <div className="skill-orbit orbit-three" />
            <div className="skill-core" key={skill.name}>
              <Icon size={58} strokeWidth={1} />
            </div>
            <span className="skill-satellite satellite-one" />
            <span className="skill-satellite satellite-two" />
          </div>
          <div className="skill-detail-copy" key={skill.label}>
            <span className="skill-name">{skill.name}</span>
            <h4>{skill.label}</h4>
            <p>{skill.description}</p>
            <pre aria-label={`${skill.name} illustrative snippet`}>
              <code>{skill.code}</code>
            </pre>
          </div>
        </div>
      </div>
      <div className="skills-footnote">
        <span>Design → Build → Connect → Refine</span>
        <span>The tools change. The care stays.</span>
      </div>
    </section>
  );
}
