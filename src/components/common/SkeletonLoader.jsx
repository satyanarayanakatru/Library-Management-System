export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col justify-between">
      <div className="space-y-3">
        <div className="w-full h-48 bg-slate-200 rounded-xl" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mt-2" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded-full w-20" />
        <div className="h-8 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        <div className="w-16 h-4 bg-slate-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-4 bg-slate-200 rounded" />
        <div className="w-16 h-8 bg-slate-200 rounded" />
      </div>
    </div>
  )
}

export default function SkeletonLoader({ type = 'card', count = 4, cols = 5 }) {
  return (
    <div className={type === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : ''}>
      {Array.from({ length: count }).map((_, i) => {
        if (type === 'card') return <BookCardSkeleton key={i} />
        if (type === 'stat') return <StatCardSkeleton key={i} />
        if (type === 'table') return <TableRowSkeleton key={i} cols={cols} />
        return <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
      })}
    </div>
  )
}
