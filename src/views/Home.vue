<template>
  <section
    class="w-full h-screen"
    :style="`background: url(${Magnoliaverse}) no-repeat center center / cover; background-size: cover;`"
  >
    <BusinessCard />
  </section>


  <section
    class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="relative w-full lg:w-1/2 text-md font-mono text-white">
         <div
        class="flex flex-col flex-wrap justify-center items-center gap-8 text-primary backdrop-blur-[5px] rounded-md px-4"
      >
        <a
          v-for="(media, index) in medias"
          :key="index"
          :href="media.url"
          target="_blank"
          class="flex flex-col lg:flex-row justify-between items-center gap-2 transition px-4 opacity-75 hover:opacity-100 hover:bg-primary/10 border border-primary/30 hover:border-primary/20 rounded-md w-60 py-4"
        >
          <fa :icon="media.icon" class="w-1/2 text-left" />
          <div class="text-xs w-1/2 text-left">{{ media.name }}</div>
        </a>
      </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref } from 'vue'
import Magnoliaverse from '@/assets/img/Magnoliaverse-sm-horizontal.webp'

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
