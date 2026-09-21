const experience = [
  {
    title: 'Software Developer',
    company: 'Tech Solutions Inc.',
    period: '2023 – Present',
    bullets: [
      'Building and maintaining full-stack web applications for enterprise clients',
      'Led the migration of legacy REST APIs to GraphQL, improving performance by 40%',
      'Mentored 3 junior developers and established code review best practices',
    ],
  },
  {
    title: 'Junior Developer',
    company: 'StartUp Labs',
    period: '2021 – 2023',
    bullets: [
      'Developed responsive web interfaces using React and modern CSS',
      'Collaborated with design team to implement pixel-perfect UI components',
      'Optimized application load times, reducing bundle size by 35%',
    ],
  },
  {
    title: 'Frontend Intern',
    company: 'Digital Agency Co.',
    period: '2020 – 2021',
    bullets: [
      'Assisted in building client websites with HTML, CSS, and JavaScript',
      'Created reusable UI components and maintained design system documentation',
      'Participated in daily standups and agile sprints',
    ],
  },
]

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Technology',
    period: '2017 – 2021',
    details: 'Graduated with Honors. GPA: 3.8/4.0',
  },
  {
    degree: 'Full-Stack Web Development Certification',
    institution: 'Online Learning Platform',
    period: '2021',
    details: 'Completed intensive 6-month program covering modern web technologies',
  },
]

export default function Resume() {
  return (
    <section id="resume" className="resume section" aria-label="Resume">
      <div className="container">
        <h2>Resume</h2>
        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
          My professional journey, from education through to my current role. 
          Continuous learning and growth at every step.
        </p>

        <div className="resume-timeline">
          <h3 style={{ marginBottom: '2rem', color: 'var(--text-heading)' }}>
            <i className="fas fa-briefcase" style={{ marginRight: '8px' }} aria-hidden="true"></i>
            Experience
          </h3>

          {experience.map((item, index) => (
            <article key={`${item.title}-${item.company}-${index}`} className="timeline-item">
              <h3>{item.title}</h3>
              <p className="timeline-period">{item.company} • {item.period}</p>
              <ul aria-label={`${item.title} responsibilities`}>
                {item.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}

          <h3 style={{ marginBottom: '2rem', marginTop: '3rem', color: 'var(--text-heading)' }}>
            <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }} aria-hidden="true"></i>
            Education
          </h3>

          {education.map((item, index) => (
            <article key={`${item.degree}-${item.institution}-${index}`} className="timeline-item">
              <h3>{item.degree}</h3>
              <p className="timeline-period">{item.institution} • {item.period}</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{item.details}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
