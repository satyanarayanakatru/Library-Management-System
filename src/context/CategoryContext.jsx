import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_CATEGORIES } from '../services/seedData'

const CategoryContext = createContext(null)
const STORAGE_KEY = 'librisync_categories'

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
    } catch {
      return INITIAL_CATEGORIES
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to save categories', e)
    }
  }, [categories])

  const addCategory = (categoryData) => {
    const exists = categories.some(
      (c) => c.name.toLowerCase() === categoryData.name.toLowerCase().trim()
    )
    if (exists) {
      throw new Error(`Category "${categoryData.name}" already exists.`)
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      description: categoryData.description || 'No description provided.'
    }
    setCategories((prev) => [newCategory, ...prev])
    return newCategory
  }

  const editCategory = (id, updatedData) => {
    const exists = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === updatedData.name.toLowerCase().trim()
    )
    if (exists) {
      throw new Error(`Category "${updatedData.name}" already exists.`)
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData, name: updatedData.name.trim() } : c))
    )
  }

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        editCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }
  return context
}
