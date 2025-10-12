<template>
  <div class="flex items-center gap-1 group" :class="{ 'flex-col': vertical }">
    <div
      class="hidden flex-row items-center gap-2 justify-end group-hover:flex transition-all w-fit"
    >
      <a
        v-for="lang in availableLanguages"
        :key="lang.code"
        class="flex items-center px-2 py-1 transition-all cursor-pointer text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-md"
        :class="`${
          currentLanguage === lang.code
            ? 'bg-primary/10 border-primary/10'
            : 'hover:bg-primary/10 hover:border-primary/20'
        } ${vertical ? 'w-full justify-start' : ''}`"
        :title="lang.name"
        @click="switchLanguage(lang.code)"
      >
        <span class="text-md">{{ lang.flag }}</span>
        <span v-if="showLabels" class="text-md font-semibold capitalize">
          {{ lang.name }}
        </span>
      </a>
    </div>

    <div class="text-primary text-sm font-mono group-hover:hidden px-2">
      <span class="">{{ currentLanguage.flag }}</span>
      <span class="font-bold capitalize">
        {{ currentLanguage }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAvailableLanguages, changeLanguage, getCurrentLanguage } from '@/i18n.js'

defineProps({
  showLabels: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: Boolean,
    default: false
  }
})

const currentLanguage = ref('en')
const availableLanguages = ref([])

const switchLanguage = (langCode) => {
  if (changeLanguage(langCode)) {
    currentLanguage.value = langCode

    // Emit event for parent components
    const event = new CustomEvent('languageChanged', {
      detail: { language: langCode }
    })
    window.dispatchEvent(event)
  }
}

onMounted(() => {
  availableLanguages.value = getAvailableLanguages()
  currentLanguage.value = getCurrentLanguage()
})
</script>
