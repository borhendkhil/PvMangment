import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './lib/httpClient'
import Login from './components/Login'
import AdminDashboard from './components/informatique/AdminDashboard'
import AcceuilDashboard from './components/directeur/AcceuilDashboard'
import AdminCabinetDashboard from './components/admin-cabinet/Dashboard'
import UserDashboard from './components/user/Dashboard'

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/informatique/dashbord" element={<AdminDashboard />} />
        <Route path="/directeur/acceuildashboard" element={<AcceuilDashboard />} />
        <Route path="/admin-cabinet/dashboard" element={<AdminCabinetDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
