import { useState, useEffect, useRef } from 'react'

const CONTACT_EMAIL = 'shinemahi46@gmail.com'
const WHATSAPP_NUMBER = '9779769255575' // +977 Nepal + 9769255575

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [sentVia, setSentVia] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const successTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Please enter your name.'
    if (!formData.email.trim()) {
      next.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!formData.subject.trim()) next.subject = 'Please enter a subject.'
    if (!formData.message.trim()) {
      next.message = 'Please enter a message.'
    } else if (formData.message.trim().length < 10) {
      next.message = 'Message should be at least 10 characters.'
    }
    return next
  }

  const buildMessage = () => {
    const name = formData.name.trim()
    const email = formData.email.trim()
    const subject = formData.subject.trim()
    const message = formData.message.trim()
    return { name, email, subject, message }
  }

  const showSent = (via) => {
    setSentVia(via)
    setFormSubmitted(true)
    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setFormSubmitted(false), 6000)
  }

  const sendViaWhatsApp = () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    const { name, email, subject, message } = buildMessage()
    const text = `Hello Himani, I'm ${name} (${email}).\nSubject: ${subject}\n\n${message}`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
    showSent('WhatsApp')
  }

  const sendViaEmail = () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    const { name, email, subject, message } = buildMessage()
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    showSent('email')
  }

  return (
    <section id="contact" className="contact section" aria-label="Contact">
      <div className="container">
        <h2>Get In Touch</h2>
        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
          Have a project in mind or just want to say hello? Feel free to reach out!
        </p>

        <div className="contact-wrapper" style={{ marginTop: '3rem' }}>
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              I'm always open to discussing new projects, creative ideas, 
              or opportunities to be part of something amazing.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <a href="mailto:shinemahi46@gmail.com">shinemahi46@gmail.com</a>
              </div>
              <div className="contact-item">
                <i className="fab fa-github" aria-hidden="true"></i>
                <a href="https://github.com/symon-br/" target="_blank" rel="noopener noreferrer">
                  github.com/symon-br
                </a>
              </div>
              <div className="contact-item">
                <i className="fab fa-linkedin" aria-hidden="true"></i>
                <a href="https://linkedin.com/in/himanitimilsena" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/himanitimilsena
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send a Message</h3>
            {formSubmitted && (
              <div
                className="form-success"
                role="status"
                aria-live="polite"
                style={{ background: 'var(--accent)', color: '#ffffff', padding: '14px 18px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}
              >
                {sentVia === 'WhatsApp'
                  ? '✅ Opening WhatsApp with your message — just press send there!'
                  : '✅ Opening your email app with your message — just press send there!'}
              </div>
            )}
            <form onSubmit={(e) => e.preventDefault()} noValidate>
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  aria-invalid={errors.name ? 'true' : undefined}
                />
                {errors.name && <div className="form-error" role="alert">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div className="form-error" role="alert">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Project Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.subject ? 'true' : undefined}
                />
                {errors.subject && <div className="form-error" role="alert">{errors.subject}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.message ? 'true' : undefined}
                />
                {errors.message && <div className="form-error" role="alert">{errors.message}</div>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-primary" onClick={sendViaWhatsApp}>
                  <i className="fab fa-whatsapp" aria-hidden="true"></i> Send via WhatsApp
                </button>
                <button type="button" className="btn btn-outline" onClick={sendViaEmail}>
                  <i className="fas fa-envelope" aria-hidden="true"></i> Send via Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
