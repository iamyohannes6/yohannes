import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { db } from '../config/firebase'
import Modal from '../components/Modal'
import { trackAdminAction } from '../utils/analytics'

export default function UserManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const auth = getAuth()

  // Fetch admin users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const q = query(collection(db, 'admins'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    },
  })

  // Add new admin user
  const addUserMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        // Add to admins collection
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
        })

        trackAdminAction('add_admin_user', { email })
        return user
      } catch (error) {
        console.error('Error adding user:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      setIsAddModalOpen(false)
      setNewUserEmail('')
      setNewUserPassword('')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Delete admin user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      try {
        // Remove from admins collection
        await deleteDoc(doc(db, 'admins', userId))
        
        // Delete auth user
        const user = auth.currentUser
        if (user) {
          await deleteUser(user)
        }

        trackAdminAction('delete_admin_user', { userId })
      } catch (error) {
        console.error('Error deleting user:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  // Reset password
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      trackAdminAction('reset_password', { email })
    } catch (error) {
      setError(error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Admin Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage admin users who have access to the admin panel
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-500"
          >
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created At
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => handleResetPassword(user.email)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteModalOpen(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setNewUserEmail('')
          setNewUserPassword('')
          setError('')
        }}
        title="Add Admin User"
        primaryAction={() => addUserMutation.mutate({ email: newUserEmail, password: newUserPassword })}
        primaryActionText="Add User"
      >
        <div className="mt-2 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
          setError('')
        }}
        title="Delete Admin User"
        primaryAction={() => deleteUserMutation.mutate(selectedUser.id)}
        primaryActionText="Delete"
        danger
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this admin user? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  )
}
