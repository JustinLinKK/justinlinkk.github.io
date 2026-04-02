import Section from "@/components/Section";
import {
  awards,
  educationHistory,
  HighlightLink,
  ieeeSubroles,
  roboMasterRole,
  scholarshipAward,
  workExperience
} from "@/lib/experience";

type TimelineEntryProps = {
  heading: string;
  meta?: string;
  subtitle?: string;
  impact?: string;
  bullets?: string[];
  highlights?: HighlightLink[];
  children?: React.ReactNode;
};

function TimelineEntry({
  heading,
  meta,
  subtitle,
  impact,
  bullets,
  highlights,
  children
}: TimelineEntryProps) {
  return (
    <div className="timeline-item">
      <span className="timeline-dot" />
      <div className="content-item-header">
        <span>{heading}</span>
        {meta ? <span className="content-meta">{meta}</span> : null}
      </div>
      {subtitle ? <div className="content-item-subtitle">{subtitle}</div> : null}
      {impact ? <div className="content-impact">{impact}</div> : null}
      {bullets?.length ? (
        <ul className="content-list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {children}
      {highlights?.length ? (
        <div className="content-highlights">
          <span>Highlights:</span>
          {highlights.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <Section
      title="Experience"
      subtitle="Highlights from software, research, and hardware work."
    >
      <div className="content-collection">
        <div className="content-grid">
          <section className="content-panel">
            <h3 className="content-heading">Work experience</h3>
            <div className="timeline">
              {workExperience.map((item) => (
                <TimelineEntry
                  key={`${item.org}-${item.meta}`}
                  heading={item.org}
                  meta={item.meta}
                  subtitle={item.title}
                  impact={item.impact}
                  bullets={item.bullets}
                  highlights={item.highlights}
                />
              ))}
            </div>
          </section>

          <section className="content-panel">
            <h3 className="content-heading">Extracurricular experience</h3>
            <div className="timeline">
              <TimelineEntry heading="IEEE McMaster Student Branch" meta="Hamilton, Canada">
                {ieeeSubroles.map((role) => (
                  <div key={`${role.title}-${role.meta}`} className="content-subrole">
                    <div className="content-item-subtitle">
                      {role.title} · {role.meta}
                    </div>
                    <ul className="content-list">
                      {role.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TimelineEntry>

              <TimelineEntry
                heading="MAC RoboMaster"
                subtitle={`${roboMasterRole.title} · ${roboMasterRole.meta}`}
                bullets={roboMasterRole.bullets}
              />
            </div>
          </section>

          <section className="content-panel">
            <h3 className="content-heading">Education</h3>
            <div className="timeline">
              {educationHistory.map((item) => (
                <TimelineEntry
                  key={`${item.school}-${item.meta}`}
                  heading={item.school}
                  meta={item.meta}
                  subtitle={item.degree}
                />
              ))}
            </div>
          </section>

          <section className="content-panel">
            <h3 className="content-heading">Awards</h3>
            <ul className="content-awards">
              {awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
              <li>
                <a href={scholarshipAward.href} target="_blank" rel="noreferrer">
                  {scholarshipAward.label}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Section>
  );
}
