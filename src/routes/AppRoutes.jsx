import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

// App Pages (will be fully fleshed out module by module)
import Dashboard from '../pages/dashboard/Dashboard'
import BookList from '../pages/books/BookList'
import BookDetails from '../pages/books/BookDetails'
import MemberList from '../pages/members/MemberList'
import IssueReturnPage from '../pages/issue-return/IssueReturnPage'
import FineManagement from '../pages/fines/FineManagement'
import CategoryList from '../pages/categories/CategoryList'
import Reports from '../pages/reports/Reports'
import GlobalSearch from '../pages/search/GlobalSearch'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Library Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/issue-return" element={<IssueReturnPage />} />
          <Route path="/fines" element={<FineManagement />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/search" element={<GlobalSearch />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
