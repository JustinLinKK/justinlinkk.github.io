import Section from "../../components/Section";

export default function CvDownloadPage() {
  return (
    <Section
      title="CV Download"
      subtitle="Choose the version that best matches the role you are looking for."
    >
      <div className="cv-download">
        <div className="cv-download__intro">
          <p className="cv-download__lead">
            Two tailored resumes highlight either hardware systems or software
            engineering depth. Pick the track that aligns with your interests.
          </p>
          <div className="cv-download__meta">
            <span>Formats: PDF</span>
            <span>Last updated: 2026</span>
          </div>
        </div>

        <div className="cv-download__grid">
          <article className="cv-download-card cv-download-card--hardware">
            <div>
              <p className="cv-download__label">Hardware</p>
              <h3>Embedded + ASIC Resume</h3>
              <p>
                Focused on embedded design, ASIC design, and
                cross-disciplinary integration.
              </p>
            </div>
            <ul className="cv-download__list">
              <li>Embedded systems, ASIC design</li>
              <li>Robotics, sensors, and instrumentation</li>
            </ul>
            <a
              className="cv-download__button"
              href="/files/Justin_Lin_Resume_Hardware.pdf"
              download
            >
              Download hardware CV
            </a>
          </article>

          <article className="cv-download-card cv-download-card--software">
            <div>
              <p className="cv-download__label">Software</p>
              <h3>Software + AI Resume</h3>
              <p>
                Emphasizes production software, applied AI, and product-focused
                delivery.
              </p>
            </div>
            <ul className="cv-download__list">
              <li>Full-stack engineering + APIs</li>
              <li>LLMs, RAG, and ML deployment</li>
              <li>Product experimentation + UX delivery</li>
            </ul>
            <a
              className="cv-download__button"
              href="/files/Justin_Lin_Resume_Software.pdf"
              download
            >
              Download software CV
            </a>
          </article>
        </div>
      </div>
    </Section>
  );
}
