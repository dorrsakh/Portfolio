import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/data/config";
import { Calendar, MapPin } from "lucide-react";

/**
 * Experience Section - Timeline of work experience
 * Features animated timeline with job details and technologies
 */
export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

      // Animate timeline items
      const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
      if (timelineItems) {
        gsap.fromTo(
          timelineItems,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 md:py-32 relative bg-background/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center"
        >
          Experience
        </h2>

        {/* Timeline */}
        <div ref={timelineRef} className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="timeline-item relative pl-20 md:pl-24"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-background shadow-lg" />

                  {/* Content Card */}
                  <div className="bg-background/50 border border-border rounded-xl p-6 hover:bg-background hover:border-border/80 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-bold mb-1">
                        {experience.position}
                      </h3>
                      <h4 className="text-lg text-foreground/90 mb-3">
                        {experience.company}
                      </h4>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {experience.startDate} - {experience.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-2 mb-4">
                      {experience.description.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-blue-400 mt-2">▹</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full bg-accent/50 text-foreground/80 border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

