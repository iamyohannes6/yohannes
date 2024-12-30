import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProjectsManager from './pages/ProjectsManager'
import AboutManager from './pages/AboutManager'
import ContactManager from './pages/ContactManager'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="contact" element={<ContactManager />} />
      </Route>
    </Routes>
  )
}
