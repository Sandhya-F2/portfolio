import { useState, useReducer, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/resume', label: 'Resume' },
]

function navReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': return !state
    case 'CLOSE': return false
    default: return state
  }
}

export default function Header() {
  const [mobileOpen, dispatch] = useReducer(navReducer, false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const prevPathRef = useRef(location.pathname)

  const isActive = useCallback((path) => location.pathname === path, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname
      dispatch({ type: 'CLOSE' })
    }
  }, [location.pathname])

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="Himani Timilsena - Home">
            Himani<span>.</span>
          </Link>
          <ul id="nav-links" className={`nav-links ${mobileOpen ? 'active' : ''}`} role="menubar">
            {navLinks.map((link) => (
              <li key={link.to} role="none">
                <Link
                  to={link.to}
                  onClick={() => dispatch({ type: 'CLOSE' })}
                  className={isActive(link.to) ? 'active-link' : ''}
                  role="menuitem"
                  style={{
                    color: isActive(link.to) ? 'var(--accent)' : 'var(--text)',
                    fontWeight: isActive(link.to) ? 600 : 500,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li role="none">
                <Link
                  to="/admin"
                  onClick={() => dispatch({ type: 'CLOSE' })}
                  className={isActive('/admin') ? 'active-link' : ''}
                  role="menuitem"
                  style={{
                    color: isActive('/admin') ? 'var(--accent)' : 'var(--text)',
                    fontWeight: isActive('/admin') ? 600 : 500,
                  }}
                >
                  ⚙ Admin
                </Link>
              </li>
            )}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
            <button
              className="nav-toggle"
              onClick={() => dispatch({ type: 'TOGGLE' })}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="nav-links"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
