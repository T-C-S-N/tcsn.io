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
                ? 'bg-background border-b-background z-10 text-primary'
                : 'bg-primary/5 hover:bg-primary/5 text-primary/50 hover:text-primary blur-[.5px] hover:blur-0'
            ]"
            @click="tab = tabItem"
          >
            {{ tabItem.name }}
          </div>
        </div>

        <!-- Tools Tab Content -->
        <div v-if="tab.value === 'tools'" class="flex flex-col gap-10 w-full">
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
                        <li v-for="(feature, j) in item[locale].features" :key="j">
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

                    <div v-if="item?.year" class="flex flex-col gap-4">
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
        <div v-if="tab.value === 'projects'" class="flex flex-col gap-10 w-full">
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
                        <li v-for="(feature, j) in item[locale].features" :key="j">
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

                    <div v-if="item?.year" class="flex flex-col gap-4">
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
      description: 'A link shortening web service with custom aliases and analytics.',
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
        'Un service web de raccourcissement de liens avec des alias personnalisés et des analyses.',
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
        'A booking platform for businesses and professionals to manage appointments and client interactions.',
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
        'Une plateforme de réservation pour les entreprises et les professionnels afin de gérer les rendez-vous et les interactions avec les clients.',
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
      description: 'Lotto analyser',
      features: [
        'Statistical Analysis',
        'Number Frequency Tracking',
        'Prediction',
        'Historical Data Visualization'
      ],
      pricePlans: []
    },
    fr: {
      description: 'Analyseur de loterie',
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
      description: 'My personal portfolio website showcasing my projects and skills.',
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
      description: 'Mon site portfolio personnel présentant mes projets et compétences.',
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
      description: 'Landing page for Velofcourse, a bicycle store.',
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
      description: "Page d'accueil pour Velofcourse, un magasin de vélos.",
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
