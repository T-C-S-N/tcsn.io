<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-2xl font-bold mb-4">
            TCSN
          </h3>
          <p class="text-gray-300 mb-4 max-w-md">
            Creative technology studio crafting digital experiences that inspire and engage.
            We bring your vision to life with innovative solutions.
          </p>
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} TCSN. All rights reserved.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">
            Quick Links
          </h4>
          <ul class="space-y-2">
            <li
              v-for="link in quickLinks"
              :key="link.path"
            >
              <router-link
                :to="link.path"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">
            Get In Touch
          </h4>
          <div class="space-y-2 text-gray-300">
            <p>hello@tcsn.io</p>
            <p>Brussels, Belgium</p>
            <p>Remote Worldwide</p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-400 text-sm mb-4 md:mb-0">
          Built with Vue 3, Vite, and Tailwind CSS
        </div>
        
        <div class="flex space-x-4">
          <!-- Add social links here if needed -->
          <router-link 
            to="/message-for-you" 
            class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            💌
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Memos', path: '/memos' },
  { name: 'Contact', path: '/contact' },
]
</script>
