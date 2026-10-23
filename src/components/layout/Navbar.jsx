import { Menu, Search, Bell, BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { currentUser } = useAuth()
  const [navSearch, setNavSearch] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`)
      setNavSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Quick search books, ISBN, members..."
            className="w-64 md:w-80 pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-slate-800 placeholder-slate-400"
          />
        </form>
      </div>

      {/* Right Icons & User Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/issue-return"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-semibold transition"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Quick Issue
        </Link>

        {/* Notification indicator */}
        <div className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {currentUser?.role || 'Librarian'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
