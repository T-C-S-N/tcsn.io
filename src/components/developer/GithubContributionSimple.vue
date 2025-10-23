<template>
  <div class="github-contributions-simple border border-primary">
    <h3 class="text-xl font-semibold mb-4">
      GitHub Activity
    </h3>
    
    <!-- GitHub Stats Cards -->
    <div class="flex flex-wrap gap-4">
<div class="flex justify-center items-center p-2">
      <img 
        :src="githubStatsUrl"
        :alt="`${username}'s GitHub Stats`"
        class="w-full"
      >
</div>

<div class="flex justify-center items-center p-2">
      <img 
        :src="githubStreakUrl"
        :alt="`${username}'s GitHub Streak`"
        class="w-full"
      >
</div>

<div class="flex justify-center items-center p-2">
      <img 
        :src="topLanguagesUrl"
        :alt="`${username}'s Top Languages`"
        class="w-full"
      >
    </div>
    </div>
    
    <div class="contribution-graph mb-4">
      <img 
        :src="contributionGraphUrl"
        :alt="`${username}'s Contribution Graph`"
        class="w-full"
      >
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  username: {
    type: String,
    default: import.meta.env.VITE_GITHUB_USERNAME || 'hemadnap' // Use env variable or fallback
  },
  theme: {
    type: String,
    default: 'radical', // radical, dark, merko, gruvbox, tokyonight, onedark, cobalt, synthwave, highcontrast, dracula
    validator: (value) => [
      'default', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 
      'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'
    ].includes(value)
  },
  showPrivate: {
    type: Boolean,
    default: false
  }
})

// Computed URLs for different GitHub stat services
const githubStatsUrl = computed(() => {
  const params = new URLSearchParams({
    username: props.username,
    show_icons: 'true',
    theme: props.theme,
    include_all_commits: 'true',
    count_private: props.showPrivate ? 'true' : 'false'
  })
  return `https://github-readme-stats.vercel.app/api?${params}`
})

const githubStreakUrl = computed(() => {
  const params = new URLSearchParams({
    user: props.username,
    theme: props.theme
  })
  return `https://github-readme-streak-stats.herokuapp.com/?${params}`
})

const topLanguagesUrl = computed(() => {
  const params = new URLSearchParams({
    username: props.username,
    layout: 'compact',
    theme: props.theme,
    langs_count: '8'
  })
  return `https://github-readme-stats.vercel.app/api/top-langs/?${params}`
})

const contributionGraphUrl = computed(() => {
  const params = new URLSearchParams({
    username: props.username,
    theme: props.theme
  })
  return `https://github-readme-activity-graph.vercel.app/graph?${params}`
})
</script>