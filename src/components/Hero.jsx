import { Link } from 'react-router-dom'
import heroImg from '../assets/Himani.png'

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="subtitle">👋 Hi, I'm</p>
            <h1>Himani Timilsena</h1>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontWeight: 500 }}>Software Developer</h3>
            <p>I love creating innovative web applications and digital experiences. My focus is on developing reliable, high-performance solutions while maintaining clean architecture and exceptional user experience.</p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary">View My Work <i className="fas fa-arrow-right" aria-hidden="true"></i></Link>
              <Link to="/contact" className="btn btn-outline">Contact Me <i className="fas fa-paper-plane" aria-hidden="true"></i></Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-avatar">
              <img src={heroImg} alt="Portrait of Himani Timilsena, Software Developer" className="hero-photo" loading="lazy" decoding="async" width="320" height="320" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
