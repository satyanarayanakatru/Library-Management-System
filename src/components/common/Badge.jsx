export default function Badge({ status, text }) {
  const label = text || status

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200'

  switch (status?.toLowerCase()) {
    case 'active':
    case 'available':
    case 'returned':
    case 'paid':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
      break
    case 'issued':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80'
      break
    case 'overdue':
    case 'unpaid':
    case 'out of stock':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80'
      break
    case 'inactive':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80'
      break
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  )
}
