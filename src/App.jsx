import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProjectsProvider } from "./context/ProjectsProvider";
import { PostsProvider } from "./context/PostsProvider";
import {
  NotificationProvider,
  NotificationContainer,
} from "./context/NotificationProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/admin/AdminRoute";

// Lazy loaded page components
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Projects = lazy(() => import("./components/Projects"));
const Skills = lazy(() => import("./components/Skills"));
const Contact = lazy(() => import("./components/Contact"));
const Blog = lazy(() => import("./components/Blog"));
const Resume = lazy(() => import("./components/Resume"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));

function AppContent() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route
              path="*"
              element={
                <div
                  className="container"
                  style={{ padding: "4rem 0", textAlign: "center" }}
                >
                  <h2>Page not found</h2>
                  <p style={{ marginTop: "1rem" }}>
                    The page you&apos;re looking for doesn&apos;t exist.
                  </p>
                  <Link
                    to="/"
                    className="btn btn-primary"
                    style={{ marginTop: "1.5rem", display: "inline-block" }}
                  >
                    Go home
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <PostsProvider>
        <NotificationProvider>
          <div className="app">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <NotificationContainer />
            <AppContent />
          </div>
        </NotificationProvider>
        </PostsProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
