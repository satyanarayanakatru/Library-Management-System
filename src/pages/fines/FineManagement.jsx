import { useState, useMemo } from 'react'
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useIssueReturn } from '../../context/IssueReturnContext'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

export default function FineManagement() {
  const { fines, issues, toggleFinePaymentStatus, FINE_RATE_PER_DAY } = useIssueReturn()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All') // 'All' | 'Paid' | 'Unpaid'
  const [activeTab, setActiveTab] = useState('fines') // 'fines' | 'overdue'

  // Overdue active issues
  const overdueIssues = useMemo(() => {
    return issues.filter((i) => i.status === 'Overdue')
  }, [issues])

  // Filtered fines
  const filteredFines = useMemo(() => {
    let result = [...fines]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (f) =>
          f.memberName.toLowerCase().includes(q) ||
          f.bookTitle.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((f) => f.status === statusFilter)
    }

    return result
  }, [fines, searchTerm, statusFilter])

  // Calculated Fine Totals
  const totalFineCollected = fines
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + (f.amount || 0), 0)

  const totalFinePending = fines
    .filter((f) => f.status === 'Unpaid')
    .reduce((sum, f) => sum + (f.amount || 0), 0)

  const handleStatusToggle = (fine) => {
    toggleFinePaymentStatus(fine.id)
    toast.success(
      `Fine status for ${fine.memberName} marked as ${fine.status === 'Paid' ? 'Unpaid' : 'Paid'}`
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fine Calculation & Penalties</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated overdue calculation at ${FINE_RATE_PER_DAY}.00/day, fine collection tracking & payment status
          </p>
        </div>
      </div>

      {/* Fines Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Fines Collected"
          value={`$${totalFineCollected}.00`}
          icon={CheckCircle2}
          color="emerald"
          subtext="Total revenue received"
        />
        <StatCard
          title="Pending Unpaid Fines"
          value={`$${totalFinePending}.00`}
          icon={AlertTriangle}
          color="rose"
          subtext="Outstanding overdue penalties"
        />
        <StatCard
          title="Overdue Books Currently"
          value={overdueIssues.length}
          icon={Clock}
          color="amber"
          subtext="Books not yet returned"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('fines')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition ${
            activeTab === 'fines'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Fine Records ({fines.length})
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition ${
            activeTab === 'overdue'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overdue Books List ({overdueIssues.length})
        </button>
      </div>

      {activeTab === 'fines' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fines by member or book title..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Payment:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Unpaid">Unpaid Only</option>
                <option value="Paid">Paid Only</option>
              </select>
            </div>
          </div>

          {/* Fines Table */}
          {filteredFines.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No fine records found"
              description="No penalties match your search or filter criteria."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Member Name</th>
                      <th className="py-3.5 px-5">Book Title</th>
                      <th className="py-3.5 px-5">Overdue Days</th>
                      <th className="py-3.5 px-5">Fine Amount</th>
                      <th className="py-3.5 px-5">Payment Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredFines.map((fine) => {
                      const isPaid = fine.status === 'Paid'
                      return (
                        <tr key={fine.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900">{fine.memberName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">ID: {fine.id}</div>
                          </td>

                          <td className="py-4 px-5">
                            <div className="font-medium text-slate-800 max-w-xs">{fine.bookTitle}</div>
                            <div className="text-[11px] text-slate-400">Due: {fine.dueDate}</div>
                          </td>

                          <td className="py-4 px-5 font-semibold text-rose-600">
                            {fine.overdueDays} days
                          </td>

                          <td className="py-4 px-5 font-bold text-slate-900 text-sm">
                            ${fine.amount}.00
                          </td>

                          <td className="py-4 px-5">
                            <Badge status={fine.status} />
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => handleStatusToggle(fine)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                                isPaid
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              }`}
                            >
                              {isPaid ? 'Mark as Unpaid' : 'Collect Fine'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'overdue' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                These books have passed their return due date and have not yet been checked back into inventory.
              </span>
            </div>
          </div>

          {overdueIssues.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No Overdue Books!"
              description="Great news! All currently checked-out library books are within their permitted loan period."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Book Title</th>
                      <th className="py-3.5 px-5">Borrower Member</th>
                      <th className="py-3.5 px-5">Issue Date</th>
                      <th className="py-3.5 px-5">Expired Due Date</th>
                      <th className="py-3.5 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {overdueIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-5 font-bold text-slate-900">{issue.bookTitle}</td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-slate-800">{issue.memberName}</div>
                          <div className="text-[11px] text-teal-600">{issue.membershipId}</div>
                        </td>
                        <td className="py-4 px-5 text-slate-600">{issue.issueDate}</td>
                        <td className="py-4 px-5 text-rose-600 font-bold">{issue.dueDate}</td>
                        <td className="py-4 px-5">
                          <Badge status="Overdue" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
