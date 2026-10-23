import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ArrowLeftRight,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBooks } from '../../context/BookContext'
import { useMembers } from '../../context/MemberContext'
import { useIssueReturn } from '../../context/IssueReturnContext'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

export default function IssueReturnPage() {
  const location = useLocation()
  const preselectedBookId = location.state?.preselectedBookId

  const { books } = useBooks()
  const { members } = useMembers()
  const { issues, issueBook, returnBook } = useIssueReturn()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
  const [returnConfirmIssue, setReturnConfirmIssue] = useState(null)

  // Issue Form State
  const [selectedBookId, setSelectedBookId] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })

  // Open modal if preselected from details page
  useEffect(() => {
    if (preselectedBookId) {
      setSelectedBookId(preselectedBookId)
      setIsIssueModalOpen(true)
    }
  }, [preselectedBookId])

  // Filter available books for issue
  const availableBooks = useMemo(() => {
    return books.filter((b) => b.availableCopies > 0)
  }, [books])

  // Active members
  const activeMembers = useMemo(() => {
    return members.filter((m) => m.status === 'Active')
  }, [members])

  // Filtered issues list
  const filteredIssues = useMemo(() => {
    let result = [...issues]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (i) =>
          i.bookTitle.toLowerCase().includes(q) ||
          i.memberName.toLowerCase().includes(q) ||
          i.membershipId.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((i) => i.status === statusFilter)
    }

    return result
  }, [issues, searchTerm, statusFilter])

  // Handle book issue submit
  const handleIssueSubmit = (e) => {
    e.preventDefault()

    if (!selectedBookId) {
      toast.error('Please select a book.')
      return
    }

    if (!selectedMemberId) {
      toast.error('Please select an active member.')
      return
    }

    const member = members.find((m) => m.id === selectedMemberId)
    if (!member) {
      toast.error('Selected member not found.')
      return
    }

    try {
      issueBook({
        bookId: selectedBookId,
        member,
        issueDate,
        dueDate
      })
      toast.success('Book issued successfully!')
      setIsIssueModalOpen(false)
      setSelectedBookId('')
      setSelectedMemberId('')
    } catch (err) {
      toast.error(err.message || 'Failed to issue book')
    }
  }

  // Handle return book
  const handleReturnConfirm = () => {
    if (!returnConfirmIssue) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const result = returnBook(returnConfirmIssue.id, today)

      if (result.fineAmount > 0) {
        toast.warning(
          `Book returned with ${result.overdueDays} days overdue! A fine of $${result.fineAmount}.00 was generated.`
        )
      } else {
        toast.success('Book returned on time! Availability updated.')
      }
      setReturnConfirmIssue(null)
    } catch (err) {
      toast.error(err.message || 'Failed to return book')
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & New Issue Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issue & Return Books</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage book checkouts, return confirmations, and track loan circulation history
          </p>
        </div>
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-sm shadow-teal-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Issue Book
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by book title or member name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 cursor-pointer"
          >
            <option value="All">All Loan Records</option>
            <option value="Issued">Currently Issued</option>
            <option value="Overdue">Overdue Loans</option>
            <option value="Returned">Returned Books</option>
          </select>
        </div>
      </div>

      {/* Issue History Table */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No loan records found"
          description="There are no loans matching your selected filter."
          actionLabel="Issue a Book"
          onAction={() => setIsIssueModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Book Details</th>
                  <th className="py-3.5 px-5">Issued To</th>
                  <th className="py-3.5 px-5">Issue Date</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5">Return Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredIssues.map((issue) => {
                  const isActive = issue.status === 'Issued' || issue.status === 'Overdue'
                  return (
                    <tr key={issue.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 max-w-xs">{issue.bookTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {issue.bookId}</div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">{issue.memberName}</div>
                        <div className="text-[11px] text-teal-600 font-mono">{issue.membershipId}</div>
                      </td>

                      <td className="py-4 px-5 text-slate-600">{issue.issueDate}</td>

                      <td className="py-4 px-5">
                        <span className={issue.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                          {issue.dueDate}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        {issue.returnDate || <span className="text-slate-400 italic">Not returned</span>}
                      </td>

                      <td className="py-4 px-5">
                        <Badge status={issue.status} />
                      </td>

                      <td className="py-4 px-5 text-right">
                        {isActive ? (
                          <button
                            onClick={() => setReturnConfirmIssue(issue)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Return
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Check Out / Issue Book"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          {/* Select Book */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Book (Copies Available) *
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              required
            >
              <option value="">-- Choose a book from inventory --</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          {/* Select Member */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Library Member *
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              required
            >
              <option value="">-- Choose a registered member --</option>
              {activeMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.membershipId})
                </option>
              ))}
            </select>
          </div>

          {/* Issue Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                min={issueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800">
            <strong>Policy Notice:</strong> Members cannot issue the same book twice simultaneously. Overdue loans accumulate a penalty fee of $2.00 per day.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition active:scale-95"
            >
              Confirm Issue
            </button>
          </div>
        </form>
      </Modal>

      {/* Return Confirmation Modal */}
      <Modal
        isOpen={!!returnConfirmIssue}
        onClose={() => setReturnConfirmIssue(null)}
        title="Confirm Book Return"
        maxWidth="max-w-md"
      >
        {returnConfirmIssue && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm return of <span className="font-bold text-slate-900">"{returnConfirmIssue.bookTitle}"</span> from{' '}
              <span className="font-bold text-slate-900">{returnConfirmIssue.memberName}</span> ({returnConfirmIssue.membershipId}).
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div>Issue Date: <span className="font-semibold">{returnConfirmIssue.issueDate}</span></div>
              <div>Due Date: <span className="font-semibold">{returnConfirmIssue.dueDate}</span></div>
              <div>Return Date: <span className="font-semibold">{new Date().toISOString().split('T')[0]}</span></div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReturnConfirmIssue(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition active:scale-95"
              >
                Confirm Return & Restock
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
