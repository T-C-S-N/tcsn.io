import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref([])

  // Computed
  const visibleProjects = computed(() => 
    projects.value.filter(project => project.display)
  )

  // Actions
  const addProject = (project) => {
    projects.value.push(project)
  }

  const updateProject = (id, updates) => {
    const index = projects.value.findIndex(p => p._id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates }
    }
  }

  const deleteProject = (id) => {
    const index = projects.value.findIndex(p => p._id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }

  const getProjectById = (id) => {
    return projects.value.find(project => project._id === id)
  }

  const initializeDefaultProjects = () => {
    if (projects.value.length === 0) {
      projects.value = [
        {
          _id: '60f1f9f0b9d3b8b2b8b2b8b2',
          display: true,
          type: 'app',
          tags: ['Vue', 'Vite', 'Tailwind', 'Vercel', 'JavaScript', 'ecommerce', 'storefront', 'stripe', 'UI/UX', 'design', 'online'],
          title: 'Velofcourse',
          titleColor: 'text-yellow-400',
          description: 'Velofcourse is a bicycle store & repair shop in Brussels. The app is built from scratch as a storefront with an integrated e-commerce.',
          url: 'https://velofcourse.com',
          date: '2022-2023',
          details: [
            { key: 'Project Type', value: 'Storefront, E-commerce, Responsive' },
            { key: 'Multilingual', value: 'English, French' },
            { key: 'UI/UX Design', value: 'Figma' },
            { key: 'Language', value: 'JavaScript' },
            { key: 'Libraries', value: 'Tailwind, Google Maps API, Stripe, Vue' },
            { key: 'Front-End', value: 'Vue 3' },
            { key: 'Back-End', value: 'Node.js' },
            { key: 'Architecture', value: 'Monolithic' },
            { key: 'Date', value: '2022-2023' },
          ],
          thumbnail: {
            alt: 'Velofcourse - Thumbnail',
            src: '/images/projects/Velofcourse/thumbnail.png',
            type: 'image'
          }
        },
        {
          _id: '60f1f9f0b9d3b8b2b8b2b8b3',
          display: true,
          type: 'web',
          tags: ['Vue', 'Tailwind', 'Creative', 'Portfolio', 'JavaScript'],
          title: 'TCSN Portfolio',
          titleColor: 'text-blue-400',
          description: 'Our own portfolio website showcasing our creative and technical capabilities.',
          date: '2025',
          details: [
            { key: 'Project Type', value: 'Portfolio, Creative' },
            { key: 'Language', value: 'JavaScript' },
            { key: 'Framework', value: 'Vue 3' },
            { key: 'Build Tool', value: 'Vite' },
            { key: 'Styling', value: 'Tailwind CSS' },
            { key: 'State Management', value: 'Pinia' },
          ],
          thumbnail: {
            alt: 'TCSN Portfolio',
            src: '/logo.png',
            type: 'image'
          }
        }
      ]
    }
  }

  return {
    projects,
    visibleProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    initializeDefaultProjects
  }
})
