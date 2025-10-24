<template>
  <section
    class="flex flex-col justify-start lg:items-center gap-20 w-full min-h-screen pt-20 text-primary p-4"
  >
    <div
      class="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 w-fit lg:w-[1000px] border-b border-primary/20 p-4 pb-20"
    >
      <div class="flex justify-center items-center w-full lg:w-[200px] h-[200px] ">
        <img
          :src="profileImg"
          alt=""
          loading="lazy"
          class="flex-1 w-full h-full rounded-lg bg-primary/20 object-cover"
        >
      </div>

      <p class="text-md font-mono w-full">
        {{ displayedText }}
      </p>
    </div>

    <div class="flex justify-center w-full">
      <DeveloperStats />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import profileImg from '@/assets/img/1673632887272-halftone-filter-2-sm.webp'

const { t } = useI18n()
const displayedText = ref('')

onMounted(() => {
  const fullText = t('about.text')
  const animationDuration = 3000 // milliseconds
  const startTime = performance.now()

  const animateText = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    const charCount = Math.floor(progress * fullText.length)
    
    displayedText.value = fullText.substring(0, charCount)

    if (progress < 1) {
      requestAnimationFrame(animateText)
    }
  }

  requestAnimationFrame(animateText)
})
</script>
