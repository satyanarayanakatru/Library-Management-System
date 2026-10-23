import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_BOOKS } from '../services/seedData'
import api from '../services/api'

const BookContext = createContext(null)
const STORAGE_KEY = 'librisync_books'

export function BookProvider({ children }) {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_BOOKS
    } catch {
      return INITIAL_BOOKS
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    } catch (e) {
      console.error('Failed to save books', e)
    }
  }, [books])

  // Optional sync with third-party API (DummyJSON products mapped as simulated library records)
  const syncWithApi = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/products?limit=6')
      if (res.data?.products && books.length <= INITIAL_BOOKS.length) {
        const mappedApiBooks = res.data.products.map((item, idx) => ({
          id: `api-b-${item.id}`,
          title: item.title,
          author: item.brand || 'Renowned Author',
          isbn: `978-0${item.id}128394-0`,
          publisher: 'Global Press Ltd.',
          category: idx % 2 === 0 ? 'Computer Science' : 'Business & Economics',
          publishedYear: 2021 + (idx % 4),
          totalCopies: item.stock > 10 ? 10 : item.stock || 5,
          availableCopies: item.stock > 10 ? 8 : (item.stock || 5) - 1,
          coverImage: item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          description: item.description || 'Comprehensive edition on modern domain applications.'
        }))

        // Merge without duplicates by ID
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.id))
          const fresh = mappedApiBooks.filter((b) => !existingIds.has(b.id))
          return [...prev, ...fresh]
        })
      }
    } catch (err) {
      console.warn('API fetch warning, using local seed dataset', err)
      // gracefully failover to seed data without breaking UI
    } finally {
      setLoading(false)
    }
  }, [books.length])

  // Add Book
  const addBook = (bookData) => {
    const newBook = {
      id: `book-${Date.now()}`,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      isbn: bookData.isbn.trim(),
      publisher: bookData.publisher.trim(),
      category: bookData.category,
      publishedYear: Number(bookData.publishedYear),
      totalCopies: Number(bookData.totalCopies),
      availableCopies: Number(bookData.totalCopies),
      coverImage: bookData.coverImage?.trim() || 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
      description: bookData.description?.trim() || 'No description provided.'
    }
    setBooks((prev) => [newBook, ...prev])
    return newBook
  }

  // Edit Book
  const editBook = (id, updatedData) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === id) {
          const totalCopies = Number(updatedData.totalCopies ?? book.totalCopies)
          const diff = totalCopies - book.totalCopies
          const updatedAvailable = Math.max(0, book.availableCopies + diff)

          return {
            ...book,
            ...updatedData,
            totalCopies,
            availableCopies: updatedAvailable,
            publishedYear: Number(updatedData.publishedYear ?? book.publishedYear),
          }
        }
        return book
      })
    )
  }

  // Delete Book
  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id))
  }

  // Update Available Copies (used when issuing/returning)
  const adjustAvailableCopies = (bookId, delta) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          const newAvailable = Math.max(0, Math.min(book.totalCopies, book.availableCopies + delta))
          return { ...book, availableCopies: newAvailable }
        }
        return book
      })
    )
  }

  const getBookById = (id) => books.find((b) => String(b.id) === String(id))

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        editBook,
        deleteBook,
        adjustAvailableCopies,
        getBookById,
        syncWithApi
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export function useBooks() {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider')
  }
  return context
}
