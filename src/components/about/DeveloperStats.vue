<template>
  <section
    class="w-full h-full flex flex-col justify-start items-center gap-4"
  >
    <div class="flex flex-col justify-start gap-2 w-full">
      <div class="flex flex-col gap-1 text-text-900 font-mono">
        <h3 class="text-lg font-semibold">
          {{ $t('github.calendar.title') }}
        </h3>
        <p class="text-sm">
          {{ totalContributions }} {{ $t('github.calendar.contributions') }}
          {{ selectedYear }}
        </p>
      </div>
    </div>

 <!-- Year navigation -->
      <div
        ref="yearsScrollContainer"
        class="flex flex-row overflow-auto w-full max-w-full justify-end px-4"
      >
        <div v-for="(y, i) in availableYears" :key="i" class="flex-shrink-0 p-2">
          <a
            :class="`flex items-center justify-center h-full text-xs cursor-pointer border-b p-2 transition-all ${
              selectedYear === y
                ? 'text-text-900 border-text-900'
                : 'text-text/70 border-transparent hover:text-text'
            }`"
            @click="selectYear(y)"
          >
            {{ y }}
          </a>
        </div>
      </div>

    <div class="flex flex-col justify-start items-center gap-8 w-full">
      <GithubChart
        ref="githubChart"
        :username="githubUsername"
        :year="selectedYear"
        @year-changed="selectedYear = $event"
      />
      <GithubCalendar
        ref="githubCalendar"
        :username="githubUsername"
        :year="selectedYear"
        @year-changed="selectedYear = $event"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, useTemplateRef, watch } from 'vue'
import GithubChart from '@/components/developer/GithubChart.vue'
import GithubCalendar from '@/components/developer/GithubCalendar.vue'

const githubChart = useTemplateRef('githubChart')
const githubCalendar = useTemplateRef('githubCalendar')

// Get GitHub username from environment variables
const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'hemadnap'

const selectedYear = ref(new Date().getFullYear())
const totalContributions = ref(0)
const availableYears = ref([])

const selectYear = (year) => {
  selectedYear.value = year
  githubCalendar.value.selectYear(year)
}

// Watch for calendar component mount and listen to its totalContributions and availableYears
watch(
  () => githubCalendar.value,
  (calendar) => {
    if (calendar) {
      // Watch availableYears from the calendar component
      watch(
        () => calendar.availableYears,
        (newYears) => {
          availableYears.value = newYears
        },
        { immediate: true }
      )

      // Watch totalContributions from the calendar component
      watch(
        () => calendar.totalContributions,
        (newTotal) => {
          totalContributions.value = newTotal
        },
        { immediate: true }
      )
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.github-calendar-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.github-iframe {
  border-radius: 8px;
  background: white;
}

.github-calendar-img {
  border-radius: 8px;
  background: transparent;
  filter: invert(1) hue-rotate(180deg);
}

/* Dark theme adjustments */
.github-calendar-img:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

@media (max-width: 768px) {
  .github-calendar-container {
    padding: 0 10px;
  }

  .github-iframe {
    height: 150px;
  }
}
</style>
