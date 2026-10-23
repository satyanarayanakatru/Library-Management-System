import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_MEMBERS } from '../services/seedData'

const MemberContext = createContext(null)
const STORAGE_KEY = 'librisync_members'

export function MemberProvider({ children }) {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS
    } catch {
      return INITIAL_MEMBERS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    } catch (e) {
      console.error('Failed to save members to storage', e)
    }
  }, [members])

  const addMember = (memberData) => {
    const existingEmail = members.find(
      (m) => m.email.toLowerCase() === memberData.email.toLowerCase().trim()
    )
    if (existingEmail) {
      throw new Error('A member with this email address already exists.')
    }

    const nextNumber = members.length + 1
    const generatedId = `LIB-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`

    const newMember = {
      id: `mem-${Date.now()}`,
      membershipId: memberData.membershipId?.trim() || generatedId,
      fullName: memberData.fullName.trim(),
      email: memberData.email.trim(),
      mobileNumber: memberData.mobileNumber.trim(),
      address: memberData.address.trim(),
      membershipDate: memberData.membershipDate || new Date().toISOString().split('T')[0],
      status: memberData.status || 'Active'
    }

    setMembers((prev) => [newMember, ...prev])
    return newMember
  }

  const editMember = (id, updatedData) => {
    const existingEmail = members.find(
      (m) => m.id !== id && m.email.toLowerCase() === updatedData.email.toLowerCase().trim()
    )
    if (existingEmail) {
      throw new Error('Another member is already registered with this email.')
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    )
  }

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const getMemberById = (id) => members.find((m) => m.id === id)

  return (
    <MemberContext.Provider
      value={{
        members,
        addMember,
        editMember,
        deleteMember,
        getMemberById
      }}
    >
      {children}
    </MemberContext.Provider>
  )
}

export function useMembers() {
  const context = useContext(MemberContext)
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider')
  }
  return context
}
