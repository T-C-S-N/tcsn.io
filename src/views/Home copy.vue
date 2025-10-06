<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <!-- Main Hero Section -->
    <div class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-8 overflow-hidden">
      <div class="relative z-10 max-w-7xl w-full text-center">      
        
        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-8 font-light tracking-wide opacity-0 translate-y-5 animate-fade-in-up animation-delay-100">
          Full-Stack Developer Portfolio
        </p>
        
        <!-- Description -->
        <div class="max-w-3xl mx-auto mb-12 opacity-0 translate-y-5 animate-fade-in-up animation-delay-200">
          <p class="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            Building modern web applications with cutting-edge technologies.
            Specialized in serverless architecture, edge computing, and scalable cloud solutions.
          </p>
        </div>
        
        <!-- Tech Stack Section -->
        <div class="my-16 max-w-6xl mx-auto opacity-0 translate-y-5 animate-fade-in-up animation-delay-300">
          <h2 class="text-3xl sm:text-4xl md:text-5xl text-gray-100 mb-10 font-bold flex items-center justify-center gap-4">
            <font-awesome-icon :icon="['fas', 'code']" class="text-gray-400" />
            Technology Stack
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Frontend -->
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <h3 class="text-2xl text-gray-100 mb-6 flex items-center gap-3 font-semibold">
                <font-awesome-icon :icon="['fas', 'laptop-code']" class="text-gray-400 text-xl" />
                Frontend
              </h3>
              <ul class="space-y-3 text-left">
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'vuejs']" class="text-green-500 text-xl w-6 text-center" /> Vue 3
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'bolt']" class="text-yellow-400 text-xl w-6 text-center" /> Vite
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'js']" class="text-yellow-300 text-xl w-6 text-center" /> JavaScript (ES6+)
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'css3-alt']" class="text-blue-500 text-xl w-6 text-center" /> Tailwind CSS
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'sass']" class="text-pink-500 text-xl w-6 text-center" /> SCSS
                </li>
                <li class="text-gray-300 py-3 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'icons']" class="text-gray-400 text-xl w-6 text-center" /> Font Awesome
                </li>
              </ul>
            </div>
            
            <!-- Backend & Cloud -->
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <h3 class="text-2xl text-gray-100 mb-6 flex items-center gap-3 font-semibold">
                <font-awesome-icon :icon="['fas', 'server']" class="text-gray-400 text-xl" />
                Backend & Cloud
              </h3>
              <ul class="space-y-3 text-left">
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'cloudflare']" class="text-orange-500 text-xl w-6 text-center" /> Cloudflare Workers
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'database']" class="text-gray-400 text-xl w-6 text-center" /> Cloudflare D1 (SQLite)
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'cube']" class="text-gray-400 text-xl w-6 text-center" /> Cloudflare KV
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'cloud']" class="text-gray-400 text-xl w-6 text-center" /> Cloudflare Pages
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'leaf']" class="text-green-600 text-xl w-6 text-center" /> MongoDB
                </li>
                <li class="text-gray-300 py-3 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'node-js']" class="text-green-500 text-xl w-6 text-center" /> Node.js
                </li>
              </ul>
            </div>
            
            <!-- Tools & Services -->
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <h3 class="text-2xl text-gray-100 mb-6 flex items-center gap-3 font-semibold">
                <font-awesome-icon :icon="['fas', 'toolbox']" class="text-gray-400 text-xl" />
                Tools & Services
              </h3>
              <ul class="space-y-3 text-left">
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'git-alt']" class="text-orange-600 text-xl w-6 text-center" /> Git & GitHub
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'robot']" class="text-gray-400 text-xl w-6 text-center" /> OpenAI API
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fab', 'google']" class="text-blue-500 text-xl w-6 text-center" /> Google OAuth
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'chart-line']" class="text-gray-400 text-xl w-6 text-center" /> Analytics & Tracking
                </li>
                <li class="text-gray-300 py-3 border-b border-primary-600/20 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'link']" class="text-gray-400 text-xl w-6 text-center" /> URL Shortener
                </li>
                <li class="text-gray-300 py-3 flex items-center gap-3 text-lg transition-all hover:text-gray-100 hover:pl-2">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-gray-400 text-xl w-6 text-center" /> JWT Authentication
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Architecture Highlights -->
        <div class="my-16 max-w-6xl mx-auto opacity-0 translate-y-5 animate-fade-in-up animation-delay-400">
          <h2 class="text-3xl sm:text-4xl md:text-5xl text-gray-100 mb-10 font-bold flex items-center justify-center gap-4">
            <font-awesome-icon :icon="['fas', 'project-diagram']" class="text-gray-400" />
            Architecture Highlights
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <font-awesome-icon :icon="['fas', 'rocket']" class="text-5xl text-gray-400 mb-4" />
              <h4 class="text-xl text-gray-100 mb-3 font-semibold">Serverless First</h4>
              <p class="text-gray-300 leading-relaxed text-sm">Built on Cloudflare's edge network for ultra-low latency and global scale</p>
            </div>
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <font-awesome-icon :icon="['fas', 'bolt']" class="text-5xl text-gray-400 mb-4" />
              <h4 class="text-xl text-gray-100 mb-3 font-semibold">Lightning Fast</h4>
              <p class="text-gray-300 leading-relaxed text-sm">Vite for instant HMR and optimized builds with code splitting</p>
            </div>
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <font-awesome-icon :icon="['fas', 'layer-group']" class="text-5xl text-gray-400 mb-4" />
              <h4 class="text-xl text-gray-100 mb-3 font-semibold">Modern Stack</h4>
              <p class="text-gray-300 leading-relaxed text-sm">Vue 3 Composition API with Pinia state management and Vue Router</p>
            </div>
            <div class="bg-primary-800/60 backdrop-blur-xl border border-primary-600/30 rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-500/50 hover:shadow-2xl">
              <font-awesome-icon :icon="['fas', 'lock']" class="text-5xl text-gray-400 mb-4" />
              <h4 class="text-xl text-gray-100 mb-3 font-semibold">Secure by Design</h4>
              <p class="text-gray-300 leading-relaxed text-sm">OAuth authentication, JWT tokens, and edge-level security</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex gap-6 justify-center items-center mt-12 flex-wrap opacity-0 translate-y-5 animate-fade-in-up animation-delay-500">
          <router-link to="/projects" class="inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 bg-primary-700/80 text-gray-100 border-2 border-primary-500/50 backdrop-blur-md shadow-xl hover:-translate-y-1 hover:bg-primary-600/90 hover:border-primary-400/60 hover:shadow-2xl no-underline">
            <font-awesome-icon :icon="['fas', 'folder-open']" />
            View Projects
          </router-link>
          <router-link to="/contact" class="inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 bg-primary-800/60 text-gray-300 border-2 border-primary-600/40 backdrop-blur-md hover:bg-primary-700/80 hover:border-primary-500/60 hover:text-gray-100 no-underline">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            Get in Touch
          </router-link>
        </div>
      </div>
      
      <!-- Animated Background -->
      <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div class="absolute w-full h-full bg-grid-pattern opacity-10 animate-grid-move"></div>
        <div class="absolute w-full h-full">
          <div class="absolute w-96 h-96 rounded-full blur-3xl opacity-30 bg-blue-500/30 top-[10%] left-[10%] animate-float"></div>
          <div class="absolute w-80 h-80 rounded-full blur-3xl opacity-30 bg-purple-500/30 bottom-[20%] right-[15%] animate-float animation-delay-700"></div>
          <div class="absolute w-88 h-88 rounded-full blur-3xl opacity-30 bg-pink-500/30 top-[50%] left-[50%] animate-float animation-delay-1400"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Animation classes are handled by Tailwind
})
</script>

<style scoped>
/* Custom animations for Tailwind */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-grid-move {
  animation: grid-move 20s linear infinite;
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-700 {
  animation-delay: 7s;
}

.animation-delay-1400 {
  animation-delay: 14s;
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
</style>
