<template>
  <div class="home-intro w-full min-h-[20vh] py-8 flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100">
    <div class="w-4/5 max-w-4xl p-5 flex flex-col sm:flex-row justify-between rounded-lg">
      <div class="text flex-1">
        <h1 class="home-intro-title text-4xl font-bold text-gray-900 mb-5">
          {{ title }}
        </h1>
        <p class="home-intro-description text-2xl text-gray-700 leading-relaxed">
          {{ description }}
        </p>
      </div>

      <div class="w-full sm:w-auto text-gray-900 flex justify-center mt-8 sm:mt-0 sm:ml-8">
        <router-link to="/contact" class="w-full sm:w-auto">
          <button class="primary w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
            Contact Us
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = ref('')
const description = ref('')

const content = {
  title: 'Creative Technology Studio',
  description: `
    We craft digital experiences that inspire and engage.
    From web applications to creative solutions,
    we bring your vision to life.
  `
}

onMounted(() => {
  title.value = content.title
  description.value = content.description
})
</script>

<style scoped>
.home-intro {
  transition: all 0.3s ease;
}

.primary {
  min-width: 150px;
}
</style>
