export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              Himani<span>.</span>
            </h3>
            <p>Software Developer | Building the web, one line at a time.</p>
          </div>

          <nav className="footer-socials" aria-label="Social media links">
            <a
              href="https://github.com/Sandhya-F2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
            <a
              href="https://linkedin.com/in/himanitimilsena"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <i className="fab fa-linkedin-in" aria-hidden="true"></i>
            </a>
            <a
              href="mailto:sandhyatimilsena@gmail.com"
              aria-label="Send Email"
            >
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </a>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Himani Timilsena. All rights reserved.
            Built with React.
          </p>
        </div>
      </div>
    </footer>
  );
}
