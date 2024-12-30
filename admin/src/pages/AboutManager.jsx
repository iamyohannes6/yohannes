import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import AboutForm from '../components/AboutForm'

export default function AboutManager() {
  const queryClient = useQueryClient()

  // Fetch about data
  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const docRef = doc(db, 'content', 'about')
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? docSnap.data() : null
    },
  })

  // Update about mutation
  const updateAboutMutation = useMutation({
    mutationFn: async (updatedData) => {
      await setDoc(doc(db, 'content', 'about'), updatedData)
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['about'])
    },
  })

  const handleUpdateAbout = async (formData) => {
    await updateAboutMutation.mutateAsync(formData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information, skills, and experience
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AboutForm
          initialData={about}
          onSubmit={handleUpdateAbout}
          isSubmitting={updateAboutMutation.isLoading}
        />
      </div>
    </div>
  )
}
