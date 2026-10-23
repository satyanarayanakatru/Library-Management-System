import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  BookOpen,
  Users,
  ArrowLeftRight,
  Barcode,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react'
import { useBooks } from '../../context/BookContext'
import { useMembers } from '../../context/MemberContext'
import { useIssueReturn } from '../../context/IssueReturnContext'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

export default function GlobalSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [filterType, setFilterType] = useState('all') // 'all' | 'books' | 'members' | 'issues'

  const { books } = useBooks()
  const { members } = useMembers()
  const { issues } = useIssueReturn()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) {
      setQuery(q)
    }
  }, [searchParams])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchParams(query.trim() ? { q: query.trim() } : {})
  }

  // Filter books by Title, Author, ISBN
  const matchingBooks = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    )
  }, [books, query])

  // Filter members by Name, Email, Membership ID, Phone
  const matchingMembers = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.membershipId.toLowerCase().includes(q) ||
        m.mobileNumber.toLowerCase().includes(q)
    )
  }, [members, query])

  // Filter issues by Book Title, Member Name, Membership ID
  const matchingIssues = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return issues.filter(
      (i) =>
        i.bookTitle.toLowerCase().includes(q) ||
        i.memberName.toLowerCase().includes(q) ||
        i.membershipId.toLowerCase().includes(q)
    )
  }, [issues, query])

  const totalResults = matchingBooks.length + matchingMembers.length + matchingIssues.length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Global Search</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search simultaneously across book titles, authors, ISBNs, member records, and loan histories
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type book title, author, ISBN (e.g. 978-...), or member name..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
        >
          Search Library
        </button>
      </form>

      {/* Filters and results count */}
      {query.trim() && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="text-xs text-slate-500">
            Found <span className="font-bold text-slate-800">{totalResults}</span> results for "
            <span className="font-semibold text-teal-600">{query}</span>"
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({totalResults})
            </button>
            <button
              onClick={() => setFilterType('books')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === 'books' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Books ({matchingBooks.length})
            </button>
            <button
              onClick={() => setFilterType('members')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === 'members' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Members ({matchingMembers.length})
            </button>
            <button
              onClick={() => setFilterType('issues')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === 'issues' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Loans ({matchingIssues.length})
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!query.trim() ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-xs">
          Enter a keyword above to search through library volumes, patron records, and loan histories.
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find any books, members, or loans matching "${query}".`}
        />
      ) : (
        <div className="space-y-8">
          {/* Matching Books */}
          {(filterType === 'all' || filterType === 'books') && matchingBooks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Book Matches ({matchingBooks.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingBooks.map((b) => (
                  <Link
                    key={b.id}
                    to={`/books/${b.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex items-start gap-4 group"
                  >
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-14 h-20 object-cover rounded-lg shrink-0 bg-slate-100 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 truncate transition">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">By {b.author}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">ISBN: {b.isbn}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                          {b.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {b.availableCopies} available
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matching Members */}
          {(filterType === 'all' || filterType === 'members') && matchingMembers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Member Matches ({matchingMembers.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {m.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{m.fullName}</h4>
                        <p className="text-[11px] text-teal-600 font-mono">{m.membershipId}</p>
                        <p className="text-[11px] text-slate-400 truncate">{m.email}</p>
                      </div>
                    </div>
                    <Badge status={m.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Loans */}
          {(filterType === 'all' || filterType === 'issues') && matchingIssues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                Loan Records ({matchingIssues.length})
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {matchingIssues.map((iss) => (
                  <div key={iss.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{iss.bookTitle}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Borrowed by <span className="font-semibold text-slate-700">{iss.memberName}</span> ({iss.membershipId})
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px]">
                        <div className="text-slate-400">Due Date</div>
                        <div className={iss.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                          {iss.dueDate}
                        </div>
                      </div>
                      <Badge status={iss.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
