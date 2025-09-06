<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Memos</h1>
        <p class="text-xl text-gray-600">
          Thoughts, ideas, and insights from our team
        </p>
      </div>

      <!-- Memos Component -->
      <Memo />
    </div>
  </div>
</template>

<script setup>
import Memo from '@/components/Memo.vue'
</script>
