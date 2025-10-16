<template>
  <div
    class="flex justify-center w-full min-h-screen pt-20 lg:pt-40 text-primary p-4 font-mono"
  >
    <div class="flex flex-col justify-start gap-10 items-start gap-4 w-full lg:w-1/2">
      <p class="text-md text-primary">
        This list showcases some of the projects I've worked on. Each project includes a
        brief description and a link to learn more.
      </p>

      <!-- Tab Navigation -->
      <div class="relative flex flex-row items-end gap-1 w-full">
        <div class="absolute -bottom w-full border-b border-primary/20" />

        <!-- Tools Tab -->
        <div
          v-for="(t, i) in tabs"
          :key="i"
          :class="[
            'relative flex items-center text-lg font-bold px-6 py-3 border border-b-0 border-primary/20 rounded-tl-lg rounded-tr-lg transition-all cursor-pointer select-none',
            tab.value === t.value
              ? 'bg-background border-b-background z-10 text-primary'
              : 'bg-primary/5 hover:bg-primary/5 text-primary/50 hover:text-primary blur-[.5px] hover:blur-0'
          ]"
          @click="tab = t"
        >
          {{ t.name }}
        </div>
      </div>

      <!-- Tools Tab Content -->
      <div v-if="tab.value === 'tools'" class="flex flex-col gap-10 w-full">
        <div class="flex flex-row flex-wrap gap-8 w-full">
          <div
            v-for="(item, i) in tools"
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
                  <div class="text-sm">{{ item.status }}</div>
                </div>
                <p class="text-sm">
                  {{ item.description }}
                </p>
              </div>

              <div class="flex flex-row gap-2">
                <a
                  :class="`text-primary hover:underline border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8 ${
                    item.isExpanded ? 'w-full' : 'w-full'
                  }`"
                  @click="item.isExpanded = !item.isExpanded"
                >
                  <div v-if="item.isExpanded" class="">Close</div>
                  <div v-else class="">Learn more</div></a
                >
                <a
                  v-if="!item.isExpanded && item.devUrl"
                  :href="item.devUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                >
                  <div class="">Visit Dev</div>
                </a>
                <a
                  v-if="!item.isExpanded && item.url"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                >
                  <div class="">Visit</div>
                </a>
              </div>

              <div
                v-if="item.isExpanded"
                class="w-full border border-primary/20 p-2 rounded-md"
              >
                <div class="flex flex-col gap-8">
                  <div v-if="item?.features?.length > 0" class="flex flex-col gap-4">
                    <p><strong>Features:</strong></p>
                    <ul class="list-disc list-inside">
                      <li v-for="(feature, j) in item.features" :key="j">
                        {{ feature }}
                      </li>
                    </ul>
                  </div>

                  <div class="flex flex-col gap-4">
                    <p><strong>Technologies Used:</strong></p>
                    <ul class="list-disc list-inside">
                      <li v-if="item?.technologies?.frontend?.length > 0">
                        <strong>Frontend:</strong>
                        {{ item.technologies.frontend.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.backend?.length > 0">
                        <strong>Backend:</strong>
                        {{ item.technologies.backend.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.devops?.length > 0">
                        <strong>DevOps:</strong> {{ item.technologies.devops.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.architectures?.length > 0">
                        <strong>Architectures:</strong>
                        {{ item.technologies.architectures.join(', ') }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="item?.year" class="flex flex-col gap-4">
                    <p><strong>Year:</strong> {{ item.year }}</p>
                  </div>

                  <div v-if="item?.pricePlan" class="flex flex-col gap-4">
                    <p><strong>Price Plan:</strong> {{ item.pricePlan }}</p>
                  </div>

                  <div class="flex flex-row gap-2">
                    <a
                      v-if="item.devUrl"
                      :href="item.devUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                    >
                      <div class="">Visit Dev</div>
                    </a>
                    <a
                      v-if="item.url"
                      :href="item.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                    >
                      <div class="">Visit</div>
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
            v-for="(item, i) in projects"
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
                  <div class="text-sm">{{ item.status }}</div>
                </div>

                <p class="text-sm">
                  {{ item.description }}
                </p>
              </div>

              <div class="flex flex-row gap-2">
                <a
                  :class="`text-primary hover:underline border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8 ${
                    item.isExpanded ? 'w-full' : 'w-full'
                  }`"
                  @click="item.isExpanded = !item.isExpanded"
                >
                  <div v-if="item.isExpanded" class="">Close</div>
                  <div v-else class="">Learn more</div></a
                >
                <a
                  v-if="!item.isExpanded && item.devUrl"
                  :href="item.devUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                >
                  <div class="">Visit Dev</div>
                </a>
                <a
                  v-if="!item.isExpanded && item.url"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline w-fit border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 transition-all whitespace-nowrap px-8"
                >
                  <div class="">Visit</div>
                </a>
              </div>

              <div
                v-if="item.isExpanded"
                class="w-full border border-primary/20 p-2 rounded-md"
              >
                <div class="flex flex-col gap-8">
                  <div v-if="item?.features?.length > 0" class="flex flex-col gap-4">
                    <p><strong>Features:</strong></p>
                    <ul class="list-disc list-inside">
                      <li v-for="(feature, j) in item.features" :key="j">
                        {{ feature }}
                      </li>
                    </ul>
                  </div>

                  <div class="flex flex-col gap-4">
                    <p><strong>Technologies Used:</strong></p>
                    <ul class="list-disc list-inside">
                      <li v-if="item?.technologies?.frontend?.length > 0">
                        <strong>Frontend:</strong>
                        {{ item.technologies.frontend.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.backend?.length > 0">
                        <strong>Backend:</strong>
                        {{ item.technologies.backend.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.devops?.length > 0">
                        <strong>DevOps:</strong> {{ item.technologies.devops.join(', ') }}
                      </li>
                      <li v-if="item?.technologies?.architectures?.length > 0">
                        <strong>Architectures:</strong>
                        {{ item.technologies.architectures.join(', ') }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="item?.year" class="flex flex-col gap-4">
                    <p><strong>Year:</strong> {{ item.year }}</p>
                  </div>

                  <div v-if="item.pricePlan" class="flex flex-col gap-4">
                    <p><strong>Price Plan:</strong> {{ item.pricePlan }}</p>
                  </div>

                  <div class="flex flex-row gap-2">
                    <a
                      v-if="item.devUrl"
                      :href="item.devUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                    >
                      <div class="">Visit Dev</div>
                    </a>

                    <a
                      v-if="item.url"
                      :href="item.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline w-full border border-primary/20 rounded-md text-center py-1 cursor-pointer hover:bg-primary/10 mt-4 transition-all"
                    >
                      <div class="">Visit</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--<div class="flex flex-row flex-wrap gap-4">
          <div
            v-for="(item, i) in projects"
            :key="i"
            class="flex flex-col justify-start items-start gap-4 w-full lg:w-1/2"
          >
            <h3 class="text-lg font-bold">
              {{ item.name }}
            </h3>
            <p class="text-sm">
              {{ item.description }}
            </p>
            <a :href="item.url" class="text-primary hover:underline">Learn more</a>
          </div>
        </div>-->

      <!-- Project List -->
      <!--<ProjectList />-->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
//import ProjectList from '@/components/project/ProjectList.vue'

const status = ref({
  IN_PRODUCTION: 'In Production',
  IN_DEVELOPMENT: 'In Development',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled'
})

const tabs = [
  {
    name: 'Tools',
    value: 'tools'
  },
  {
    name: 'Projects',
    value: 'projects'
  }
]
const tab = ref(tabs[0])
const tools = ref([
  {
    name: 'mlnk.is',
    description: 'A link shortening web service with custom aliases and analytics.',
    features: ['Custom Aliases', 'Analytics', 'Multilingual Support'],
    technologies: {
      frontend: ['Vue3 setup', 'Javascript', 'SCSS', 'TailwindCSS', 'i18n'],
      backend: ['Node.js', 'Express', 'D1'],
      devops: ['Cloudflare Workers', 'Cloudflare Pages'],
      architectures: ['Serverless', 'REST API', 'Single Page Application']
    },
    year: 2025,
    pricePlan: 'Free',
    faIcon: '["fas", "link"]',
    url: 'https://mlnk.is/tBs6KJ',
    status: status.value.IN_PRODUCTION,
    isExpanded: false
  },
  {
    name: 'Lotto',
    description: 'Lotto analyser.',
    faIcon: '["fas", "project-diagram"]',
    url: null,
    devUrl: 'https://mlnk.is/ygPTb6',
    status: status.value.IN_DEVELOPMENT,
    isExpanded: false
  }
])

const projects = ref([
  {
    name: 'Velofcourse',
    description: 'Landing page for Velofcourse, a bicycle store.',
    features: ['Responsive Design', 'Product Showcase', 'Contact Form'],
    technologies: {
      frontend: ['Vue3', 'HTML5', 'CSS3', 'TailwindCSS'],
      backend: ['Static Site'],
      devops: ['Cloudflare Pages'],
      architectures: ['Single Page Application', 'Static Site']
    },
    year: 2024,
    pricePlan: 'Custom',
    faIcon: '["fas", "project-diagram"]',
    url: 'https://mlnk.is/N9HFEx',
    devUrl: 'https://mlnk.is/fjAtMe',
    status: status.value.IN_PRODUCTION,
    isExpanded: false
  }
])
</script>
