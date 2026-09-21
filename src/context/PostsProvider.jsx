import { useState, useEffect, useCallback } from 'react'
import { PostsContext } from './PostsContext'

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      } else {
        setPosts([])
      }
    } catch {
      setPosts([])
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
    fetchPosts()
  }, [fetchPosts])

  const addPost = useCallback(async (post) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
      credentials: 'include',
    })
    if (res.ok) {
      const newPost = await res.json()
      setPosts(prev => [...prev, newPost])
      return { success: true, post: newPost }
    }
    return { success: false, error: await readError(res) }
  }, [])

  const updatePost = useCallback(async (id, updates) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      credentials: 'include',
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts(prev => prev.map(p => p.id === id ? updated : p))
      return { success: true, post: updated }
    }
    return { success: false, error: await readError(res) }
  }, [])

  const deletePost = useCallback(async (id) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== id))
      return { success: true }
    }
    return { success: false, error: await readError(res) }
  }, [])

  return (
    <PostsContext.Provider value={{ posts, loading, addPost, updatePost, deletePost, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  )
}
