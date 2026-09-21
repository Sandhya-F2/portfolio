import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production (Vercel), environment variables come from vercel.json or dashboard.
// In development, load server/.env if it exists.
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  JWT_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn(
    "WARNING: JWT_SECRET not set — using a generated ephemeral secret. Set JWT_SECRET in server/.env or Vercel dashboard for production.",
  );
} else if (JWT_SECRET.length < 32) {
  console.warn(
    "WARNING: JWT_SECRET is shorter than 32 characters. Use a long random string.",
  );
}

let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
if (!ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD) {
  ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
  console.warn(
    "WARNING: derived ADMIN_PASSWORD_HASH from plaintext ADMIN_PASSWORD env. Prefer setting ADMIN_PASSWORD_HASH directly.",
  );
}

// Middleware
app.set("trust proxy", 1);
// Helmet for security headers. CSP disabled: the frontend uses Google Fonts,
// cdnjs and inline styles which a default CSP would break.
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      // In production (Vercel), allow same-origin requests
      if (isProduction) return callback(null, true);
      // In development, allow configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

// Brute-force protection for the single-password login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

// Data file paths
const dataDir = path.join(__dirname, "data");
const projectsFile = path.join(dataDir, "projects.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readProjects() {
  try {
    if (fs.existsSync(projectsFile)) {
      const parsed = JSON.parse(fs.readFileSync(projectsFile, "utf-8"));
      if (Array.isArray(parsed)) return parsed;
      console.error(
        "projects.json is corrupt (not an array) — serving empty list, file left untouched.",
      );
    }
  } catch (err) {
    console.error(
      "Failed to read projects.json — serving empty list, file left untouched.",
      err.message,
    );
  }
  return [];
}

function writeProjects(projects) {
  // Atomic write: tmp file + rename, so a crash never leaves a truncated file.
  const tmpFile = `${projectsFile}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(projects, null, 2));
  fs.renameSync(tmpFile, projectsFile);
}

function initializeDefaultProjects() {
  if (!fs.existsSync(projectsFile)) {
    const defaults = [
      {
        id: crypto.randomUUID(),
        name: "Weather-Backend",
        description:
          "A robust backend service for weather data retrieval and forecasting.",
        tech: ["Node.js", "Express", "REST API", "Cloud"],
        github: "https://github.com/symon-br/Weather-Backend",
        demo: "#",
        icon: "fas fa-cloud-sun",
        gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
        status: "completed",
        date: "2024-01-15",
      },
      {
        id: crypto.randomUUID(),
        name: "My_Portfolio",
        description:
          "A personal portfolio website built with React, Vite, and modern design.",
        tech: ["React", "CSS3", "Framer Motion", "Vite"],
        github: "https://github.com/symon-br/My_Portfolio",
        demo: "#",
        icon: "fas fa-briefcase",
        gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
        status: "completed",
        date: "2024-06-20",
      },
      {
        id: crypto.randomUUID(),
        name: "E-Commerce Dashboard",
        description:
          "A comprehensive analytics dashboard for e-commerce platforms.",
        tech: ["React", "D3.js", "Node.js", "MongoDB"],
        github: "#",
        demo: "#",
        icon: "fas fa-chart-line",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        status: "in-progress",
        date: "2025-01-10",
      },
    ];
    writeProjects(defaults);
  }
}

initializeDefaultProjects();

// ==================== BLOG POSTS STORE ====================
const postsFile = path.join(dataDir, "posts.json");

function readPosts() {
  try {
    if (fs.existsSync(postsFile)) {
      const parsed = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
      if (Array.isArray(parsed)) return parsed;
      console.error(
        "posts.json is corrupt (not an array) — serving empty list, file left untouched.",
      );
    }
  } catch (err) {
    console.error(
      "Failed to read posts.json — serving empty list, file left untouched.",
      err.message,
    );
  }
  return [];
}

function writePosts(posts) {
  // Atomic write: tmp file + rename, so a crash never leaves a truncated file.
  const tmpFile = `${postsFile}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(posts, null, 2));
  fs.renameSync(tmpFile, postsFile);
}

