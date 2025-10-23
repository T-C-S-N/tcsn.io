<template>
  <div
    class="relative group"
    :class="{ 'flex flex-col': vertical }"
  >
    <!-- Desktop Dropdown Button -->
    <button
      class="hidden md:flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 border border-primary/20 rounded-md transition-all cursor-pointer"
      :title="`Switch language: ${currentLanguage.toUpperCase()}`"
    >
      <span class="text-md">{{ currentLanguageFlagEmoji }}</span>
      <span class="text-sm font-mono font-bold uppercase">{{ currentLanguage }}</span>
      <span class="text-xs">▼</span>
    </button>

    <!-- Desktop Dropdown Menu -->
    <div
      class="absolute top-full left-0 mt-1 flex flex-col bg-background/95 border border-primary/30 rounded-md shadow-lg backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px] pointer-events-none group-hover:pointer-events-auto"
    >
      <a
        v-for="lang in availableLanguages"
        :key="lang.code"
        class="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 border-b border-primary/10 last:border-b-0 transition-all cursor-pointer"
        :class="currentLanguage === lang.code ? 'bg-primary/20' : ''"
        :title="lang.name"
        @click="switchLanguage(lang.code)"
      >
        <span class="text-md">{{ lang.flag }}</span>
        <span class="text-sm font-semibold capitalize">{{ lang.name }}</span>
      </a>
    </div>

    <!-- Mobile Menu (original behavior) -->
    <div
      class="md:hidden flex-col items-start gap-1 group-hover:flex transition-all w-fit hidden"
    >
      <a
        v-for="lang in availableLanguages"
        :key="lang.code"
        class="flex items-center gap-2 px-3 py-2 transition-all cursor-pointer text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-md w-full"
        :class="currentLanguage === lang.code ? 'bg-primary/10 border-primary/10' : ''"
        :title="lang.name"
        @click="switchLanguage(lang.code)"
      >
        <span class="text-md">{{ lang.flag }}</span>
        <span class="text-sm font-semibold capitalize">{{ lang.name }}</span>
      </a>
    </div>

    <!-- Mobile Display Button -->
    <div class="md:hidden text-primary text-sm font-mono group-hover:hidden px-2">
      <span class="">{{ currentLanguageFlagEmoji }}</span>
      <span class="font-bold capitalize">
        {{ currentLanguage }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

// Get emoji flag for current language
const currentLanguageFlagEmoji = computed(() => {
  const lang = availableLanguages.value.find(l => l.code === currentLanguage.value)
  return lang?.flag || '🌐'
})

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

<style scoped>
/* Desktop dropdown menu - hide on mobile */
@media (max-width: 767px) {
  .absolute {
    display: none !important;
  }
}

/* Mobile menu styling */
.group:hover > .md\:hidden {
  display: flex;
}

.md\:hidden {
  display: flex;
}

/* Ensure mobile menu shows properly on group hover */
@media (max-width: 767px) {
  .group > .md\:hidden.hidden {
    display: none;
  }
  
  .group:hover > .md\:hidden.hidden {
    display: flex;
  }
}
</style>
