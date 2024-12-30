import { useState, useRef } from 'react'
import { createBackup, restoreBackup, validateBackup } from '../utils/backup'
import Modal from '../components/Modal'
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

export default function BackupManager() {
  const [isRestoring, setIsRestoring] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [error, setError] = useState('')
  const [backupDetails, setBackupDetails] = useState(null)
  const [showConfirmRestore, setShowConfirmRestore] = useState(false)
  const fileInputRef = useRef()
  const selectedFileRef = useRef(null)

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true)
      setError('')
      const result = await createBackup()
      if (result.success) {
        // Success message is shown through the download
      }
    } catch (error) {
      setError('Failed to create backup: ' + error.message)
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setError('')
      const details = await validateBackup(file)
      if (details.isValid) {
        setBackupDetails(details)
        selectedFileRef.current = file
        setShowConfirmRestore(true)
      } else {
        setError('Invalid backup file format')
      }
    } catch (error) {
      setError('Failed to validate backup: ' + error.message)
    }
  }

  const handleRestore = async () => {
    if (!selectedFileRef.current) return

    try {
      setIsRestoring(true)
      setError('')
      const result = await restoreBackup(selectedFileRef.current)
      if (result.success) {
        setShowConfirmRestore(false)
        setBackupDetails(null)
        selectedFileRef.current = null
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      setError('Failed to restore backup: ' + error.message)
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Backup Manager</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and restore backups of your portfolio content
          </p>
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Create Backup */}
        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <ArrowDownTrayIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium text-gray-900">Create Backup</h3>
              <p className="text-sm text-gray-500">
                Download a complete backup of your portfolio content and files
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
            >
              {isCreatingBackup ? 'Creating...' : 'Create Backup'}
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium text-gray-900">Restore Backup</h3>
              <p className="text-sm text-gray-500">
                Restore your portfolio content from a backup file
              </p>
            </div>
          </div>
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-600 file:text-white
                hover:file:bg-primary-500
                file:cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        open={showConfirmRestore}
        onClose={() => {
          setShowConfirmRestore(false)
          setBackupDetails(null)
          selectedFileRef.current = null
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }}
        title="Confirm Restore"
        primaryAction={handleRestore}
        primaryActionText={isRestoring ? 'Restoring...' : 'Restore'}
        danger
      >
        <div className="mt-2 space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to restore from this backup? This will overwrite your current content.
          </p>
          {backupDetails && (
            <div className="rounded-md bg-gray-50 p-4">
              <h4 className="text-sm font-medium text-gray-900">Backup Details</h4>
              <dl className="mt-2 divide-y divide-gray-200">
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(backupDetails.timestamp).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500">Collections</dt>
                  <dd className="text-sm text-gray-900">{backupDetails.collections.length}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500">Documents</dt>
                  <dd className="text-sm text-gray-900">{backupDetails.totalDocuments}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500">Files</dt>
                  <dd className="text-sm text-gray-900">{backupDetails.totalFiles}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
