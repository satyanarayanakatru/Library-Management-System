import { useMemo } from 'react'
import {
  BarChart3,
  BookOpen,
  ArrowLeftRight,
  CheckCircle2,
  Users,
  AlertTriangle,
  Download,
  Printer,
  TrendingUp,
  Layers,
  Calendar
} from 'lucide-react'
import { useBooks } from '../../context/BookContext'
import { useMembers } from '../../context/MemberContext'
import { useIssueReturn } from '../../context/IssueReturnContext'
import { useCategories } from '../../context/CategoryContext'
import StatCard from '../../components/common/StatCard'

export default function Reports() {
  const { books } = useBooks()
  const { members } = useMembers()
  const { issues, fines } = useIssueReturn()
  const { categories } = useCategories()

  // Summary Metrics
  const totalBooksCount = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0)
  const booksIssued = issues.filter((i) => i.status === 'Issued' || i.status === 'Overdue').length
  const booksReturned = issues.filter((i) => i.status === 'Returned').length
  const activeMembersCount = members.filter((m) => m.status === 'Active').length
  const overdueCount = issues.filter((i) => i.status === 'Overdue').length

  // Category-wise book count
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catBooks = books.filter((b) => b.category === cat.name)
      const count = catBooks.reduce((sum, b) => sum + (b.totalCopies || 0), 0)
      return {
        name: cat.name,
        count,
        titles: catBooks.length
      }
    })
  }, [categories, books])

  // Maximum count for progress bars
  const maxCategoryCount = Math.max(...categoryStats.map((c) => c.count), 1)

  // Monthly issue reports (Dummy analytical dataset)
  const monthlyData = [
    { month: 'May', issues: 24, returns: 20 },
    { month: 'Jun', issues: 32, returns: 28 },
    { month: 'Jul', issues: 40, returns: 35 },
    { month: 'Aug', issues: 48, returns: 44 },
    { month: 'Sep', issues: 52, returns: 47 },
    { month: 'Oct', issues: 38, returns: 31 },
  ]
  const maxMonthlyVal = Math.max(...monthlyData.map((d) => Math.max(d.issues, d.returns)))

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Library inventory reports, monthly circulation trends, and departmental statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Books"
          value={totalBooksCount}
          icon={BookOpen}
          color="teal"
          subtext="Copies in collection"
        />
        <StatCard
          title="Books Issued"
          value={booksIssued}
          icon={ArrowLeftRight}
          color="blue"
          subtext="Active borrowings"
        />
        <StatCard
          title="Books Returned"
          value={booksReturned}
          icon={CheckCircle2}
          color="emerald"
          subtext="Returned safely"
        />
        <StatCard
          title="Active Members"
          value={activeMembersCount}
          icon={Users}
          color="purple"
          subtext="Registered patrons"
        />
        <StatCard
          title="Overdue Books"
          value={overdueCount}
          icon={AlertTriangle}
          color={overdueCount > 0 ? 'rose' : 'emerald'}
          subtext="Late returns"
        />
      </div>

      {/* Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Issue Report Chart (Pure React SVG/HTML Bar Chart) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Monthly Loan & Circulation Trends
              </h3>
              <p className="text-xs text-slate-500">Comparing checkouts vs returns over the past 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                Issues
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                Returns
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
            {monthlyData.map((data, idx) => {
              const issueHeight = Math.round((data.issues / maxMonthlyVal) * 100)
              const returnHeight = Math.round((data.returns / maxMonthlyVal) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Issue bar */}
                    <div
                      style={{ height: `${issueHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-teal-500 rounded-t-lg group-hover:bg-teal-400 transition-all relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold pointer-events-none transition whitespace-nowrap z-10">
                        {data.issues}
                      </div>
                    </div>
                    {/* Return bar */}
                    <div
                      style={{ height: `${returnHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-slate-300 rounded-t-lg group-hover:bg-slate-400 transition-all relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold pointer-events-none transition whitespace-nowrap z-10">
                        {data.returns}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 mt-2">{data.month}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Historical summary</span>
            <span className="font-semibold text-teal-600">Peak month: September (52 issues)</span>
          </div>
        </div>

        {/* Category-wise Book Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Category-wise Book Inventory
              </h3>
              <p className="text-xs text-slate-500">Volumes distribution across classifications</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {categories.length} Categories
            </span>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {categoryStats.map((cat, idx) => {
              const percentage = Math.round((cat.count / maxCategoryCount) * 100)
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="text-slate-500 font-medium">
                      {cat.count} copies ({cat.titles} titles)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Largest department:</span>
            <span className="font-bold text-slate-800">Computer Science</span>
          </div>
        </div>
      </div>

      {/* Circulation Audit Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Library Circulation Audit Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1">
            <div className="font-bold text-teal-900 text-sm">Inventory Utilization</div>
            <p className="text-slate-600">
              {Math.round((booksIssued / (totalBooksCount || 1)) * 100)}% of total books are currently checked out in active circulation.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <div className="font-bold text-blue-900 text-sm">Patron Engagement</div>
            <p className="text-slate-600">
              {Math.round((activeMembersCount / (members.length || 1)) * 100)}% of registered members have maintained active status this quarter.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <div className="font-bold text-emerald-900 text-sm">Fine Compliance</div>
            <p className="text-slate-600">
              Overdue recovery rate is monitored continuously with automated daily penalty calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
