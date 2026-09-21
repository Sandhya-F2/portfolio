import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import AdminDashboard from './AdminDashboard'

export default function AdminRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) {
    return <div className="loading">Verifying authentication...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <AdminDashboard />
}
