import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import ProjectForm from '../components/ProjectForm'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function ProjectsManager() {
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const queryClient = useQueryClient()

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    },
  })

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const docRef = await addDoc(collection(db, 'projects'), newProject)
      return { id: docRef.id, ...newProject }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      setIsAddingProject(false)
    },
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updatedProject }) => {
      await updateDoc(doc(db, 'projects', id), updatedProject)
      return { id, ...updatedProject }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      setEditingProject(null)
    },
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, 'projects', id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
    },
  })

  const handleAddProject = async (projectData) => {
    await addProjectMutation.mutateAsync(projectData)
  }

  const handleUpdateProject = async (projectData) => {
    await updateProjectMutation.mutateAsync({
      id: editingProject.id,
      ...projectData,
    })
  }

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProjectMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (isAddingProject || editingProject) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
          {isAddingProject ? 'Add New Project' : 'Edit Project'}
        </h2>
        <ProjectForm
          initialData={editingProject}
          onSubmit={isAddingProject ? handleAddProject : handleUpdateProject}
          isSubmitting={addProjectMutation.isLoading || updateProjectMutation.isLoading}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your portfolio projects
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingProject(true)}
            className="flex items-center rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Project
          </button>
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
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Featured
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {projects?.map((project) => (
                    <tr key={project.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {project.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.featured ? 'Yes' : 'No'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Edit project</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Delete project</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
