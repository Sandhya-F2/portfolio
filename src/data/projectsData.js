// Default project data for the portfolio
const defaultProjects = [
  {
    id: "1",
    name: "My_Portfolio",
    description:
      "A personal portfolio website showcasing projects, skills, and professional experience. Built with React and modern design principles.",
    tech: ["React", "CSS3", "Framer Motion", "Vite"],
    github: "https://github.com/Sandhya-F2/portfolio",
    demo: "#",
    icon: "fas fa-briefcase",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    status: "completed",
    date: "2024-06-20",
  },
  {
    id: "2",
    name: "E-Commerce Dashboard",
    description:
      "A comprehensive analytics dashboard for e-commerce platforms with real-time data visualization and reporting.",
    tech: ["React", "D3.js", "Node.js", "MongoDB"],
    github: "#",
    demo: "#",
    icon: "fas fa-chart-line",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    status: "in-progress",
    date: "2025-01-10",
  },
];

function sanitizeProject(project, index) {
  return {
    id: project?.id ?? `${index + 1}`,
    name:
      typeof project?.name === "string" ? project.name : `Project ${index + 1}`,
    description:
      typeof project?.description === "string" ? project.description : "",
    tech: Array.isArray(project?.tech) ? project.tech : [],
    github: typeof project?.github === "string" ? project.github : "#",
    demo: typeof project?.demo === "string" ? project.demo : "#",
    icon: typeof project?.icon === "string" ? project.icon : "fas fa-code",
    gradient:
      typeof project?.gradient === "string"
        ? project.gradient
        : "linear-gradient(135deg, #0ea5e9, #6366f1)",
    status: typeof project?.status === "string" ? project.status : "completed",
    date:
      typeof project?.date === "string"
        ? project.date
        : new Date().toISOString(),
  };
}

export function normalizeProjects(value) {
  if (!Array.isArray(value)) return defaultProjects;

  return value
    .filter((project) => project && typeof project === "object")
    .map((project, index) => sanitizeProject(project, index));
}

export function loadProjects() {
  try {
    const stored = localStorage.getItem("portfolio-projects");
    if (!stored) return defaultProjects;

    const parsed = JSON.parse(stored);
    return normalizeProjects(parsed);
  } catch {
    return defaultProjects;
  }
}

export function saveProjects(projects) {
  try {
    const normalized = normalizeProjects(projects);
    localStorage.setItem("portfolio-projects", JSON.stringify(normalized));
  } catch {
    // Storage quota exceeded or unavailable (private mode) — non-fatal.
  }
}

export { defaultProjects };
