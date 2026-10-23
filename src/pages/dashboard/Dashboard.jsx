import { 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBooks } from '../../context/BookContext'
import { useMembers } from '../../context/MemberContext'
import { useIssueReturn } from '../../context/IssueReturnContext'
import { useCategories } from '../../context/CategoryContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/common/StatCard'

export default function Dashboard() {
  const { currentUser } = useAuth()
  const { books } = useBooks()
  const { members } = useMembers()
  const { categories } = useCategories()
  const { issues, fines, activities } = useIssueReturn()

  // Calculated metrics
  const totalBooks = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0)
  const availableBooks = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0)
  const activeMembers = members.filter((m) => m.status === 'Active').length
  const booksIssued = issues.filter((i) => i.status === 'Issued' || i.status === 'Overdue').length
  const overdueBooks = issues.filter((i) => i.status === 'Overdue').length
  const totalCategoriesCount = categories.length
  
  // Total fine collected
  const totalFineCollected = fines
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + (f.amount || 0), 0)

  const quickActions = [
    {
      title: 'Issue Book',
      desc: 'Check out a book to a registered member',
      icon: ArrowLeftRight,
      to: '/issue-return',
      color: 'bg-teal-500 hover:bg-teal-600 text-white'
    },
    {
      title: 'Add New Book',
      desc: 'Catalog a new book with ISBN and details',
      icon: PlusCircle,
      to: '/books',
      color: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      title: 'Add Member',
      desc: 'Register a new library member profile',
      icon: Users,
      to: '/members',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    },
    {
      title: 'Manage Fines',
      desc: 'Review overdue penalties & collect fees',
      icon: DollarSign,
      to: '/fines',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Librarian Workspace Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || 'Administrator'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Here is what's happening in your library today. Monitor book circulations, overdue loans, and membership activities in real-time.
          </p>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Library Key Metrics</h2>
          <span className="text-xs text-slate-500">Real-time statistics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Books (Copies)"
            value={totalBooks}
            icon={BookOpen}
            color="teal"
            subtext={`${books.length} unique book titles`}
            trend="+12% this month"
          />
          <StatCard
            title="Total Members"
            value={members.length}
            icon={Users}
            color="blue"
            subtext={`${activeMembers} active memberships`}
            trend="+5 new"
          />
          <StatCard
            title="Books Issued"
            value={booksIssued}
            icon={ArrowLeftRight}
            color="indigo"
            subtext={`${availableBooks} copies available on shelf`}
          />
          <StatCard
            title="Overdue Books"
            value={overdueBooks}
            icon={AlertTriangle}
            color={overdueBooks > 0 ? 'rose' : 'emerald'}
            subtext="Requires immediate follow-up"
          />
        </div>

        {/* Secondary Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
          <StatCard
            title="Total Categories"
            value={totalCategoriesCount}
            icon={Layers}
            color="purple"
            subtext="Classification sections"
          />
          <StatCard
            title="Books Available"
            value={availableBooks}
            icon={CheckCircle2}
            color="emerald"
            subtext="Ready for checkout"
          />
          <StatCard
            title="Fine Collected"
            value={`$${totalFineCollected}.00`}
            icon={DollarSign}
            color="amber"
            subtext="Total overdue penalties paid"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
          <span className="text-xs text-slate-500">Frequent administrative tasks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
                key={idx}
                to={action.to}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activities & Overdue Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
              <p className="text-xs text-slate-500">Latest loans, returns, and library events</p>
            </div>
            <Link to="/issue-return" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View History &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent activities logged.</p>
            ) : (
              activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                      <span className="text-[11px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">{act.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Overdue Alert Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Overdue Follow-ups</h3>
                <p className="text-xs text-slate-500">{overdueBooks} pending returns</p>
              </div>
            </div>

            <div className="space-y-3">
              {issues.filter(i => i.status === 'Overdue').slice(0, 3).map((iss) => (
                <div key={iss.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100/80 text-xs">
                  <div className="font-semibold text-slate-900 truncate">{iss.bookTitle}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Member: <span className="font-medium text-slate-700">{iss.memberName}</span>
                  </div>
                  <div className="text-rose-600 font-semibold text-[11px] mt-1">
                    Due: {iss.dueDate}
                  </div>
                </div>
              ))}
              {overdueBooks === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  All loans are currently in good standing!
                </div>
              )}
            </div>
          </div>

          <Link
            to="/fines"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition block"
          >
            Review Overdue & Fines
          </Link>
        </div>
      </div>
    </div>
  )
}
