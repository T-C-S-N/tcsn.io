<template>
  <div class="home-container">
    <!-- Main Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- Main Title -->
        <h1 class="main-title">
          <span class="brand">TCSN.IO</span>
        </h1>
        
        <!-- Subtitle -->
        <p class="subtitle">
          Full-Stack Developer Portfolio
        </p>
        
        <!-- Description -->
        <div class="description">
          <p class="intro-text">
            Building modern web applications with cutting-edge technologies.
            Specialized in serverless architecture, edge computing, and scalable cloud solutions.
          </p>
        </div>
        
        <!-- Tech Stack Section -->
        <div class="tech-stack">
          <h2 class="tech-title">
            <font-awesome-icon :icon="['fas', 'code']" class="icon" />
            Technology Stack
          </h2>
          
          <div class="tech-grid">
            <!-- Frontend -->
            <div class="tech-category">
              <h3 class="category-title">
                <font-awesome-icon :icon="['fas', 'laptop-code']" class="category-icon" />
                Frontend
              </h3>
              <ul class="tech-list">
                <li><font-awesome-icon :icon="['fab', 'vuejs']" class="tech-icon vue" /> Vue 3</li>
                <li><font-awesome-icon :icon="['fas', 'bolt']" class="tech-icon" /> Vite</li>
                <li><font-awesome-icon :icon="['fab', 'js']" class="tech-icon js" /> JavaScript (ES6+)</li>
                <li><font-awesome-icon :icon="['fab', 'css3-alt']" class="tech-icon css" /> Tailwind CSS</li>
                <li><font-awesome-icon :icon="['fab', 'sass']" class="tech-icon sass" /> SCSS</li>
                <li><font-awesome-icon :icon="['fas', 'icons']" class="tech-icon" /> Font Awesome</li>
              </ul>
            </div>
            
            <!-- Backend & Cloud -->
            <div class="tech-category">
              <h3 class="category-title">
                <font-awesome-icon :icon="['fas', 'server']" class="category-icon" />
                Backend & Cloud
              </h3>
              <ul class="tech-list">
                <li><font-awesome-icon :icon="['fab', 'cloudflare']" class="tech-icon cloudflare" /> Cloudflare Workers</li>
                <li><font-awesome-icon :icon="['fas', 'database']" class="tech-icon" /> Cloudflare D1 (SQLite)</li>
                <li><font-awesome-icon :icon="['fas', 'cube']" class="tech-icon" /> Cloudflare KV</li>
                <li><font-awesome-icon :icon="['fas', 'cloud']" class="tech-icon" /> Cloudflare Pages</li>
                <li><font-awesome-icon :icon="['fas', 'leaf']" class="tech-icon mongodb" /> MongoDB</li>
                <li><font-awesome-icon :icon="['fab', 'node-js']" class="tech-icon node" /> Node.js</li>
              </ul>
            </div>
            
            <!-- Tools & Services -->
            <div class="tech-category">
              <h3 class="category-title">
                <font-awesome-icon :icon="['fas', 'toolbox']" class="category-icon" />
                Tools & Services
              </h3>
              <ul class="tech-list">
                <li><font-awesome-icon :icon="['fab', 'git-alt']" class="tech-icon git" /> Git & GitHub</li>
                <li><font-awesome-icon :icon="['fas', 'robot']" class="tech-icon" /> OpenAI API</li>
                <li><font-awesome-icon :icon="['fab', 'google']" class="tech-icon google" /> Google OAuth</li>
                <li><font-awesome-icon :icon="['fas', 'chart-line']" class="tech-icon" /> Analytics & Tracking</li>
                <li><font-awesome-icon :icon="['fas', 'link']" class="tech-icon" /> URL Shortener</li>
                <li><font-awesome-icon :icon="['fas', 'shield-alt']" class="tech-icon" /> JWT Authentication</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Architecture Highlights -->
        <div class="architecture-section">
          <h2 class="arch-title">
            <font-awesome-icon :icon="['fas', 'project-diagram']" class="icon" />
            Architecture Highlights
          </h2>
          <div class="arch-grid">
            <div class="arch-card">
              <font-awesome-icon :icon="['fas', 'rocket']" class="arch-icon" />
              <h4>Serverless First</h4>
              <p>Built on Cloudflare's edge network for ultra-low latency and global scale</p>
            </div>
            <div class="arch-card">
              <font-awesome-icon :icon="['fas', 'bolt']" class="arch-icon" />
              <h4>Lightning Fast</h4>
              <p>Vite for instant HMR and optimized builds with code splitting</p>
            </div>
            <div class="arch-card">
              <font-awesome-icon :icon="['fas', 'layer-group']" class="arch-icon" />
              <h4>Modern Stack</h4>
              <p>Vue 3 Composition API with Pinia state management and Vue Router</p>
            </div>
            <div class="arch-card">
              <font-awesome-icon :icon="['fas', 'lock']" class="arch-icon" />
              <h4>Secure by Design</h4>
              <p>OAuth authentication, JWT tokens, and edge-level security</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Buttons -->
        <div class="cta-buttons">
          <router-link to="/projects" class="cta-btn primary">
            <font-awesome-icon :icon="['fas', 'folder-open']" />
            View Projects
          </router-link>
          <router-link to="/contact" class="cta-btn secondary">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            Get in Touch
          </router-link>
        </div>
      </div>
      
      <!-- Animated Background -->
      <div class="bg-animation">
        <div class="grid-lines"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Add entrance animations
  const elements = document.querySelectorAll('.hero-content > *')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, index * 100)
  })
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%);
  padding: 2rem;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  width: 100%;
  text-align: center;
}

