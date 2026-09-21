import { useState } from 'react'
import { usePosts } from '../context/usePosts'

function readMinutes(content) {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value || ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function paragraphs(content) {
  return (content || '').split(/\n{2,}|\r\n\r\n/).map(p => p.trim()).filter(Boolean)
}

export default function Blog() {
  const { posts, loading } = usePosts()
  const [activeId, setActiveId] = useState(null)

  const active = posts.find(p => p.id === activeId)

  if (loading) {
    return (
      <section id="blog" className="blog section" aria-label="Blog">
        <div className="container">
          <h2>Blog</h2>
          <div className="loading">Loading posts...</div>
        </div>
      </section>
    )
  }

  // ---------- Full-article reader view ----------
  if (active) {
    return (
      <section id="blog" className="blog section" aria-label={active.title}>
        <div className="container">
          <button
            type="button"
            className="btn btn-outline blog-back-btn"
            onClick={() => setActiveId(null)}
          >
            <i className="fas fa-arrow-left" aria-hidden="true"></i> All posts
          </button>

          <article className="blog-reader">
            <div className="blog-reader-cover" style={{ background: active.gradient }} aria-hidden="true">
              <i className={active.icon || 'fas fa-book'} aria-hidden="true"></i>
            </div>
            <div className="blog-reader-body">
              <h2>{active.title}</h2>
              <div className="blog-meta blog-reader-meta">
                <span><i className="far fa-calendar" aria-hidden="true"></i> {formatDate(active.date)}</span>
                <span><i className="far fa-clock" aria-hidden="true"></i> {readMinutes(active.content)} min read</span>
              </div>
              {(active.tags || []).length > 0 && (
                <div className="project-tags" style={{ marginBottom: '1.5rem' }}>
                  {active.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
                </div>
              )}
              <p className="blog-reader-excerpt">{active.excerpt}</p>
              <div className="blog-reader-content">
                {paragraphs(active.content).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </article>
        </div>
      </section>
    )
  }

  // ---------- Public list view ----------
  return (
    <section id="blog" className="blog section" aria-label="Blog">
      <div className="container">
        <h2>Blog</h2>
        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
          Thoughts, tutorials, and insights from my journey as a software developer.
        </p>

        {posts.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '3rem' }}>
            <p>No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <article
                key={post.id}
                className="blog-card blog-card-clickable"
                onClick={() => setActiveId(post.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(post.id) } }}
                tabIndex={0}
                role="link"
                aria-label={`Read: ${post.title}`}
              >
                <div className="blog-card-image" style={{ background: post.gradient }} aria-hidden="true">
                  <i className={post.icon || 'fas fa-book'} aria-hidden="true"></i>
                </div>
                <div className="blog-card-body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span><i className="far fa-calendar" aria-hidden="true"></i> {formatDate(post.date)}</span>
                    <span><i className="far fa-clock" aria-hidden="true"></i> {readMinutes(post.content)} min read</span>
                  </div>
                  <span className="blog-read-more">Read more <i className="fas fa-arrow-right" aria-hidden="true"></i></span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
