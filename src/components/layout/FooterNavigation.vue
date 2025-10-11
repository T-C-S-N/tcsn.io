<template>
  <!-- Arow navigation -->
  <footer
    class="fixed bottom-0 left-0 flex flex-col-reverse lg:flex-row items-center justify-between gap-2 text-sm text-primary w-full px-4 py-2 z-[30]"
  >
    <div class="text-center text-xs px-4 py-2 backdrop-blur-[5px] rounded-md">
      {{ currentYear }} tcsn
    </div>

    <div
      class="flex flex-row flex-wrap justify-center items-center gap-4 text-primary backdrop-blur-[5px] rounded-md"
    >
      <a
        v-for="(media, index) in medias"
        :key="index"
        :href="media.url"
        target="_blank"
        class="flex flex-col lg:flex-row justify-center items-center gap-2 transition px-4 py-2 opacity-75 hover:opacity-100"
      >
        <fa :icon="media.icon" />
        <div class="text-xs">{{ media.name }}</div>
      </a>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
const medias = ref([
  {
    name: 'LinkedIn',
    url: 'https://mlnk.is/ZwRlTk',
    icon: ['fab', 'linkedin']
  },
  {
    name: 'GitHub',
    url: 'https://mlnk.is/mOQUmq',
    icon: ['fab', 'github']
  },
  {
    name: 'CodePen',
    url: 'https://mlnk.is/ZUtEWK',
    icon: ['fab', 'codepen']
  },
  {
    name: 'Behance',
    url: 'https://mlnk.is/iojJfi',
    icon: ['fab', 'behance']
  },
  {
    name: 'Kaggle',
    url: 'https://mlnk.is/UVyD0t',
    icon: ['fab', 'kaggle']
  }
])
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