.hero-content > * {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

/* Main Title */
.main-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.brand {
  background: linear-gradient(135deg, #d1d5db 0%, #f3f4f6 50%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(156, 163, 175, 0.3));
}

/* Subtitle */
.subtitle {
  font-size: clamp(1.25rem, 3vw, 2rem);
  color: #9ca3af;
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

/* Description */
.description {
  max-width: 800px;
  margin: 0 auto 3rem;
}

.intro-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #d1d5db;
  line-height: 1.8;
  font-weight: 300;
}

/* Tech Stack Section */
.tech-stack {
  margin: 4rem auto;
  max-width: 1200px;
}

.tech-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #f3f4f6;
  margin-bottom: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.tech-title .icon {
  color: #9ca3af;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.tech-category {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.tech-category:hover {
  transform: translateY(-5px);
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(107, 114, 128, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.category-title {
  font-size: 1.5rem;
  color: #f3f4f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

.category-icon {
  color: #9ca3af;
  font-size: 1.25rem;
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.tech-list li {
  color: #d1d5db;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.tech-list li:last-child {
  border-bottom: none;
}

.tech-list li:hover {
  color: #f3f4f6;
  padding-left: 0.5rem;
}

.tech-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.tech-icon.vue { color: #42b883; }
.tech-icon.js { color: #f7df1e; }
.tech-icon.css { color: #1572b6; }
.tech-icon.sass { color: #cc6699; }
.tech-icon.cloudflare { color: #f38020; }
.tech-icon.mongodb { color: #47a248; }
.tech-icon.node { color: #339933; }
.tech-icon.git { color: #f05032; }
.tech-icon.google { color: #4285f4; }

/* Architecture Section */
.architecture-section {
  margin: 4rem auto;
  max-width: 1200px;
}

.arch-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #f3f4f6;
  margin-bottom: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.arch-title .icon {
  color: #9ca3af;
}

.arch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.arch-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.arch-card:hover {
  transform: translateY(-5px);
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(107, 114, 128, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.arch-icon {
  font-size: 2.5rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.arch-card h4 {
  font-size: 1.25rem;
  color: #f3f4f6;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.arch-card p {
  color: #d1d5db;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid transparent;
  backdrop-filter: blur(8px);
}

.cta-btn.primary {
  background: rgba(55, 65, 81, 0.8);
  color: #f3f4f6;
  border-color: rgba(107, 114, 128, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  background: rgba(75, 85, 99, 0.9);
  border-color: rgba(156, 163, 175, 0.6);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

.cta-btn.secondary {
  background: rgba(31, 41, 55, 0.6);
  color: #d1d5db;
  border-color: rgba(75, 85, 99, 0.4);
}

.cta-btn.secondary:hover {
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(107, 114, 128, 0.6);
  color: #f3f4f6;
}

/* Background Animation */
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #60a5fa, transparent);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #a78bfa, transparent);
  bottom: 20%;
  right: 15%;
  animation-delay: 7s;
}

.shape-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #ec4899, transparent);
  top: 50%;
  left: 50%;
  animation-delay: 14s;
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

/* Responsive */
@media (max-width: 768px) {
  .tech-grid,
  .arch-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>
