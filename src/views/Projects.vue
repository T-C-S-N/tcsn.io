<template>
  <div
    class="flex justify-center w-full min-h-screen pt-20 lg:pt-40 text-primary p-4 font-mono"
  >
    <div class="flex flex-col justify-start gap-20 items-start w-full lg:w-1/2">
      <p class="text-md text-primary">
        {{ t('projects.subtitle') }}
      </p>

      <div class="flex flex-col gap-8">
        <!-- Tab Navigation -->
        <div class="relative flex flex-row items-end gap-1 w-full">
          <div class="absolute -bottom w-full border-b border-primary/20" />

          <!-- Tools Tab -->
          <div
            v-for="(tabItem, i) in tabs"
            :key="i"
            :class="[
              'relative flex items-center text-lg font-bold px-6 py-3 border border-b-0 border-primary/20 rounded-tl-lg rounded-tr-lg transition-all cursor-pointer select-none',
              tab.value === tabItem.value
                ? 'bg-secondary-100/50 border-b-background z-10 text-primary'
                : 'bg-primary/5 hover:bg-primary/5 text-primary/50 hover:text-primary'
            ]"
            @click="tab = tabItem"
          >
            {{ tabItem.name }}
          </div>
        </div>

        <!-- Tools Tab Content -->
        <div
          v-if="tab.value === 'tools'"
          class="flex flex-col gap-10 w-full"
        >
          <div class="flex flex-row flex-wrap gap-8 w-full">
            <div
              v-for="(item, i) in tools.filter((t) => t.isVisible !== false)"
              :key="i"
              :class="`flex flex-col justify-start items-start gap-4 w-full rounded transition-all border border-primary/20 ${
                item.isExpanded ? 'bg-primary/5' : 'bg-transparent'
              }`"
            >
              <div class="flex flex-col gap-4 p-2 w-full">
                <div class="flex flex-col gap-4 p-2">
                  <div class="flex flex-row justify-between items-center gap-4">
                    <h3 class="text-lg font-bold">
                      {{ item.name }}
                    </h3>
                    <div class="text-sm bg-primary/10 rounded-md px-2 py-1">
                      {{ $t(`projects.status.${item.status}`) }}
                    </div>
                  </div>
                  <p class="text-sm">
                    {{ item[locale].description }}
                  </p>
                </div>

                <div class="flex flex-row gap-2">
                  <a
                    :class="`text-primary hover:underline border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8 ${
                      item.isExpanded ? 'w-full' : 'w-full'
                    }`"
                    @click="item.isExpanded = !item.isExpanded"
                  >
                    <div v-if="item.isExpanded">{{ t('projects.close') }}</div>
                    <div v-else>{{ t('projects.learnMore') }}</div>
                  </a>
                  <a
                    v-if="!item.isExpanded && item.devUrl"
                    :href="item.devUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                  >
                    <div>{{ t('projects.visitDev') }}</div>
                  </a>
                  <a
                    v-if="!item.isExpanded && item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                  >
                    <div>{{ t('projects.visit') }}</div>
                  </a>
                </div>

                <div
                  v-if="item.isExpanded"
                  class="w-full border border-primary/20 p-2 rounded-md"
                >
                  <div class="flex flex-col gap-8">
                    <div
                      v-if="item[locale]?.features?.length > 0"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.features') }}:</strong>
                      </p>
                      <ul class="list-disc list-inside">
                        <li
                          v-for="(feature, j) in item[locale].features"
                          :key="j"
                        >
                          {{ feature }}
                        </li>
                      </ul>
                    </div>

                    <div class="flex flex-col gap-4">
                      <p>
                        <strong>{{ t('projects.technologiesUsed') }}:</strong>
                      </p>
                      <ul class="list-disc list-inside">
                        <li v-if="item?.technologies?.frontend?.length > 0">
                          <strong>{{ t('projects.frontend') }}:</strong>
                          {{ item.technologies.frontend.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.backend?.length > 0">
                          <strong>{{ t('projects.backend') }}:</strong>
                          {{ item.technologies.backend.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.devops?.length > 0">
                          <strong>{{ t('projects.devops') }}:</strong>
                          {{ item.technologies.devops.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.architectures?.length > 0">
                          <strong>{{ t('projects.architectures') }}:</strong>
                          {{ item.technologies.architectures.join(', ') }}
                        </li>
                      </ul>
                    </div>

                    <div
                      v-if="item?.year"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.year') }}:</strong> {{ item.year }}
                      </p>
                    </div>

                    <div
                      v-if="item[locale]?.pricePlans?.length"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.pricePlan') }}:</strong>
                        {{ item[locale].pricePlans.join(', ') }}
                      </p>
                    </div>

                    <div class="flex flex-row gap-2">
                      <a
                        v-if="item.devUrl"
                        :href="item.devUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                      >
                        <div>{{ t('projects.visitDev') }}</div>
                      </a>
                      <a
                        v-if="item.url"
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                      >
                        <div>{{ t('projects.visit') }}</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Tab Content -->
        <div
          v-if="tab.value === 'projects'"
          class="flex flex-col gap-10 w-full"
        >
          <div class="flex flex-row flex-wrap gap-8 w-full">
            <div
              v-for="(item, i) in projects.filter((p) => p.isVisible !== false)"
              :key="i"
              :class="`flex flex-col justify-start items-start gap-4 w-full rounded transition-all border border-primary/20 ${
                item.isExpanded ? 'bg-primary/5' : 'bg-transparent'
              }`"
            >
              <div class="flex flex-col gap-4 p-2 w-full">
                <div class="flex flex-col gap-4 p-2">
                  <div class="flex flex-row justify-between items-center gap-4">
                    <h3 class="text-lg font-bold">
                      {{ item.name }}
                    </h3>
                    <div class="text-sm bg-primary/10 rounded-md px-2 py-1">
                      {{ $t(`projects.status.${item.status}`) }}
                    </div>
                  </div>

                  <p class="text-sm">
                    {{ item[locale].description }}
                  </p>
                </div>

                <div class="flex flex-row gap-2">
                  <a
                    :class="`text-primary hover:underline border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8 ${
                      item.isExpanded ? 'w-full' : 'w-full'
                    }`"
                    @click="item.isExpanded = !item.isExpanded"
                  >
                    <div v-if="item.isExpanded">{{ t('projects.close') }}</div>
                    <div v-else>{{ t('projects.learnMore') }}</div>
                  </a>
                  <a
                    v-if="!item.isExpanded && item.devUrl"
                    :href="item.devUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                  >
                    <div>{{ t('projects.visitDev') }}</div>
                  </a>
                  <a
                    v-if="!item.isExpanded && item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                  >
                    <div>{{ t('projects.visit') }}</div>
                  </a>
                </div>

                <div
                  v-if="item.isExpanded"
                  class="w-full border border-primary/20 p-2 rounded-md"
                >
                  <div class="flex flex-col gap-8">
                    <div
                      v-if="item[locale]?.features?.length > 0"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.features') }}:</strong>
                      </p>
                      <ul class="list-disc list-inside">
                        <li
                          v-for="(feature, j) in item[locale].features"
                          :key="j"
                        >
                          {{ feature }}
                        </li>
                      </ul>
                    </div>

                    <div class="flex flex-col gap-4">
                      <p>
                        <strong>{{ t('projects.technologiesUsed') }}:</strong>
                      </p>
                      <ul class="list-disc list-inside">
                        <li v-if="item?.technologies?.frontend?.length > 0">
                          <strong>{{ t('projects.frontend') }}:</strong>
                          {{ item.technologies.frontend.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.backend?.length > 0">
                          <strong>{{ t('projects.backend') }}:</strong>
                          {{ item.technologies.backend.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.devops?.length > 0">
                          <strong>{{ t('projects.devops') }}:</strong>
                          {{ item.technologies.devops.join(', ') }}
                        </li>
                        <li v-if="item?.technologies?.architectures?.length > 0">
                          <strong>{{ t('projects.architectures') }}:</strong>
                          {{ item.technologies.architectures.join(', ') }}
                        </li>
                      </ul>
                    </div>

                    <div
                      v-if="item?.year"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.year') }}:</strong> {{ item.year }}
                      </p>
                    </div>

                    <div
                      v-if="item[locale].pricePlans?.length"
                      class="flex flex-col gap-4"
                    >
                      <p>
                        <strong>{{ t('projects.pricePlan') }}:</strong>
                        {{ item[locale].pricePlans.join(', ') }}
                      </p>
                    </div>

                    <div class="flex flex-row gap-2">
                      <a
                        v-if="item.devUrl"
                        :href="item.devUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                      >
                        <div>{{ t('projects.visitDev') }}</div>
                      </a>

                      <a
                        v-if="item.url"
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                      >
                        <div>{{ t('projects.visit') }}</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const status = ref({
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_DEVELOPMENT: 'IN_DEVELOPMENT',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED'
})

const tabs = [
  {
    name: t('projects.tabs.tools'),
    value: 'tools'
  },
  {
    name: t('projects.tabs.projects'),
    value: 'projects'
  }
]
const tab = ref(tabs[0])
const tools = ref([
  {
    name: 'mlnk.is',
    en: {
      description: 'A comprehensive link management platform featuring custom aliases, real-time analytics, AI-powered suggestions, QR code generation, and multi-project organization with tag-based categorization.',
      features: [
        'Responsive Design',
        'Custom Aliases',
        'Analytics (by Url, by tag)',
        'Multilingual Support',
        'AI-powered Suggestions',
        'Tag Management (Custom Tags)',
        'Project Management (Custom Projects)',
        'Infinite Scrolling',
        'Google Authentication',
        'QR Code Generation (SVG, PNG)',
        'Export Data (CSV, JSON, Excel)'
      ],
      year: 2025,
      pricePlans: ['Free']
    },
    fr: {
      description:
        'Une plateforme complète de gestion de liens avec des alias personnalisés, des analyses en temps réel, des suggestions propulsées par l\'IA, la génération de codes QR et l\'organisation multi-projets avec catégorisation par tags.',
      features: [
        'Design Réactif',
        'Alias Personnalisés',
        'Analyses (par URL, par tag)',
        'Support Multilingue',
        "Suggestions Propulsées par l'IA",
        'Gestion des Tags (Tags Personnalisés)',
        'Gestion de Projets (Projets Personnalisés)',
        'Défilement Infini',
        'Authentification Google',
        'Génération de QR Code (SVG, PNG)',
        'Exporter les Données (CSV, JSON, Excel)'
      ],
      year: 2025,
      pricePlans: ['Gratuit']
    },
    technologies: {
      frontend: ['Vue3 setup', 'Javascript', 'SCSS', 'TailwindCSS', 'i18n'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'REST API', 'Single Page Application']
    },
    faIcon: '["fas", "link"]',
    url: 'https://mlnk.is/tBs6KJ',
    status: status.value.IN_PRODUCTION,
    isExpanded: false,
    isVisible: true
  },
  {
    name: 'jikan.me',
    en: {
      description:
        'A comprehensive booking and appointment management platform with calendar integration, automated reminders, payment processing, staff scheduling, and customer review system for businesses and professionals.',
      features: [
        'User-friendly Interface',
        'Calendar Integration',
        'Automated Reminders',
        'Payment Processing',
        'Client Management',
        'Service Listings',
        'Staff Scheduling',
        'Customer Reviews',
        'Analytics and Reporting',
        'Business Profiles'
      ],
      pricePlans: ['Free', 'Premium']
    },
    fr: {
      description:
        'Une plateforme complète de réservation et de gestion de rendez-vous avec intégration de calendrier, rappels automatisés, traitement des paiements, planification du personnel et système d\'avis clients pour les entreprises et professionnels.',
      features: [
        'Interface Conviviale',
        'Intégration de Calendrier',
        'Rappels Automatisés',
        'Traitement des Paiements',
        'Gestion des Clients',
        'Liste des Services',
        'Planification du Personnel',
        'Avis Clients',
        'Analyses et Rapports',
        "Profils d'Entreprise"
      ],
      pricePlans: ['Gratuit', 'Premium']
    },
    technologies: {
      frontend: ['Vue3 setup', 'Javascript', 'SCSS', 'TailwindCSS', 'i18n'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'REST API', 'Single Page Application']
    },
    year: 2025,
    faIcon: '["fas", "calendar-check"]',
    url: null,
    status: status.value.IN_DEVELOPMENT,
    isExpanded: false,
    isVisible: false
  },
  {
    name: 'Lotto',
    en: {
      description: 'A comprehensive lottery analysis tool featuring statistical analysis, number frequency tracking, prediction algorithms, and historical data visualization for informed lottery number selection.',
      features: [
        'Statistical Analysis',
        'Number Frequency Tracking',
        'Prediction',
        'Historical Data Visualization'
      ],
      pricePlans: []
    },
    fr: {
      description: 'Un outil complet d\'analyse de loterie avec analyse statistique, suivi de la fréquence des numéros, algorithmes de prédiction et visualisation des données historiques pour une sélection éclairée des numéros de loterie.',
      features: [
        'Analyse Statistique',
        'Suivi de la Fréquence des Numéros',
        'Prédiction',
        'Visualisation des Données Historiques'
      ],
      pricePlans: []
    },
    technologies: {
      frontend: ['Vue3 setup', 'Javascript', 'SCSS', 'TailwindCSS'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'Single Page Application']
    },
    year: 2025,
    faIcon: '["fas", "project-diagram"]',
    url: null,
    devUrl: 'https://mlnk.is/ygPTb6',
    status: status.value.IN_DEVELOPMENT,
    isExpanded: false,
    isVisible: true
  }
])

const projects = ref([
  {
    name: 'tcsn.io',
    en: {
      description: 'A modern portfolio website featuring project showcase, visitor analytics, context-aware AI chatbot integration, multilingual support, and SEO optimization to present professional work and skills.',
      features: [
        'Responsive Design',
        'Project Showcase',
        'Contact',
        'Visitor Analytics',
        'AI Chatbot Integration with context awareness',
        'Multilingual Support',
        'SEO Optimization'
      ],
      pricePlans: []
    },
    fr: {
      description: 'Un site portfolio moderne avec vitrine de projets, analyses des visiteurs, intégration d\'un chatbot IA contextuel, support multilingue et optimisation SEO pour présenter le travail et les compétences professionnels.',
      features: [
        'Design Réactif',
        'Vitrine de Projets',
        'Contact',
        'Analyses des Visiteurs',
        "Intégration d'un Chatbot IA avec conscience contextuelle",
        'Support Multilingue',
        'Optimisation SEO'
      ],
      pricePlans: []
    },
    technologies: {
      frontend: ['Vue3 setup', 'Javascript', 'SCSS', 'TailwindCSS', 'i18n'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'Single Page Application']
    },
    year: 2024,
    faIcon: '["fas", "user"]',
    url: 'https://tcsn.io',
    devUrl: null,
    status: status.value.IN_PRODUCTION,
    isExpanded: false,
    isVisible: true
  },
  {
    name: 'Velofcourse',
    en: {
      description: 'A modern landing page for a bicycle store featuring interactive location mapping, live opening hours, service listings, trusted brand showcase, and social media integration to connect with customers.',
      features: [
        'Responsive Design',
        'Location Map',
        'Live Opening Hours',
        'Opening Timetable',
        'Trusted Brands List',
        'Social Media Links',
        'Services List'
      ],
      pricePlans: []
    },
    fr: {
      description: 'Une page d\'accueil moderne pour un magasin de vélos avec cartographie interactive, horaires d\'ouverture en direct, liste de services, vitrine de marques de confiance et intégration des réseaux sociaux pour connecter avec les clients.',
      features: [
        'Design Réactif',
        'Carte de Localisation',
        "Horaires d'Ouverture en Direct",
        "Tableau des Horaires d'Ouverture",
        'Liste des Marques de Confiance',
        'Liens vers les Réseaux Sociaux',
        'Liste des Services'
      ],
      pricePlans: []
    },
    technologies: {
      frontend: ['Vue3', 'HTML5', 'CSS3', 'TailwindCSS', 'i18n', 'Mapbox GL JS'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'Single Page Application']
    },
    year: 2023,
    faIcon: '["fas", "project-diagram"]',
    url: 'https://mlnk.is/N9HFEx',
    devUrl: 'https://mlnk.is/fjAtMe',
    status: status.value.IN_PRODUCTION,
    isExpanded: false,
    isVisible: true
  }
])
</script>
