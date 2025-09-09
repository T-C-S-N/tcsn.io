<template>
  <div class="project-list">
    <!-- Filter/Sort Controls -->
    <div class="mb-8 flex flex-wrap gap-4 justify-center">
      <button
        v-for="filter in filters"
        :key="filter"
        class="px-4 py-2 rounded-full transition-colors duration-300"
        :class="{
          'bg-blue-600 text-white': activeFilter === filter,
          'bg-gray-200 text-gray-700 hover:bg-gray-300': activeFilter !== filter
        }"
        @click="activeFilter = filter"
      >
        {{ filter === 'all' ? 'All Projects' : filter }}
      </button>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="project in filteredProjects"
        :key="project._id"
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <!-- Project Thumbnail -->
        <div class="relative h-48 overflow-hidden">
          <img
            :src="project.thumbnail.src"
            :alt="project.thumbnail.alt"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
          <div class="absolute top-4 right-4">
            <span class="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
              {{ project.type }}
            </span>
          </div>
        </div>

        <!-- Project Content -->
        <div class="p-6">
          <h3
            class="text-xl font-bold mb-2"
            :class="project.titleColor"
          >
            {{ project.title }}
          </h3>
          
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ project.description }}
          </p>

          <!-- Project Tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="tag in project.tags.slice(0, 3)"
              :key="tag"
              class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {{ tag }}
            </span>
            <span
              v-if="project.tags.length > 3"
              class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              +{{ project.tags.length - 3 }}
            </span>
          </div>

          <!-- Project Actions -->
          <div class="flex space-x-3">
            <router-link
              :to="`/projects/${project._id}`"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-300"
            >
              View Details
            </router-link>
            
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors duration-300"
            >
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredProjects.length === 0"
      class="text-center py-12"
    >
      <div class="text-6xl mb-4">
        🔍
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        No projects found
      </h3>
      <p class="text-gray-500">
        Try adjusting your filters
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const activeFilter = ref('all')

const filters = computed(() => {
  const types = new Set(projectStore.projects.map(p => p.type))
  return ['all', ...Array.from(types)]
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projectStore.visibleProjects
  }
  return projectStore.visibleProjects.filter(p => p.type === activeFilter.value)
})

onMounted(() => {
  if (projectStore.projects.length === 0) {
    projectStore.initializeDefaultProjects()
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
