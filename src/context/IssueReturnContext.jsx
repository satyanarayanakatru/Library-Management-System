import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_ISSUES, INITIAL_FINES, INITIAL_ACTIVITIES } from '../services/seedData'
import { useBooks } from './BookContext'

const IssueReturnContext = createContext(null)
const ISSUES_STORAGE_KEY = 'librisync_issues'
const FINES_STORAGE_KEY = 'librisync_fines'
const ACTIVITIES_STORAGE_KEY = 'librisync_activities'

const FINE_RATE_PER_DAY = 2 // $2 per day overdue

export function IssueReturnProvider({ children }) {
  const { adjustAvailableCopies, getBookById } = useBooks()

  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem(ISSUES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_ISSUES
    } catch {
      return INITIAL_ISSUES
    }
  })

  const [fines, setFines] = useState(() => {
    try {
      const saved = localStorage.getItem(FINES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_FINES
    } catch {
      return INITIAL_FINES
    }
  })

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVITIES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES
    } catch {
      return INITIAL_ACTIVITIES
    }
  })

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues))
      localStorage.setItem(FINES_STORAGE_KEY, JSON.stringify(fines))
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
    } catch (e) {
      console.error('Storage sync error', e)
    }
  }, [issues, fines, activities])

  // Helper to add activity log
  const logActivity = (type, title, desc) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      type,
      title,
      desc,
      time: 'Just now'
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)])
  }

  // Issue a book
  const issueBook = ({ bookId, member, dueDate, issueDate }) => {
    const book = getBookById(bookId)
    if (!book) {
      throw new Error('Selected book not found.')
    }

    if (book.availableCopies <= 0) {
      throw new Error(`"${book.title}" is currently out of stock (0 copies available).`)
    }

    // Check duplicate active issue for this member
    const existingActiveIssue = issues.find(
      (iss) =>
        iss.bookId === bookId &&
        iss.memberId === member.id &&
        (iss.status === 'Issued' || iss.status === 'Overdue')
    )

    if (existingActiveIssue) {
      throw new Error(`Member ${member.fullName} has already issued this book and hasn't returned it yet.`)
    }

    const todayStr = issueDate || new Date().toISOString().split('T')[0]
    const dueStr = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const newIssue = {
      id: `iss-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.fullName,
      membershipId: member.membershipId,
      issueDate: todayStr,
      dueDate: dueStr,
      returnDate: null,
      status: 'Issued'
    }

    setIssues((prev) => [newIssue, ...prev])
    // Decrement available copies
    adjustAvailableCopies(book.id, -1)
    logActivity('issue', 'Book Issued', `"${book.title}" issued to ${member.fullName}`)

    return newIssue
  }

  // Return a book
  const returnBook = (issueId, returnDate) => {
    const issue = issues.find((i) => i.id === issueId)
    if (!issue) {
      throw new Error('Issue record not found.')
    }

    if (issue.status === 'Returned') {
      throw new Error('This book has already been returned.')
    }

    const actualReturnDate = returnDate || new Date().toISOString().split('T')[0]
    const returnTime = new Date(actualReturnDate).getTime()
    const dueTime = new Date(issue.dueDate).getTime()

    // Calculate overdue days
    const diffTime = returnTime - dueTime
    const overdueDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0
    let fineAmount = 0

    if (overdueDays > 0) {
      fineAmount = overdueDays * FINE_RATE_PER_DAY
      const newFine = {
        id: `fine-${Date.now()}`,
        issueId: issue.id,
        memberId: issue.memberId,
        memberName: issue.memberName,
        bookTitle: issue.bookTitle,
        dueDate: issue.dueDate,
        overdueDays,
        amount: fineAmount,
        status: 'Unpaid',
        dateRecorded: actualReturnDate
      }
      setFines((prev) => [newFine, ...prev])
    }

    // Update issue record
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              returnDate: actualReturnDate,
              status: 'Returned'
            }
          : i
      )
    )

    // Increment available copies
    adjustAvailableCopies(issue.bookId, 1)
    logActivity(
      'return',
      'Book Returned',
      `"${issue.bookTitle}" returned by ${issue.memberName}${fineAmount > 0 ? ` (Overdue fine: $${fineAmount})` : ''}`
    )

    return { overdueDays, fineAmount }
  }

  // Toggle fine payment status (Paid / Unpaid)
  const toggleFinePaymentStatus = (fineId) => {
    setFines((prev) =>
      prev.map((f) => {
        if (f.id === fineId) {
          const nextStatus = f.status === 'Paid' ? 'Unpaid' : 'Paid'
          if (nextStatus === 'Paid') {
            logActivity('fine', 'Fine Settled', `$${f.amount}.00 fine paid by ${f.memberName}`)
          }
          return { ...f, status: nextStatus }
        }
        return f
      })
    )
  }

  // Check and dynamically mark overdue issues
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setIssues((prev) =>
      prev.map((i) => {
        if (i.status === 'Issued' && i.dueDate < today) {
          return { ...i, status: 'Overdue' }
        }
        return i
      })
    )
  }, [])

  return (
    <IssueReturnContext.Provider
      value={{
        issues,
        fines,
        activities,
        issueBook,
        returnBook,
        toggleFinePaymentStatus,
        FINE_RATE_PER_DAY
      }}
    >
      {children}
    </IssueReturnContext.Provider>
  )
}

export function useIssueReturn() {
  const context = useContext(IssueReturnContext)
  if (!context) {
    throw new Error('useIssueReturn must be used within an IssueReturnProvider')
  }
  return context
}
