import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useBooks } from '../../context/BookContext'
import { useCategories } from '../../context/CategoryContext'
import Modal from '../../components/common/Modal'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'

export default function BookList() {
  const { books, loading, error, addBook, editBook, deleteBook, syncWithApi } = useBooks()
  const { categories } = useCategories()

  // State for search, filters, sort, and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedAuthor, setSelectedAuthor] = useState('All')
  const [sortBy, setSortBy] = useState('title-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deletingBook, setDeletingBook] = useState(null)

  // React Hook Form for Add/Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  // Reset form when editing modal toggles
  useEffect(() => {
    if (editingBook) {
      setValue('title', editingBook.title)
      setValue('author', editingBook.author)
      setValue('isbn', editingBook.isbn)
      setValue('publisher', editingBook.publisher)
      setValue('category', editingBook.category)
      setValue('publishedYear', editingBook.publishedYear)
      setValue('totalCopies', editingBook.totalCopies)
      setValue('coverImage', editingBook.coverImage)
      setValue('description', editingBook.description)
    } else {
      reset({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        category: categories[0]?.name || 'Computer Science',
        publishedYear: new Date().getFullYear(),
        totalCopies: 5,
        coverImage: '',
        description: ''
      })
    }
  }, [editingBook, reset, setValue, categories])

  // Extract unique authors for filter
  const uniqueAuthors = useMemo(() => {
    const authors = new Set(books.map((b) => b.author).filter(Boolean))
    return ['All', ...Array.from(authors).sort()]
  }, [books])

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    let result = [...books]

    // Search query (Title, Author, ISBN)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory)
    }

    // Author filter
    if (selectedAuthor !== 'All') {
      result = result.filter((b) => b.author === selectedAuthor)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title)
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title)
      if (sortBy === 'year-desc') return b.publishedYear - a.publishedYear
      if (sortBy === 'year-asc') return a.publishedYear - b.publishedYear
      return 0
    })

    return result
  }, [books, searchTerm, selectedCategory, selectedAuthor, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredBooks.slice(start, start + itemsPerPage)
  }, [filteredBooks, currentPage, itemsPerPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedAuthor, sortBy])

  // Form submit for Add / Edit
  const onFormSubmit = (data) => {
    try {
      if (editingBook) {
        editBook(editingBook.id, data)
        toast.success(`"${data.title}" updated successfully!`)
        setEditingBook(null)
      } else {
        addBook(data)
        toast.success(`"${data.title}" added to library catalog!`)
        setIsAddModalOpen(false)
      }
      reset()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  // Handle Delete
  const confirmDelete = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id)
      toast.success(`"${deletingBook.title}" deleted from catalog.`)
      setDeletingBook(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Book Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, catalog, edit, and manage library inventory & copies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              syncWithApi()
              toast.info('Fetched and synchronized books from API!')
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            Sync API
          </button>
          <button
            onClick={() => {
              setEditingBook(null)
              setIsAddModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-sm shadow-teal-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Book
          </button>
        </div>
      </div>

      {/* Search, Filter, Sort Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Author:</span>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 cursor-pointer"
            >
              {uniqueAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 cursor-pointer"
            >
              <option value="title-asc">Title (A &rarr; Z)</option>
              <option value="title-desc">Title (Z &rarr; A)</option>
              <option value="year-desc">Published (Newest)</option>
              <option value="year-asc">Published (Oldest)</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Summary */}
        {(searchTerm || selectedCategory !== 'All' || selectedAuthor !== 'All') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[11px]">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                {selectedCategory}
              </span>
            )}
            {selectedAuthor !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px]">
                {selectedAuthor}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
                setSelectedAuthor('All')
              }}
              className="ml-auto text-teal-600 hover:underline text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Book Cards Grid / Skeletons */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : paginatedBooks.length === 0 ? (
        <EmptyState
          title="No books match your criteria"
          description="Try broadening your search term or clear the category/author filters."
          actionLabel="Add New Book"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBooks.map((book) => {
            const isOutOfStock = book.availableCopies <= 0
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Book Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur border border-white/20">
                        {book.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge
                        status={isOutOfStock ? 'out of stock' : 'available'}
                        text={isOutOfStock ? 'Out of Stock' : `${book.availableCopies}/${book.totalCopies} Available`}
                      />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-teal-600 transition">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      By <span className="text-slate-700">{book.author}</span> &bull; {book.publishedYear}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                    <div className="pt-2 text-[11px] text-slate-400 font-mono">
                      ISBN: {book.isbn}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <Link
                    to={`/books/${book.id}`}
                    className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition"
                      title="Edit Book"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingBook(book)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Book"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span> ({filteredBooks.length} books total)
          </p>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 text-xs font-semibold rounded-lg transition ${
                  currentPage === i + 1
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingBook}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingBook(null)
        }}
        title={editingBook ? 'Edit Book Details' : 'Catalog New Book'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Book title is required' })}
              placeholder="e.g. Clean Architecture"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name *</label>
              <input
                type="text"
                {...register('author', { required: 'Author is required' })}
                placeholder="Robert C. Martin"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {errors.author && <p className="text-xs text-rose-500 mt-1">{errors.author.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ISBN Number *</label>
              <input
                type="text"
                {...register('isbn', { required: 'ISBN is required' })}
                placeholder="978-0134494166"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {errors.isbn && <p className="text-xs text-rose-500 mt-1">{errors.isbn.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publisher *</label>
              <input
                type="text"
                {...register('publisher', { required: 'Publisher is required' })}
                placeholder="Prentice Hall"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Published Year</label>
              <input
                type="number"
                {...register('publishedYear', {
                  required: 'Year is required',
                  min: { value: 1500, message: 'Invalid year' },
                  max: { value: 2030, message: 'Invalid year' }
                })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Copies *</label>
              <input
                type="number"
                {...register('totalCopies', {
                  required: 'Total copies required',
                  min: { value: 1, message: 'At least 1 copy required' }
                })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                {...register('coverImage')}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Book Description</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Brief summary and overview of the book..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false)
                setEditingBook(null)
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition active:scale-95"
            >
              {editingBook ? 'Save Changes' : 'Catalog Book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        title="Confirm Book Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs">
              Are you sure you want to remove <span className="font-bold">"{deletingBook?.title}"</span> from the catalog? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeletingBook(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm active:scale-95"
            >
              Delete Book
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
