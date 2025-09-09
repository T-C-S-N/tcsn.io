<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-link 
        to="/projects" 
        class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        ← Back to Projects
      </router-link>

      <div
        v-if="project"
        class="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Project Header -->
        <div class="relative h-64 md:h-96">
          <img 
            :src="project.thumbnail.src" 
            :alt="project.thumbnail.alt"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="text-center text-white">
              <h1
                class="text-4xl md:text-6xl font-bold mb-4"
                :class="project.titleColor"
              >
                {{ project.title }}
              </h1>
              <p class="text-xl md:text-2xl max-w-2xl">
                {{ project.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Project Details -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 class="text-2xl font-semibold mb-4">
                Project Details
              </h2>
              <dl class="space-y-2">
                <div
                  v-for="detail in project.details"
                  :key="detail.key"
                >
                  <dt class="font-medium text-gray-900">
                    {{ detail.key }}:
                  </dt>
                  <dd class="text-gray-600">
                    {{ detail.value }}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 class="text-2xl font-semibold mb-4">
                Technologies
              </h2>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in project.tags" 
                  :key="tag"
                  class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Visit Project Button -->
          <div
            v-if="project.url"
            class="text-center"
          >
            <a 
              :href="project.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Visit Project →
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-else
        class="text-center py-12"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p class="mt-4 text-gray-600">
          Loading project...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const route = useRoute()
const projectStore = useProjectStore()

const projectId = computed(() => route.params.id)
const project = computed(() => projectStore.getProjectById(projectId.value))

onMounted(() => {
  // Initialize projects if not already loaded
  if (projectStore.projects.length === 0) {
    projectStore.initializeDefaultProjects()
  }
})
</script>
