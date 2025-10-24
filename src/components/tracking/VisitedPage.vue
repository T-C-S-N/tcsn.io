<template>
  <section
    ref="sectionRef"
    class="flex flex-row w-full h-fit overflow-auto no-scrollbar scroll-smooth"
  >
    <TransitionGroup name="slide-fade" tag="div" class="flex flex-row px-4">
      <div
        v-for="(p, i) in visitedPages"
        :key="i"
        class="flex flex-col justify-start items-start group pb-4 w-[150px]"
      >
        <!--<div
          class="bg-primary rounded-full w-6 h-0.5 group-first:hidden transition-all duration-300"
        />-->
        <div
          class="flex flex-col justify-center items-start px-4 py-2 whitespace-nowrap group-last:bg-primary/10 transition-all duration-300"
        >
          <div class="text-primary text-xs font-mono">
            {{ p.pathName }}
          </div>
          <div class="text-primary/60 text-xs">{{ p.duration }} seconds</div>
        </div>

        <div class="relative w-full h-full">
          <div class="absolute -bottom-2 left-10 h-3 w-0.5 bg-primary rounded-full"></div>
          <div class="absolute -bottom-2 -left-[110px] h-0.5 w-full bg-primary rounded-full"></div>
        </div>
      </div>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import { toRefs, watch, ref, nextTick } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'

const visitorStore = useVisitorStore()
const { visitedPages } = toRefs(visitorStore)
const sectionRef = ref(null)

// Scroll to the end when new pages are added
watch(
  () => visitedPages.value.length,
  async () => {
    await nextTick()
    if (sectionRef.value) {
      sectionRef.value.scrollLeft = sectionRef.value.scrollWidth
    }
  }
)
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

.slide-fade-move {
  transition: transform 0.5s ease;
}

/* Auto-scroll to the latest item */
section {
  scroll-behavior: smooth;
}
</style>
