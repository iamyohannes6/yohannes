import { createContext, useContext, useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const NotificationContext = createContext()

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Listen for new messages
    const messagesQuery = query(
      collection(db, 'messages'),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newNotifications = []
      snapshot.forEach((doc) => {
        newNotifications.push({
          id: doc.id,
          type: 'message',
          ...doc.data(),
        })
      })
      setNotifications(newNotifications)
      setUnreadCount(newNotifications.length)
    })

    return () => unsubscribe()
  }, [user])

  const value = {
    notifications,
    unreadCount,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
