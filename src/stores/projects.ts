import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type Project from '@/models/Project'

export const useProjectStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const visibleProjects = computed(() => 
    projects.value.filter(project => project.display)
  )

  const projectsByType = computed(() => (type: string) =>
    projects.value.filter(project => project.type === type)
  )

  const getProjectById = computed(() => (id: string) =>
    projects.value.find(project => project._id === id)
  )

  // Actions
  const setProjects = (newProjects: Project[]) => {
    projects.value = newProjects
  }

  const addProject = (project: Project) => {
    projects.value.push(project)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex(p => p._id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates }
    }
  }

  const deleteProject = (id: string) => {
    const index = projects.value.findIndex(p => p._id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }

  const setCurrentProject = (project: Project | null) => {
    currentProject.value = project
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize with default projects (moved from original slice)
  const initializeDefaultProjects = () => {
    // This would contain the default projects from the original slice
    // For now, we'll start with an empty array and load projects from API
    projects.value = []
  }

  return {
    // State
    projects,
    currentProject,
    isLoading,
    error,
    
    // Getters
    visibleProjects,
    projectsByType,
    getProjectById,
    
    // Actions
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    setLoading,
    setError,
    clearError,
    initializeDefaultProjects,
  }
})
