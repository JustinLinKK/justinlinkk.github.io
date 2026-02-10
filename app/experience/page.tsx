// app/experience/page.tsx

type ExperienceItem = {
  org: string;
  meta?: string;
  title: string;
  impact?: string;
  bullets: string[];
  highlights?: { label: string; href: string }[];
};

type SubRole = {
  title: string;
  meta: string;
  bullets: string[];
};

export default function ExperiencePage() {
  const work: ExperienceItem[] = [
    {
      org: "MediumAI",
      meta: "Jan 2023 - Present",
      title: "Co-Founder & Software Engineer",
      impact: "Impact: Shipped multilingual RAG pipelines and production deployment infrastructure.",
      bullets: [
        "Built production RAG LLM pipelines for multilingual medical transcription and documentation.",
        "Expanded the pipeline for multimodal inputs with privacy-sensitive preprocessing.",
        "Led R&D planning and delivery using GitHub and Jira.",
        "Developed UI and new product features with HeroUI and Tailwind.",
      ],
      highlights: [
        { label: "The Product of MediumAI", href: "https://medium-ai-scribe.squarespace.com/scribe-family-doctor" },
        { label: "First-success post", href: "https://www.linkedin.com/posts/justinlinkk_on-november-20-mcmaster-universitys-entrepreneurial-activity-7265823373262221312-10pO" },
        { label: "New voice agent project", href: "https://talktomedi.com/" },
      ],
    },
    {
      org: "Sun Yat-sen University",
      meta: "May - Aug 2023",
      title: "Computer Science RA Intern",
      impact: "Impact: Enabled physics simulation workflows with MLP solvers and 3D data tooling.",
      bullets: [
        "Developed neural-network models for physics simulation and differential equation solving.",
        "Researched MLP solvers with NVIDIA Modulus for differential equations.",
        "Processed and visualized 3D scan datasets using Open3D and ParaView.",
        "Built dataset conversion tooling for 3D scans and STL files.",
      ],
    },
  ];

  const ieeeSubroles: SubRole[] = [
    {
      title: "Branch Treasurer",
      meta: "May 2024 - May 2025",
      bullets: [
        "Managed financial activities including maintaining balanced accounts, preparing budget for the Student Branch Annual Plan, overseeing fundraiser efforts, and directing office and laboratory inventory management.",
      ],
    },
    {
      title: "Branch Vice-Chair",
      meta: "May 2023 - May 2024",
      bullets: [
        "Engaged in Student Branch meetings, resolving conflicts related to branch management between the main team and chapter executives.",
        "Organized technical workshops including soldering and eye-tracking training; supervised lab instruments and provided hardware/embedded design guidance for capstone projects.",
      ],
    },
  ];

  return (
    <section className="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(13,15,22,0.4)] backdrop-blur">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Experience</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/70">
          Highlights from software, research, and hardware work.
        </p>
      </div>

      <div className="experience-content">
        <div className="experience-grid">
          {/* Work Experience */}
          <section className="experience-card">
            <h2 className="experience-heading">Work experience</h2>
            <div className="timeline">
              {work.map((item) => (
                <div key={`${item.org}-${item.meta}`} className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="experience-item-header">
                    <span className="experience-role">{item.org}</span>
                    {item.meta ? <span className="experience-meta">{item.meta}</span> : null}
                  </div>
                  <div className="experience-item-subtitle">{item.title}</div>
                  {item.impact ? <div className="experience-impact">{item.impact}</div> : null}

                  <ul className="experience-list">
                    {item.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>

                  {item.highlights?.length ? (
                    <div className="experience-highlights">
                      <span>Highlights:</span>
                      {item.highlights.map((h) => (
                        <a key={h.href} href={h.href} target="_blank" rel="noreferrer">
                          {h.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Extracurricular Experience */}
          <section className="experience-card">
            <h2 className="experience-heading">Extracurricular experience</h2>

            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-dot" />
                <div className="experience-item-header">
                  <span className="experience-role">IEEE McMaster Student Branch</span>
                  <span className="experience-meta">Hamilton, Canada</span>
                </div>

                {ieeeSubroles.map((sr) => (
                  <div key={`${sr.title}-${sr.meta}`} className="experience-subrole">
                    <div className="experience-item-subtitle">
                      {sr.title} · {sr.meta}
                    </div>
                    <ul className="experience-list">
                      {sr.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="timeline-item">
                <span className="timeline-dot" />
                <div className="experience-item-header">
                  <span className="experience-role">MAC RoboMaster</span>
                </div>

                <div className="experience-subrole">
                  <div className="experience-item-subtitle">
                    Computer Vision Engineer · Sep 2022 - Aug 2023
                  </div>
                  <ul className="experience-list">
                    <li>
                      Used a YOLOv5 model with a custom dataset to build an object-tracking pipeline; deployed on Jetson
                      with UART-based communication to the main controller.
                    </li>
                    <li>
                      Trained and tested convolutional neural networks on Jetson for object detection across diverse environments.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="experience-card">
            <h2 className="experience-heading">Education</h2>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-dot" />
                <div className="experience-item-header">
                  <span className="experience-role">University of California, San Diego</span>
                  <span className="experience-meta">Sept 2025 - Present</span>
                </div>
                <div className="experience-item-subtitle">M.S. in Computer Engineering</div>
              </div>

              <div className="timeline-item">
                <span className="timeline-dot" />
                <div className="experience-item-header">
                  <span className="experience-role">McMaster University</span>
                  <span className="experience-meta">Sept 2020 - June 2025</span>
                </div>
                <div className="experience-item-subtitle">B.Eng. in Electrical Engineering & Management</div>
              </div>
            </div>
          </section>

          {/* Awards */}
          <section className="experience-card experience-card--awards">
            <h2 className="experience-heading">Awards</h2>
            <ul className="experience-awards">
              <li>Dean&apos;s Honour List (2025, 2023, 2021)</li>
              <li>McMaster Honour Award (2020)</li>
              <li>
                <a
                  href="https://www.scholarshipca.com/scholarships/mcmaster-university-dr-rudolf-de-buda-scholarship-2024"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dr. Rudolf De Buda Scholarship (2025)
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
