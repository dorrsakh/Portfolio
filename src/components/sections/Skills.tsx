import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/data/config";

/**
 * Skills Section - Showcase technical skills with animations
 * Features categorized skills with level indicators and staggered animations
 */
export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate title
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate skill cards
      const skillCards = skillsRef.current?.querySelectorAll(".skill-card");
      if (skillCards) {
        gsap.fromTo(
          skillCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "advanced":
        return "bg-gradient-to-r from-blue-500 to-cyan-600";
      case "intermediate":
        return "bg-gradient-to-r from-yellow-500 to-orange-600";
      default:
        return "bg-gray-500";
    }
  };

  const getLevelWidth = (level: string) => {
    switch (level) {
      case "expert":
        return "w-full";
      case "advanced":
        return "w-4/5";
      case "intermediate":
        return "w-3/5";
      default:
        return "w-2/5";
    }
  };

  const categories = [
    { name: "Frontend", value: "frontend" },
    { name: "Backend", value: "backend" },
    { name: "Tools", value: "tools" },
    { name: "Design", value: "design" },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-32 relative bg-background/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center"
        >
          Skills & Technologies
        </h2>

        {/* Skills Grid */}
        <div ref={skillsRef} className="space-y-12">
          {categories.map((category) => {
            const categorySkills = skills.filter(
              (skill) => skill.category === category.value
            );

            if (categorySkills.length === 0) return null;

            return (
              <div key={category.value} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground/90">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="skill-card p-4 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-border/80 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        <span className="text-sm text-foreground/60 capitalize">
                          {skill.level}
                        </span>
                      </div>
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)} transition-all duration-1000`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