function sortPostsByDateDesc(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function initializeDefaultPosts() {
  if (!fs.existsSync(postsFile)) {
    const defaults = [
      {
        id: crypto.randomUUID(),
        title: "Why Clean Code Matters More Than You Think",
        excerpt:
          "Exploring how writing clean, maintainable code saves time and reduces bugs in the long run.",
        content: `Clean code is not about being clever — it is about being kind to the next person who reads your work, who is very often yourself six months later.

When code is readable, bugs become easier to spot, reviews go faster, and new features slot in without fear. Teams that invest in naming, small functions, and consistent structure ship more predictably than teams that chase shortcuts.

Start small: pick one file this week and leave it cleaner than you found it. That habit compounds faster than any framework upgrade.`,
        tags: ["Clean Code", "Best Practices"],
        icon: "fas fa-book",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        status: "published",
        date: "2024-12-15",
      },
      {
        id: crypto.randomUUID(),
        title: "Getting Started with React Server Components",
        excerpt:
          "A beginner-friendly guide to understanding and implementing React Server Components in your next project.",
        content: `React Server Components let you render parts of your UI on the server, sending less JavaScript to the browser while keeping the interactivity you expect.

The mental model is simple: server components fetch data and render static output, while client components handle state and events. You can mix both in the same tree.

Try converting one data-heavy page in your app first. Measure the bundle size before and after — the difference is usually what convinces the whole team.`,
        tags: ["React", "Tutorial"],
        icon: "fab fa-react",
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
        status: "published",
        date: "2024-11-28",
      },
      {
        id: crypto.randomUUID(),
        title: "Top 5 API Design Patterns for 2024",
        excerpt:
          "Discover the most effective API design patterns that make your backend robust and developer-friendly.",
        content: `Good API design is a user interface for developers. Consistent naming, predictable status codes, and clear errors matter more than clever architecture.

My top patterns: versioned routes, pagination on every list endpoint, idempotency keys for writes, meaningful error payloads, and rate-limit headers clients can actually read.

Pick one API you maintain and audit it against this list. Small, boring consistency is what developers remember and recommend.`,
        tags: ["API", "Backend"],
        icon: "fas fa-code",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        status: "published",
        date: "2024-11-10",
      },
    ];
    writePosts(defaults);
  }
}

initializeDefaultPosts();

// ==================== AUTH MIDDLEWARE ====================
function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// ==================== AUTH ROUTES ====================
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    if (!ADMIN_PASSWORD_HASH) {
      return res.status(500).json({ error: "Server configuration error." });
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    res.json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });
  res.json({ success: true, message: "Logged out successfully." });
});

app.get("/api/auth/check", (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.status(403).json({ authenticated: false });
  }
});

