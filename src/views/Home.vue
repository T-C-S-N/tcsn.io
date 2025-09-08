<template>
  <div>
    <!-- Welcome Box Section -->
    <div class="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100 section-1">
      <div class="w-full mt-[-100px]">
        <WelcomeBox class="welcome-box" />
      </div>
    </div>

<div class="bg-gray text-black">ddddd</div>


    <!-- Home Intro Section -->
    <HomeIntro />

    <!-- Services Section -->
    <div class="w-full min-h-screen bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-16">Our Services</h2>
        
        <!-- Service Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-lg">
            <Plus class="h-8 w-8 text-blue-600 mb-4" />
            <h3 class="text-xl font-semibold mb-4">Web Development</h3>
            <p class="text-gray-600">Modern, responsive web applications built with the latest technologies.</p>
          </div>
          
          <div class="bg-gray-50 p-8 rounded-lg">
            <Plus class="h-8 w-8 text-green-600 mb-4" />
            <h3 class="text-xl font-semibold mb-4">Design System</h3>
            <p class="text-gray-600">Comprehensive design systems that ensure consistency across your brand.</p>
          </div>
          
          <div class="bg-gray-50 p-8 rounded-lg">
            <Plus class="h-8 w-8 text-purple-600 mb-4" />
            <h3 class="text-xl font-semibold mb-4">Web Design</h3>
            <p class="text-gray-600">Beautiful, user-centered designs that convert visitors into customers.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Section -->
    <div class="w-full min-h-screen bg-gray-900 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-16">Featured Projects</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in featuredProjects"
            :key="project._id"
            class="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
            <img
              :src="project.thumbnail.src"
              :alt="project.thumbnail.alt"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2" :class="project.titleColor">
                {{ project.title }}
              </h3>
              <p class="text-gray-300 mb-4">{{ project.description }}</p>
              <router-link
                :to="`/projects/${project._id}`"
                class="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                View Project
                <ChevronRight class="h-4 w-4 ml-1" />
              </router-link>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/projects"
            class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            View All Projects
            <ChevronRight class="h-5 w-5 ml-2" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Let's discuss how we can help bring your ideas to life.
        </p>
        <router-link
          to="/contact"
          class="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Get In Touch
          <ChevronRight class="h-5 w-5 ml-2" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import WelcomeBox from '@/components/WelcomeBox.vue'
import HomeIntro from '@/components/home/HomeIntro.vue'
import { Plus, ChevronRight } from 'lucide-vue-next'

const projectStore = useProjectStore()

const featuredProjects = computed(() => 
  projectStore.visibleProjects.slice(0, 6)
)

onMounted(() => {
  // Initialize projects
  projectStore.initializeDefaultProjects()

  // Scroll animation for welcome box
  const handleScroll = () => {
    const welcomeBox = document.querySelector('.welcome-box')
    if (welcomeBox) {
      const scroll = window.scrollY
      const scale = 1 + scroll / 15
      welcomeBox.style.transform = `scale(${scale}) translateY(${scroll / 2}px) translateX(${scroll / 10}px) rotateX(-${scroll / 10}deg) rotateY(-${scroll / 10}deg) rotateZ(${scroll / 10}deg)`
      welcomeBox.style.filter = `blur(${scroll / 5}px)`
    }
  }

  window.addEventListener('scroll', handleScroll)

  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.section-1 {
  position: relative;
  overflow: hidden;
}
</style>
