export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'teal',
  subtext
}) {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  }

  const iconClasses = colorMap[color] || colorMap.teal

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${iconClasses}`}>
          {Icon && <Icon className="w-5 h-5 stroke-[2]" />}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  )
}
