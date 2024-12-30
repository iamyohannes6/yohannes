import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import Modal from '../components/Modal'
import { EnvelopeIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ContactManager() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    },
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId) => {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true,
        readAt: new Date().toISOString(),
      })
      return messageId
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
    },
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      await deleteDoc(doc(db, 'messages', messageId))
      return messageId
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      setDeleteModalOpen(false)
    },
  })

  const handleMarkAsRead = async (messageId) => {
    await markAsReadMutation.mutateAsync(messageId)
  }

  const handleDeleteMessage = async () => {
    if (selectedMessage) {
      await deleteMessageMutation.mutateAsync(selectedMessage.id)
      setSelectedMessage(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Messages</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage contact form submissions
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      From
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Message
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {messages?.map((message) => (
                    <tr
                      key={message.id}
                      className={message.read ? 'bg-white' : 'bg-blue-50'}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{message.name}</div>
                        <div className="text-gray-500">{message.email}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{message.message}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {message.read ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            New
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          {!message.read && (
                            <button
                              onClick={() => handleMarkAsRead(message.id)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                              <span className="sr-only">Mark as read</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedMessage(message)
                              setDeleteModalOpen(true)
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="sr-only">Delete message</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {messages?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">
                        <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 font-semibold">No messages yet</p>
                        <p className="mt-1">New messages will appear here</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedMessage(null)
        }}
        title="Delete Message"
        primaryAction={handleDeleteMessage}
        primaryActionText="Delete"
        danger
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Message Detail Modal */}
      <Modal
        open={!!selectedMessage && !deleteModalOpen}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
      >
        {selectedMessage && (
          <div className="mt-2 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">From</h4>
              <p className="mt-1 text-sm text-gray-500">{selectedMessage.name}</p>
              <p className="text-sm text-gray-500">{selectedMessage.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Message</h4>
              <p className="mt-1 text-sm text-gray-500">{selectedMessage.message}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Received</h4>
              <p className="mt-1 text-sm text-gray-500">
                {formatDate(selectedMessage.createdAt)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
