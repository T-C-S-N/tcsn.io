<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-grid">
        <!-- Company Info -->
        <div class="footer-section footer-brand">
          <h3 class="footer-title">
            <span class="brand-text">TCSN</span><span class="brand-dot">.</span><span class="brand-ext">IO</span>
          </h3>
          <p class="footer-description">
            Full-stack developer crafting modern web applications with cutting-edge technologies.
            Specialized in serverless architecture and edge computing.
          </p>
          <div class="social-links">
            <a 
              href="https://github.com/T-C-S-N" 
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              title="GitHub"
            >
              <font-awesome-icon :icon="['fab', 'github']" />
            </a>
            <a 
              href="https://twitter.com/tcsn_io" 
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              title="Twitter"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a 
              href="https://linkedin.com/company/tcsn" 
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              title="LinkedIn"
            >
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="footer-section-title">
            Quick Links
          </h4>
          <ul class="footer-links">
            <li
              v-for="link in quickLinks"
              :key="link.path"
            >
              <router-link
                :to="link.path"
                class="footer-link"
              >
                <font-awesome-icon 
                  :icon="link.icon" 
                  class="footer-link-icon"
                />
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Technologies -->
        <div class="footer-section">
          <h4 class="footer-section-title">
            Technologies
          </h4>
          <ul class="footer-tech">
            <li v-for="tech in technologies" :key="tech">
              <font-awesome-icon 
                :icon="['fas', 'chevron-right']" 
                class="tech-icon"
              />
              {{ tech }}
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4 class="footer-section-title">
            Get In Touch
          </h4>
          <div class="contact-info">
            <a href="mailto:hello@tcsn.io" class="contact-link">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              hello@tcsn.io
            </a>
            <p class="contact-item">
              <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
              Brussels, Belgium
            </p>
            <p class="contact-item">
              <font-awesome-icon :icon="['fas', 'globe']" />
              Remote Worldwide
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>© {{ currentYear }} TCSN. All rights reserved.</p>
            <p class="built-with">
              Built with 
              <font-awesome-icon :icon="['fab', 'vuejs']" class="tech-icon-inline vue" />
              Vue 3, 
              <font-awesome-icon :icon="['fas', 'bolt']" class="tech-icon-inline" />
              Vite, 
              <font-awesome-icon :icon="['fab', 'cloudflare']" class="tech-icon-inline cloudflare" />
              Cloudflare
            </p>
          </div>
          
          <div class="footer-extra">
            <router-link 
              to="/message-for-you" 
              class="secret-link"
              title="Something special..."
            >
              💌 Secret Message
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const quickLinks = [
  { name: 'Home', path: '/', icon: ['fas', 'home'] },
  { name: 'Projects', path: '/projects', icon: ['fas', 'folder-open'] },
  { name: 'Memos', path: '/memos', icon: ['fas', 'sticky-note'] },
  { name: 'Contact', path: '/contact', icon: ['fas', 'envelope'] },
]

const technologies = [
  'Vue 3',
  'Cloudflare Workers',
  'Cloudflare D1',
  'Tailwind CSS',
  'SCSS',
  'Font Awesome'
]
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
  color: #d1d5db;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 1rem 1.5rem;
}

/* Footer Grid */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

/* Brand Section */
.footer-brand {
  grid-column: 1 / -1;
}

.footer-title {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.brand-text {
  background: linear-gradient(135deg, #d1d5db 0%, #f3f4f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-dot {
  color: #6b7280;
  margin: 0 4px;
}

.brand-ext {
  color: #9ca3af;
  font-size: 1.25rem;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #d1d5db;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}

.social-link:hover {
  color: #f3f4f6;
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(107, 114, 128, 0.5);
  transform: translateY(-2px);
}

/* Footer Sections */
.footer-section {
  min-width: 0;
}

.footer-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 1.25rem;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: #f3f4f6;
  padding-left: 0.5rem;
}

.footer-link-icon {
  width: 16px;
  text-align: center;
}

/* Technologies List */
.footer-tech {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-tech li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #9ca3af;
  font-size: 0.95rem;
}

.tech-icon {
  color: #6b7280;
  font-size: 0.75rem;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.contact-link,
.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #f3f4f6;
}

.contact-link svg,
.contact-item svg {
  width: 16px;
  text-align: center;
  color: #6b7280;
}

/* Bottom Bar */
.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
}

.copyright p {
  margin: 0.25rem 0;
}

.built-with {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.tech-icon-inline {
  font-size: 1rem;
}

.tech-icon-inline.vue {
  color: #42b883;
}

.tech-icon-inline.cloudflare {
  color: #f38020;
}

.footer-extra {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.secret-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.secret-link:hover {
  color: #f3f4f6;
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(107, 114, 128, 0.5);
  transform: scale(1.05);
}

/* Responsive Design */

/* Tablet - 2 columns */
@media (min-width: 640px) {
  .footer-container {
    padding: 4rem 2rem 2rem;
  }
  
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
  
  .footer-brand {
    grid-column: 1 / -1;
  }
}

/* Desktop - 4 columns */
@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 4rem;
  }
  
  .footer-brand {
    grid-column: 1;
  }
  
  .footer-bottom-content {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
  
  .built-with {
    justify-content: flex-start;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .footer-container {
    padding: 5rem 3rem 2rem;
  }
}
</style>
