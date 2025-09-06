<template>
  <div class="memo-container">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="memo in memos" 
        :key="memo.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex items-center mb-4">
          <div class="w-3 h-3 rounded-full mr-3" :class="memo.color"></div>
          <h3 class="text-lg font-semibold text-gray-900">{{ memo.title }}</h3>
        </div>
        
        <p class="text-gray-600 text-sm mb-4">{{ memo.date }}</p>
        
        <p class="text-gray-700 leading-relaxed">{{ memo.content }}</p>
        
        <div class="flex flex-wrap gap-2 mt-4" v-if="memo.tags">
          <span 
            v-for="tag in memo.tags" 
            :key="tag"
            class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const memos = ref([
  {
    id: '1',
    title: 'Creative Process',
    content: 'Every great project starts with understanding. We dive deep into your vision, challenge assumptions, and explore possibilities.',
    date: 'September 2025',
    color: 'bg-blue-400',
    tags: ['creativity', 'process', 'design']
  },
  {
    id: '2',
    title: 'Technical Excellence',
    content: 'Code is poetry. We write clean, maintainable, and scalable solutions that stand the test of time.',
    date: 'September 2025',
    color: 'bg-green-400',
    tags: ['development', 'quality', 'architecture']
  },
  {
    id: '3',
    title: 'User Experience',
    content: 'Every click, every interaction matters. We craft experiences that users love and remember.',
    date: 'September 2025',
    color: 'bg-purple-400',
    tags: ['ux', 'design', 'user-centered']
  }
])
</script>

<style scoped>
.memo-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