// ==================== PROJECTS ROUTES ====================
const STATUS_VALUES = ["completed", "in-progress", "planned"];

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateProjectInput(body, { partial = false } = {}) {
  const errors = [];
  const check = (field, validator, message) => {
    if (body[field] === undefined) {
      if (
        !partial &&
        (field === "name" ||
          field === "description" ||
          field === "tech" ||
          field === "github" ||
          field === "date")
      ) {
        errors.push(`${field} is required.`);
      }
      return;
    }
    if (!validator(body[field])) errors.push(message);
  };

  check(
    "name",
    (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 200,
    "Name must be a non-empty string (max 200 chars).",
  );
  check(
    "description",
    (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 2000,
    "Description must be a non-empty string (max 2000 chars).",
  );
  check(
    "tech",
    (v) =>
      Array.isArray(v) &&
      v.length > 0 &&
      v.length <= 20 &&
      v.every(
        (t) => typeof t === "string" && t.trim().length > 0 && t.length <= 50,
      ),
    "Tech must be a non-empty array of strings (max 20 items, 50 chars each).",
  );
  check(
    "github",
    (v) => typeof v === "string" && isHttpUrl(v),
    "Github must be a valid http(s) URL.",
  );
  check(
    "demo",
    (v) =>
      typeof v === "string" &&
      (v === "" || v === "#" || isHttpUrl(v)) &&
      v.length <= 500,
    "Demo must be a valid http(s) URL.",
  );
  check(
    "icon",
    (v) => typeof v === "string" && v.length <= 100,
    "Icon must be a string (max 100 chars).",
  );
  check(
    "gradient",
    (v) => typeof v === "string" && v.length <= 200,
    "Gradient must be a string (max 200 chars).",
  );
  check(
    "status",
    (v) => typeof v === "string" && STATUS_VALUES.includes(v),
    `Status must be one of: ${STATUS_VALUES.join(", ")}.`,
  );
  check(
    "date",
    (v) => typeof v === "string" && !Number.isNaN(Date.parse(v)),
    "Date must be a valid date string.",
  );
  return errors;
}

// Get all projects (public — no auth required for viewing)
app.get("/api/projects", (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// Get single project
app.get("/api/projects/:id", (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find((p) => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch {
    res.status(500).json({ error: "Failed to fetch project." });
  }
});

// Create project (protected)
app.post("/api/projects", authenticateToken, (req, res) => {
  try {
    const inputErrors = validateProjectInput(req.body);
    if (inputErrors.length > 0) {
      return res.status(400).json({ error: inputErrors.join(" ") });
    }
    const {
      name,
      description,
      tech,
      github,
      demo,
      icon,
      gradient,
      status,
      date,
    } = req.body;

    const projects = readProjects();
    const newProject = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      tech: tech.map((t) => t.trim()),
      github,
      demo: demo || "#",
      icon: icon || "fas fa-code",
      gradient: gradient || "linear-gradient(135deg, #0ea5e9, #6366f1)",
      status: status || "in-progress",
      date,
    };

    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Failed to create project." });
  }
});

// Update project (protected)
app.put("/api/projects/:id", authenticateToken, (req, res) => {
  try {
    const inputErrors = validateProjectInput(req.body, { partial: true });
    if (inputErrors.length > 0) {
      return res.status(400).json({ error: inputErrors.join(" ") });
    }
    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Project not found." });

    const {
      name,
      description,
      tech,
      github,
      demo,
      icon,
      gradient,
      status,
      date,
    } = req.body;
    projects[index] = {
      ...projects[index],
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(tech !== undefined && { tech }),
      ...(github !== undefined && { github }),
      ...(demo !== undefined && { demo }),
      ...(icon !== undefined && { icon }),
      ...(gradient !== undefined && { gradient }),
      ...(status !== undefined && { status }),
      ...(date !== undefined && { date }),
    };

    writeProjects(projects);
    res.json(projects[index]);
  } catch {
    res.status(500).json({ error: "Failed to update project." });
  }
});

// Delete project (protected)
app.delete("/api/projects/:id", authenticateToken, (req, res) => {
  try {
    const projects = readProjects();
    const filtered = projects.filter((p) => p.id !== req.params.id);
    if (filtered.length === projects.length) {
      return res.status(404).json({ error: "Project not found." });
    }
    writeProjects(filtered);
    res.json({ success: true, message: "Project deleted." });
  } catch {
    res.status(500).json({ error: "Failed to delete project." });
  }
});

// ==================== BLOG POSTS ROUTES ====================
// Public can read published posts; admins (valid JWT cookie) also see drafts.
const POST_STATUS_VALUES = ["draft", "published"];

function validatePostInput(body, { partial = false } = {}) {
  const errors = [];
  const check = (field, validator, message, required = false) => {
    if (body[field] === undefined) {
      if (!partial && required) errors.push(`${field} is required.`);
      return;
    }
    if (!validator(body[field])) errors.push(message);
  };

  check(
    "title",
    (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 200,
    "Title must be a non-empty string (max 200 chars).",
    true,
  );
  check(
    "excerpt",
    (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 500,
    "Excerpt must be a non-empty string (max 500 chars).",
    true,
  );
  check(
    "content",
    (v) => typeof v === "string" && v.trim().length > 0 && v.length <= 50000,
    "Content must be a non-empty string (max 50000 chars).",
    true,
  );
  check(
    "tags",
    (v) =>
      Array.isArray(v) &&
      v.length <= 10 &&
      v.every(
        (t) => typeof t === "string" && t.trim().length > 0 && t.length <= 30,
      ),
    "Tags must be an array of strings (max 10 items, 30 chars each).",
  );
  check(
    "icon",
    (v) => typeof v === "string" && v.length <= 100,
    "Icon must be a string (max 100 chars).",
  );
  check(
    "gradient",
    (v) => typeof v === "string" && v.length <= 200,
    "Gradient must be a string (max 200 chars).",
  );
  check(
    "status",
    (v) => typeof v === "string" && POST_STATUS_VALUES.includes(v),
    `Status must be one of: ${POST_STATUS_VALUES.join(", ")}.`,
  );
  check(
    "date",
    (v) => typeof v === "string" && !Number.isNaN(Date.parse(v)),
    "Date must be a valid date string.",
    true,
  );
  return errors;
}

function optionalAuth(req, _res, next) {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Invalid/expired token → treat as a public visitor, not an error.
    }
  }
  next();
}

// Get all posts (public sees published only; admins see everything)
app.get("/api/posts", optionalAuth, (req, res) => {
  try {
    const posts = sortPostsByDateDesc(readPosts());
    if (req.user?.admin) return res.json(posts);
    res.json(posts.filter((p) => p.status !== "draft"));
  } catch {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// Get single post (drafts hidden from the public)
app.get("/api/posts/:id", optionalAuth, (req, res) => {
  try {
    const posts = readPosts();
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.status === "draft" && !req.user?.admin) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

// Create post (protected)
app.post("/api/posts", authenticateToken, (req, res) => {
  try {
    const inputErrors = validatePostInput(req.body);
    if (inputErrors.length > 0) {
      return res.status(400).json({ error: inputErrors.join(" ") });
    }
    const { title, excerpt, content, tags, icon, gradient, status, date } =
      req.body;

    const posts = readPosts();
    const newPost = {
      id: crypto.randomUUID(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean)
        : [],
      icon: icon || "fas fa-book",
      gradient: gradient || "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      status: status || "published",
      date,
    };

    posts.push(newPost);
    writePosts(posts);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// Update post (protected)
app.put("/api/posts/:id", authenticateToken, (req, res) => {
  try {
    const inputErrors = validatePostInput(req.body, { partial: true });
    if (inputErrors.length > 0) {
      return res.status(400).json({ error: inputErrors.join(" ") });
    }
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Post not found." });

    const { title, excerpt, content, tags, icon, gradient, status, date } =
      req.body;
    posts[index] = {
      ...posts[index],
      ...(title !== undefined && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
      ...(icon !== undefined && { icon }),
      ...(gradient !== undefined && { gradient }),
      ...(status !== undefined && { status }),
      ...(date !== undefined && { date }),
    };

    writePosts(posts);
    res.json(posts[index]);
  } catch {
    res.status(500).json({ error: "Failed to update post." });
  }
});

// Delete post (protected)
app.delete("/api/posts/:id", authenticateToken, (req, res) => {
  try {
    const posts = readPosts();
    const filtered = posts.filter((p) => p.id !== req.params.id);
    if (filtered.length === posts.length) {
      return res.status(404).json({ error: "Post not found." });
    }
    writePosts(filtered);
    res.json({ success: true, message: "Post deleted." });
  } catch {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// Unknown API endpoints → JSON 404 (must come before static serving)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

// ==================== PRODUCTION SERVING ====================
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // GET-only SPA fallback: never swallow API calls or non-GET methods.
  // Skip file-like paths so a missing asset returns 404 instead of
  // index.html with status 200.
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (/\.[a-zA-Z0-9]+$/.test(req.path)) return next();
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📁 Admin protected by server-side JWT authentication`);
    console.log(`🔒 HTTP-only cookies with bcrypt password hashing`);
  });
}

export default app;
