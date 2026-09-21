import aboutImg from "../assets/about-waterfall.png";

export default function About() {
  return (
    <section id="about" className="about section" aria-label="About Me">
      <div className="container">
        <h2>About Me</h2>
        <p style={{ fontSize: "1.1rem", maxWidth: "600px", marginTop: "1rem" }}>
          Hello, I'm Himani — a passionate Software Developer who loves creating
          innovative web applications and digital experiences. My focus is on
          developing reliable, high-performance solutions while maintaining
          clean architecture and exceptional user experience.
        </p>

        <div className="about-content" style={{ marginTop: "3rem" }}>
          <div>
            <div className="about-image">
              <img
                src={aboutImg}
                alt="Himani standing in front of a waterfall surrounded by green forest"
                className="about-img"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
              />
            </div>
          </div>

          <div>
            <p style={{ marginBottom: "1.5rem" }}>
              I believe technology is most powerful when it solves real-world
              problems. Whether I'm building full-stack applications, designing
              APIs, or learning emerging technologies, I'm always motivated by
              the opportunity to create, improve, and innovate.
            </p>
            <p style={{ marginBottom: "2rem" }}>
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or diving into a good book
              about software engineering.
            </p>

            <div
              className="about-stats"
              role="list"
              aria-label="Career statistics"
            >
              <div className="stat-item" role="listitem">
                <div className="stat-number">3+</div>
                <div className="stat-label">Years Exp.</div>
              </div>
              <div className="stat-item" role="listitem">
                <div className="stat-number">25+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item" role="listitem">
                <div className="stat-number">100+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
