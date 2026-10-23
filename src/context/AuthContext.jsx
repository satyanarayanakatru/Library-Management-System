import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_STORAGE_KEY = 'librisync_registered_users'
const CURRENT_USER_KEY = 'librisync_current_user'

const DEFAULT_USERS = [
  {
    id: 'user-admin',
    name: 'Admin Librarian',
    email: 'admin@library.com',
    password: 'password123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-demo',
    name: 'Sarah Connor',
    email: 'sarah@library.com',
    password: 'password123',
    role: 'Librarian',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  }
]

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Ensure default users exist in local storage
  useEffect(() => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY)
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
      }
    } catch (e) {
      console.error('Error initializing user storage', e)
    }
  }, [])

  const getUsers = () => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY)
      return existing ? JSON.parse(existing) : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  }

  const login = async (email, password) => {
    const users = getUsers()
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    )

    if (!user) {
      throw new Error('Invalid email or password. Hint: admin@library.com / password123')
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'Librarian',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      loginTime: new Date().toISOString()
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
    setCurrentUser(sessionUser)
    return sessionUser
  }

  const register = async (userData) => {
    const users = getUsers()
    const exists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    )

    if (exists) {
      throw new Error('An account with this email address already exists.')
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.fullName,
      email: userData.email.trim(),
      password: userData.password,
      role: userData.role || 'Librarian',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      loginTime: new Date().toISOString()
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
    setCurrentUser(sessionUser)
    return sessionUser
  }

  const resetPassword = async (email, newPassword) => {
    const users = getUsers()
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    )

    if (userIndex === -1) {
      throw new Error('No account found with this email address.')
    }

    users[userIndex].password = newPassword
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    return true
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
