import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Building,
  Barcode,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight
} from 'lucide-react'
import { useBooks } from '../../context/BookContext'
import Badge from '../../components/common/Badge'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBookById } = useBooks()

  const book = getBookById(id)

  if (!book) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Book Not Found</h2>
        <p className="text-xs text-slate-500">
          The book record you requested could not be located in the catalog.
        </p>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Book Catalog
        </Link>
      </div>
    )
  }

  const isAvailable = book.availableCopies > 0

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div>
        <button
          onClick={() => navigate('/books')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books Catalog
        </button>
      </div>

      {/* Main Book Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {/* Cover Image Column */}
          <div className="bg-slate-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80">
            <div className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-72 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <Badge
                status={isAvailable ? 'available' : 'out of stock'}
                text={isAvailable ? `${book.availableCopies} Copies Available` : 'Out of Stock'}
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 md:col-span-2 lg:col-span-3 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {book.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Catalog ID: {book.id}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {book.title}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  By <span className="text-teal-700">{book.author}</span>
                </p>
              </div>

              {/* Description */}
              <div className="prose text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Book Overview
                </h4>
                {book.description || 'No detailed synopsis provided for this volume.'}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Barcode className="w-3.5 h-3.5" />
                    ISBN
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1 font-mono">
                    {book.isbn}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Building className="w-3.5 h-3.5" />
                    Publisher
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {book.publisher}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Published
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {book.publishedYear}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Copy className="w-3.5 h-3.5" />
                    Total Copies
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {book.totalCopies} copies
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  {book.availableCopies} ready to issue &bull; {book.totalCopies - book.availableCopies} currently checked out
                </span>
              </div>

              <Link
                to="/issue-return"
                state={{ preselectedBookId: book.id }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  isAvailable
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                {isAvailable ? 'Issue This Book' : 'Currently Unavailable'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
