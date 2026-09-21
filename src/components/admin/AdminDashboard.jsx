import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useProjects } from '../../context/useProjects'
import { usePosts } from '../../context/usePosts'
import { useNotification } from '../../context/useNotification'

const TECH_OPTIONS = ['React', 'Node.js', 'Express', 'Vue', 'Angular', 'Next.js', 'Django', 'Flask', 'Python', 'TypeScript', 'JavaScript', 'CSS3', 'HTML5', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'AWS', 'Vite', 'Webpack', 'GraphQL', 'REST API', 'Cloud', 'CI/CD', 'TDD', 'Agile', 'Microservices', 'Framer Motion', 'D3.js']

const ICON_OPTIONS = ['fas fa-code', 'fas fa-rocket', 'fas fa-lightbulb', 'fas fa-cloud', 'fas fa-briefcase', 'fas fa-chart-line', 'fas fa-shopping-cart', 'fas fa-mobile-alt', 'fas fa-server', 'fas fa-database', 'fas fa-pen-fancy', 'fas fa-gamepad', 'fas fa-camera', 'fas fa-music', 'fas fa-graduation-cap']

const GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #f43f5e, #e11d48)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function AdminForm({ project, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: project?.name || '',
    description: project?.description || '',
    tech: project?.tech || [],
    github: project?.github || '',
    demo: project?.demo || '',
    icon: project?.icon || 'fas fa-code',
    gradient: project?.gradient || GRADIENTS[0],
    status: project?.status || 'in-progress',
    date: project?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleTech = (tech) => {
    setValues(prev => ({
      ...prev,
      tech: prev.tech.includes(tech) ? prev.tech.filter(t => t !== tech) : [...prev.tech, tech]
    }))
    if (errors.tech) {
      setErrors(prev => {
        const next = { ...prev }
        delete next.tech
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!values.name.trim()) newErrors.name = 'Project name is required'
    if (!values.description.trim()) newErrors.description = 'Description is required'
    if (!values.tech || values.tech.length === 0) newErrors.tech = 'Select at least one technology'
    if (!values.github.trim()) newErrors.github = 'GitHub link is required'
    if (!values.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...values, tech: [...values.tech], id: project?.id || generateId() })
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{project ? 'Edit Project' : 'Add New Project'}</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="project-name">Project Name *</label>
          <input id="project-name" type="text" value={values.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="My Project" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="project-date">Date *</label>
          <input id="project-date" type="date" value={values.date} onChange={(e) => handleChange('date', e.target.value)} />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="project-desc">Description *</label>
        <textarea id="project-desc" value={values.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe the project..." rows="3" />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Tech Stack * (click to select)</label>
        <div className="tech-selector">
          {TECH_OPTIONS.map(t => (
            <button key={t} type="button" className={`tech-chip ${values.tech.includes(t) ? 'active' : ''}`} onClick={() => toggleTech(t)}>
              {t}
            </button>
          ))}
        </div>
        {errors.tech && <span className="form-error">{errors.tech}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="project-github">GitHub Link *</label>
          <input id="project-github" type="url" value={values.github} onChange={(e) => handleChange('github', e.target.value)} placeholder="https://github.com/username/repo" />
          {errors.github && <span className="form-error">{errors.github}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="project-demo">Demo Link</label>
          <input id="project-demo" type="text" value={values.demo} onChange={(e) => handleChange('demo', e.target.value)} placeholder="https://demo.example.com or #" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="project-icon">Icon</label>
          <select id="project-icon" value={values.icon} onChange={(e) => handleChange('icon', e.target.value)}>
            {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="project-status">Status</label>
          <select id="project-status" value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Color Theme</label>
        <div className="gradient-selector">
          {GRADIENTS.map((g, i) => (
            <button key={i} type="button" className={`gradient-swatch ${values.gradient === g ? 'active' : ''}`} style={{ background: g }} onClick={() => handleChange('gradient', g)} aria-label={`Color theme ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{project ? 'Update' : 'Save'}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

const POST_ICON_OPTIONS = ['fas fa-book', 'fas fa-pen-fancy', 'fas fa-lightbulb', 'fas fa-code', 'fab fa-react', 'fas fa-server', 'fas fa-cloud', 'fas fa-rocket', 'fas fa-graduation-cap', 'fas fa-camera']

function PostForm({ post, onSave, onCancel }) {
  const [values, setValues] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    tags: (post?.tags || []).join(', '),
    icon: post?.icon || 'fas fa-book',
    gradient: post?.gradient || GRADIENTS[2],
    status: post?.status || 'published',
    date: post?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!values.title.trim()) newErrors.title = 'Title is required'
    if (!values.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!values.content.trim()) newErrors.content = 'Content is required'
    if (!values.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...values,
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      content: values.content.trim(),
      tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
      id: post?.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{post ? 'Edit Post' : 'Write New Post'}</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="post-title">Title *</label>
          <input id="post-title" type="text" value={values.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="My blog post" />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="post-date">Date *</label>
          <input id="post-date" type="date" value={values.date} onChange={(e) => handleChange('date', e.target.value)} />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="post-excerpt">Excerpt *</label>
        <textarea id="post-excerpt" value={values.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} placeholder="One or two sentences shown on the blog cards..." rows="2" />
        {errors.excerpt && <span className="form-error">{errors.excerpt}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="post-content">Content * (blank line = new paragraph)</label>
        <textarea id="post-content" value={values.content} onChange={(e) => handleChange('content', e.target.value)} placeholder="Write your article here..." rows="10" />
        {errors.content && <span className="form-error">{errors.content}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="post-tags">Tags (comma separated)</label>
        <input id="post-tags" type="text" value={values.tags} onChange={(e) => handleChange('tags', e.target.value)} placeholder="React, Tutorial" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="post-icon">Icon</label>
          <select id="post-icon" value={values.icon} onChange={(e) => handleChange('icon', e.target.value)}>
            {POST_ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="post-status">Status</label>
          <select id="post-status" value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="published">Published (visible to everyone)</option>
            <option value="draft">Draft (only you can see it)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Color Theme</label>
        <div className="gradient-selector">
          {GRADIENTS.map((g, i) => (
            <button key={i} type="button" className={`gradient-swatch ${values.gradient === g ? 'active' : ''}`} style={{ background: g }} onClick={() => handleChange('gradient', g)} aria-label={`Color theme ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{post ? 'Update' : 'Publish'}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()
  const { posts, loading: postsLoading, addPost, updatePost, deletePost } = usePosts()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const [tab, setTab] = useState('projects')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const deleteTimer = useRef(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deletePostConfirm, setDeletePostConfirm] = useState(null)
  const deletePostTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (deleteTimer.current) clearTimeout(deleteTimer.current)
      if (deletePostTimer.current) clearTimeout(deletePostTimer.current)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleAdd = () => {
    setEditingProject(null)
    setShowAddForm(true)
    setDeleteConfirm(null)
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setShowAddForm(true)
    setDeleteConfirm(null)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingProject(null)
    setDeleteConfirm(null)
  }

  const handleSave = async (projectData) => {
    const result = editingProject
      ? await updateProject(editingProject.id, projectData)
      : await addProject(projectData)
    if (result.success) {
      notify(editingProject ? 'Project updated successfully!' : 'Project added successfully!', 'success')
      setShowAddForm(false)
      setEditingProject(null)
    } else {
      notify(result.error || 'Failed to save.', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      const result = await deleteProject(id)
      if (result.success) {
        notify('Project deleted successfully!', 'success')
      } else {
        notify(result.error || 'Failed to delete.', 'error')
      }
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      if (deleteTimer.current) clearTimeout(deleteTimer.current)
      deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleAddPost = () => {
    setEditingPost(null)
    setShowPostForm(true)
    setDeletePostConfirm(null)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setShowPostForm(true)
    setDeletePostConfirm(null)
  }

  const handleCancelPost = () => {
    setShowPostForm(false)
    setEditingPost(null)
    setDeletePostConfirm(null)
  }

  const handleSavePost = async (postData) => {
    const result = editingPost
      ? await updatePost(editingPost.id, postData)
      : await addPost(postData)
    if (result.success) {
      notify(editingPost ? 'Post updated successfully!' : 'Post published successfully!', 'success')
      setShowPostForm(false)
      setEditingPost(null)
    } else {
      notify(result.error || 'Failed to save.', 'error')
    }
  }

  const handleDeletePost = async (id) => {
    if (deletePostConfirm === id) {
      const result = await deletePost(id)
      if (result.success) {
        notify('Post deleted successfully!', 'success')
      } else {
        notify(result.error || 'Failed to delete.', 'error')
      }
      setDeletePostConfirm(null)
    } else {
      setDeletePostConfirm(id)
      if (deletePostTimer.current) clearTimeout(deletePostTimer.current)
      deletePostTimer.current = setTimeout(() => setDeletePostConfirm(null), 3000)
    }
  }

  if (loading || postsLoading) {
    return <div className="loading" style={{ padding: '4rem' }}>Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-topbar">
        <h2>Admin Dashboard</h2>
        <div className="admin-topbar-actions">
          {tab === 'projects' ? (
            <>
              <span className="admin-project-count">{projects.length} Project{projects.length !== 1 ? 's' : ''}</span>
              <button className="btn btn-primary" onClick={handleAdd}>+ Add Project</button>
            </>
          ) : (
            <>
              <span className="admin-project-count">{posts.length} Post{posts.length !== 1 ? 's' : ''}</span>
              <button className="btn btn-primary" onClick={handleAddPost}>+ Write Post</button>
            </>
          )}
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Manage content">
        <button type="button" role="tab" aria-selected={tab === 'projects'} className={`tab-btn ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
          <i className="fas fa-briefcase" aria-hidden="true"></i> Projects
        </button>
        <button type="button" role="tab" aria-selected={tab === 'blog'} className={`tab-btn ${tab === 'blog' ? 'active' : ''}`} onClick={() => setTab('blog')}>
          <i className="fas fa-pen-fancy" aria-hidden="true"></i> Blog
        </button>
      </div>

      {tab === 'projects' ? (
      <>

      {showAddForm && (
        <div className="admin-form-section">
          <AdminForm
            project={editingProject}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="admin-project-grid">
        {projects.map((project) => (
          <div key={project.id} className="admin-project-card">
            <div className="admin-project-image" style={{ background: project.gradient }}>
              <i className={project.icon || 'fas fa-code'}></i>
              <span className={`status-badge status-${project.status || 'in-progress'}`}>
                {project.status || 'in-progress'}
              </span>
            </div>
            <div className="admin-project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="admin-project-tags">
                {(project.tech || []).map(t => <span key={t} className="admin-tag">{t}</span>)}
              </div>
              <div className="admin-project-actions">
                <button className="btn-icon" onClick={() => handleEdit(project)} title="Edit" aria-label={`Edit ${project.name}`}>
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className={`btn-icon ${deleteConfirm === project.id ? 'btn-icon-danger' : ''}`}
                  onClick={() => handleDelete(project.id)}
                  title={deleteConfirm === project.id ? 'Click again to confirm' : 'Delete'}
                  aria-label={`Delete ${project.name}`}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showAddForm && (
        <div className="admin-empty">
          <i className="fas fa-folder-open"></i>
          <p>No projects yet. Click "Add Project" to get started.</p>
        </div>
      )}
      </>
      ) : (
      <>

      {showPostForm && (
        <div className="admin-form-section">
          <PostForm
            post={editingPost}
            onSave={handleSavePost}
            onCancel={handleCancelPost}
          />
        </div>
      )}

      <div className="admin-project-grid">
        {posts.map((post) => (
          <div key={post.id} className="admin-project-card">
            <div className="admin-project-image" style={{ background: post.gradient }}>
              <i className={post.icon || 'fas fa-book'}></i>
              <span className={`status-badge status-${post.status || 'published'}`}>
                {post.status || 'published'}
              </span>
            </div>
            <div className="admin-project-info">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="admin-project-tags">
                {(post.tags || []).map(t => <span key={t} className="admin-tag">{t}</span>)}
              </div>
              <div className="admin-project-actions">
                <button className="btn-icon" onClick={() => handleEditPost(post)} title="Edit" aria-label={`Edit ${post.title}`}>
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className={`btn-icon ${deletePostConfirm === post.id ? 'btn-icon-danger' : ''}`}
                  onClick={() => handleDeletePost(post.id)}
                  title={deletePostConfirm === post.id ? 'Click again to confirm' : 'Delete'}
                  aria-label={`Delete ${post.title}`}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !showPostForm && (
        <div className="admin-empty">
          <i className="fas fa-pen-fancy"></i>
          <p>No posts yet. Click "Write Post" to publish your first article.</p>
        </div>
      )}
      </>
      )}
    </div>
  )
}
