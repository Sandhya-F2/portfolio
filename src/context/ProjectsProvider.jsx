import { useState, useEffect, useCallback } from 'react'
import { ProjectsContext } from './ProjectsContext'
import { loadProjects, saveProjects } from '../data/projectsData'

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : loadProjects())
        if (Array.isArray(data)) saveProjects(data)
      } else {
        setProjects(loadProjects())
      }
    } catch {
      setProjects(loadProjects())
    } finally {
      setLoading(false)
    }
  }, [])

  async function readError(res) {
    try {
      const err = await res.json()
      return err.error || `Request failed (status ${res.status}).`
    } catch {
      return `Request failed (status ${res.status}).`
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const addProject = useCallback(async (project) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
      credentials: 'include',
    })
    if (res.ok) {
      const newProject = await res.json()
      setProjects(prev => [...prev, newProject])
      return { success: true, project: newProject }
    }
    return { success: false, error: await readError(res) }
  }, [])

  const updateProject = useCallback(async (id, updates) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      credentials: 'include',
    })
    if (res.ok) {
      const updated = await res.json()
      setProjects(prev => prev.map(p => p.id === id ? updated : p))
      return { success: true, project: updated }
    }
    return { success: false, error: await readError(res) }
  }, [])

  const deleteProject = useCallback(async (id) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id))
      return { success: true }
    }
    return { success: false, error: await readError(res) }
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, loading, addProject, updateProject, deleteProject, fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}
