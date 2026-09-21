import { motion, useReducedMotion } from 'framer-motion'

const skillsData = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'HTML5', 'CSS3', 'SQL'],
  frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Django', 'Flask'],
  tools: ['Git', 'Docker', 'AWS', 'Vite', 'Webpack', 'VS Code'],
  databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  concepts: ['REST APIs', 'GraphQL', 'Microservices', 'CI/CD', 'TDD', 'Agile'],
}

const categories = [
  { key: 'languages', label: 'Languages', icon: 'fas fa-code' },
  { key: 'frameworks', label: 'Frameworks', icon: 'fas fa-layer-group' },
  { key: 'tools', label: 'Tools & DevOps', icon: 'fas fa-tools' },
  { key: 'databases', label: 'Databases', icon: 'fas fa-database' },
  { key: 'concepts', label: 'Core Concepts', icon: 'fas fa-lightbulb' },
]

export default function Skills() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="skills" className="skills section" aria-label="Skills and Expertise">
      <div className="container">
        <h2>Skills & Expertise</h2>
        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
          A comprehensive overview of the technologies and concepts I work with 
          on a daily basis.
        </p>

        <div className="skills-grid">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.key}
              className="skills-category"
              {...(shouldReduceMotion ? {} : {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.5, delay: index * 0.1 },
              })}
            >
              <h3><i className={cat.icon} style={{ marginRight: '8px', color: 'var(--accent)' }} aria-hidden="true"></i>{cat.label}</h3>
              <div className="skills-list" role="list">
                {skillsData[cat.key].map((skill) => (
                  <span key={skill} className="skill-badge" role="listitem">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
