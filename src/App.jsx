import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoleGuard from '@/components/auth/RoleGuard'

// Public pages
import Home from './views/Home'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import DiscoverTurfs from './views/turfs/DiscoverTurfs'
import TurfDetail from './views/turfs/TurfDetail'

// Authenticated pages
import BookTurf from './views/bookings/BookTurf'
import BookingHistory from './views/bookings/BookingHistory'
import WalletPage from './views/wallet/WalletPage'
import Dashboard from './views/dashboard/Dashboard'
import Profile from './views/profile/Profile'

// Role-specific
import VenueOwnerDashboard from './views/venue/VenueOwnerDashboard'
import AdminDashboard from './views/admin/AdminDashboard'

// 404
import NotFound from './views/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Public routes — wrapped in AppLayout (has Navbar + BottomNav) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/turfs" element={<DiscoverTurfs />} />
        <Route path="/turfs/:slug" element={<TurfDetail />} />

        {/* Auth routes (redirect to / if already logged in) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/book/:turfId" element={<BookTurf />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Role-gated — VENUE_OWNER or ADMIN */}
        <Route element={<RoleGuard roles={['VENUE_OWNER', 'ADMIN']} />}>
          <Route path="/venue" element={<VenueOwnerDashboard />} />
        </Route>

        {/* Role-gated — ADMIN only */}
        <Route element={<RoleGuard roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
