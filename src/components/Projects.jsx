import { motion, useReducedMotion } from 'framer-motion'
import { useProjects } from '../context/useProjects'

export default function Projects() {
  const { projects, loading } = useProjects()
  const shouldReduceMotion = useReducedMotion()

  const variants = shouldReduceMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  }

  return (
    <section id="projects" className="projects section" aria-label="My Projects">
      <div className="container">
        <motion.div {...variants}>
          <h2>My Projects</h2>
          <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
            Here are some of my recent work. Each project reflects my passion for 
            clean code and innovative solutions.
          </p>
        </motion.div>

        <div className="projects-grid">
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects to show yet. Check back soon.</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id || `${project.name}-${index}`}
                {...(shouldReduceMotion ? {} : {
                  initial: { opacity: 0, y: 40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: index * 0.15 },
                  whileHover: { y: -8 },
                })}
              >
                <article className="project-card">
                  <div className="project-card-image" style={{ background: project.gradient }} aria-hidden="true">
                    <i className={project.icon || 'fas fa-code'}></i>
                  </div>
                  <div className="project-card-body">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {(project.tech || []).map((t) => (
                        <span key={t} className="project-tag">{t}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.github && project.github !== '#' && (
                        <a href={project.github} className="github" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} source code on GitHub`}>
                          <i className="fab fa-github" aria-hidden="true"></i> Code
                        </a>
                      )}
                      {project.demo && project.demo !== '#' && (
                        <a href={project.demo} className="demo" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} demo`}>
                          <i className="fas fa-external-link-alt" aria-hidden="true"></i> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
