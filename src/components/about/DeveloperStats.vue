<template>
  <section
    class="w-full lg:w-[1000px] h-full flex flex-col justify-start items-center gap-4"
  >
    <div class="flex flex-col justify-start gap-2 w-full">
      <div class="flex flex-col gap-1 text-primary font-mono">
        <h3 class="text-lg font-semibold">
          {{ $t('github.calendar.title') }}
        </h3>
        <p class="text-sm">
          {{ totalContributions }} {{ $t('github.calendar.contributions') }}
          {{ selectedYear }}
        </p>
      </div>
    </div>

    <div class="flex flex-col justify-start items-center gap-8 w-full overflow-auto">
      <GithubChart
        ref="githubChart"
        :username="githubUsername"
        :year="selectedYear"
        :isYearSelector="false"
        @year-changed="selectedYear = $event"
      />
      <GithubCalendar
        ref="githubCalendar"
        :username="githubUsername"
        :year="selectedYear"
        :isYearSelector="true"
        @year-changed="selectedYear = $event"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, useTemplateRef, watch } from 'vue'

const githubChart = useTemplateRef('githubChart')
const githubCalendar = useTemplateRef('githubCalendar')

// Get GitHub username from environment variables
const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'hemadnap'

const selectedYear = ref(new Date().getFullYear())
const totalContributions = ref(0)

// Watch for year changes and update total contributions from the calendar component
watch(
  () => githubCalendar.value,
  (calendar) => {
    if (calendar) {
      watch(
        () => calendar.totalContributions,
        (newTotal) => {
          totalContributions.value = newTotal
        },
        { immediate: true }
      )
    }
  }
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
