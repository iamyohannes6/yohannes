import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  limit,
} from 'firebase/firestore'
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { trackAdminAction } from './analytics'

const COLLECTIONS_TO_BACKUP = ['projects', 'content', 'messages']
const STORAGE_FOLDERS = ['projects', 'about']

export async function createBackup() {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      data: {},
      storageUrls: {},
    }

    // Backup Firestore collections
    for (const collectionName of COLLECTIONS_TO_BACKUP) {
      const querySnapshot = await getDocs(collection(db, collectionName))
      backup.data[collectionName] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }))
    }

    // Backup Storage files
    for (const folder of STORAGE_FOLDERS) {
      const folderRef = ref(storage, folder)
      const fileList = await listAll(folderRef)
      
      backup.storageUrls[folder] = await Promise.all(
        fileList.items.map(async (item) => ({
          path: item.fullPath,
          url: await getDownloadURL(item),
        }))
      )
    }

    // Create backup file
    const backupJson = JSON.stringify(backup, null, 2)
    const blob = new Blob([backupJson], { type: 'application/json' })
    const fileName = `portfolio-backup-${new Date().toISOString()}.json`

    // Trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    trackAdminAction('create_backup')
    return { success: true, fileName }
  } catch (error) {
    console.error('Backup failed:', error)
    throw error
  }
}

export async function restoreBackup(backupFile) {
  try {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      const backup = JSON.parse(e.target.result)
      
      // Validate backup structure
      if (!backup.timestamp || !backup.data || !backup.storageUrls) {
        throw new Error('Invalid backup file format')
      }

      // Start batch write for Firestore
      const batch = writeBatch(db)

      // Restore collections
      for (const [collectionName, documents] of Object.entries(backup.data)) {
        for (const { id, data } of documents) {
          const docRef = doc(db, collectionName, id)
          batch.set(docRef, data)
        }
      }

      // Commit Firestore changes
      await batch.commit()

      // Restore Storage files
      for (const [folder, files] of Object.entries(backup.storageUrls)) {
        for (const file of files) {
          const response = await fetch(file.url)
          const blob = await response.blob()
          const fileRef = ref(storage, file.path)
          await uploadBytes(fileRef, blob)
        }
      }

      trackAdminAction('restore_backup', { timestamp: backup.timestamp })
      return { success: true, timestamp: backup.timestamp }
    }

    reader.readAsText(backupFile)
  } catch (error) {
    console.error('Restore failed:', error)
    throw error
  }
}

export async function validateBackup(backupFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result)
        
        // Check backup structure
        const isValid = backup.timestamp &&
          backup.data &&
          backup.storageUrls &&
          COLLECTIONS_TO_BACKUP.every(collection => Array.isArray(backup.data[collection])) &&
          STORAGE_FOLDERS.every(folder => Array.isArray(backup.storageUrls[folder]))

        resolve({
          isValid,
          timestamp: backup.timestamp,
          collections: Object.keys(backup.data),
          totalDocuments: Object.values(backup.data).reduce((acc, curr) => acc + curr.length, 0),
          totalFiles: Object.values(backup.storageUrls).reduce((acc, curr) => acc + curr.length, 0),
        })
      } catch (error) {
        reject(new Error('Invalid backup file format'))
      }
    }

    reader.onerror = () => reject(new Error('Failed to read backup file'))
    reader.readAsText(backupFile)
  })
}
