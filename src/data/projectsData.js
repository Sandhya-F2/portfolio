// Default project data for the portfolio
const defaultProjects = [
  {
    id: '1',
    name: 'Weather-Backend',
    description: 'A robust backend service for weather data retrieval and forecasting. Built with scalable architecture for real-time weather information.',
    tech: ['Node.js', 'Express', 'REST API', 'Cloud'],
    github: 'https://github.com/symon-br/Weather-Backend',
    demo: '#',
    icon: 'fas fa-cloud-sun',
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'My_Portfolio',
    description: 'A personal portfolio website showcasing projects, skills, and professional experience. Built with React and modern design principles.',
    tech: ['React', 'CSS3', 'Framer Motion', 'Vite'],
    github: 'https://github.com/symon-br/My_Portfolio',
    demo: '#',
    icon: 'fas fa-briefcase',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    status: 'completed',
    date: '2024-06-20',
  },
  {
    id: '3',
    name: 'E-Commerce Dashboard',
    description: 'A comprehensive analytics dashboard for e-commerce platforms with real-time data visualization and reporting.',
    tech: ['React', 'D3.js', 'Node.js', 'MongoDB'],
    github: '#',
    demo: '#',
    icon: 'fas fa-chart-line',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    status: 'in-progress',
    date: '2025-01-10',
  },
]

export function loadProjects() {
  try {
    const stored = localStorage.getItem('portfolio-projects')
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultProjects
}

export function saveProjects(projects) {
  try {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects))
  } catch {
    // Storage quota exceeded or unavailable (private mode) — non-fatal.
  }
}

export { defaultProjects }
