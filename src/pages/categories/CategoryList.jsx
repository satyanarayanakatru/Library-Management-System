import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useCategories } from '../../context/CategoryContext'
import { useBooks } from '../../context/BookContext'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'

export default function CategoryList() {
  const { categories, addCategory, editCategory, deleteCategory } = useCategories()
  const { books } = useBooks()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  const openAdd = () => {
    setEditingCategory(null)
    reset({ name: '', description: '' })
    setIsAddModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditingCategory(cat)
    setValue('name', cat.name)
    setValue('description', cat.description)
  }

  const onSubmit = (data) => {
    try {
      if (editingCategory) {
        editCategory(editingCategory.id, data)
        toast.success(`Category "${data.name}" updated!`)
        setEditingCategory(null)
      } else {
        addCategory(data)
        toast.success(`Category "${data.name}" added successfully!`)
        setIsAddModalOpen(false)
      }
      reset()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const confirmDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id)
      toast.success(`Category "${deletingCategory.name}" deleted.`)
      setDeletingCategory(null)
    }
  }

  // Count books per category
  const getBookCountForCategory = (catName) => {
    return books.filter((b) => b.category === catName).length
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize catalog sections, genres, and view volumes mapped to each department
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-sm shadow-teal-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Category
        </button>
      </div>

      {/* Categories Cards Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Categories Configured"
          description="Create your first library classification section."
          actionLabel="Add Category"
          onAction={openAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = getBookCountForCategory(cat.name)
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    {count} {count === 1 ? 'Book' : 'Books'}
                  </span>
                  <Link
                    to="/books"
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    View Catalog &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingCategory}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              {...register('name', { required: 'Category name is required' })}
              placeholder="e.g. Artificial Intelligence"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Brief summary of books in this classification..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false)
                setEditingCategory(null)
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm active:scale-95"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Confirm Category Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs">
              Are you sure you want to delete <span className="font-bold">"{deletingCategory?.name}"</span>?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeletingCategory(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm active:scale-95"
            >
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
