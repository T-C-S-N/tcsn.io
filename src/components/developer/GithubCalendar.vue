<template>
  <div class="flex flex-col gap-4">
    <!-- Error state -->
    <div v-if="error" class="text-sm text-red-400 p-3 rounded bg-red-900/20">
      {{ error }}
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-if="weeks.length > 0"
        :key="animationKey"
        class="weeks-container flex gap-1 overflow-x-auto p-2"
      >
        <div
          v-for="(week, weekIndex) in weeks"
          :key="weekIndex"
          class="week-column flex flex-col gap-1"
        >
          <div
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            :class="[
              getContributionLevel(day.count),
              isAnimatingDay(weekIndex, dayIndex) ? 'cursor-glow' : ''
            ]"
            class="contribution-day w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-white/50"
            :title="`${day.count} contributions on ${day.date}`"
            @click="showDayDetails(day)"
          />
        </div>
      </div>

      <!-- Placeholder calendar when no data -->
      <div
        v-else
        :key="'placeholder'"
        class="weeks-container flex gap-1 overflow-x-auto p-2"
      >
        <div
          v-for="weekIndex in 53"
          :key="`placeholder-week-${weekIndex}`"
          class="week-column flex flex-col gap-1"
        >
          <div
            v-for="dayIndex in 7"
            :key="`placeholder-day-${dayIndex}`"
            class="contribution-day w-3 h-3 rounded-sm bg-gray-800/10 animate-pulse transition-all"
          />
        </div>
      </div>

      <!-- Year navigation -->
      <div
        v-if="isYearSelector"
        ref="yearsScrollContainer"
        class="flex flex-row overflow-auto w-full justify-end"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAboutStore } from '@/stores/about'

const { t } = useI18n()
const aboutStore = useAboutStore()

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  isYearSelector: {
    type: Boolean,
    default: true
  }
})

// State
const weeks = ref([])
const totalContributions = ref(0)
const error = ref(null)
const selectedYear = ref(props.year)
const availableYears = ref([])
const yearsScrollContainer = ref(null)
const animationKey = ref(0)
const currentAnimatingDay = ref(null)

// expose availableYears for template access
defineExpose({
  availableYears,
  totalContributions
})

const emit = defineEmits(['year-changed'])

// Watch for changes to the year prop
watch(
  () => props.year,
  (newYear) => {
    selectedYear.value = newYear
    animationKey.value++
    fetchGitHubContributions()
  }
)

// Fetch GitHub contributions for selected year
const fetchGitHubContributions = async () => {
  try {
    error.value = null
    await aboutStore.fetchGitHubContributions(selectedYear.value)

    const contributionData = aboutStore.github.contributions[selectedYear.value]
    if (contributionData) {
      totalContributions.value = contributionData.totalContributions

      // Don't clear previous data - keep it visible for overlay effect
      // Only initialize empty structure if weeks is empty
      if (weeks.value.length === 0) {
        weeks.value = contributionData.weeks.map((week) =>
          week.map(() => ({ date: '', count: 0 }))
        )
      }

      // Animate filling in the days
      animateFillCalendar(contributionData.weeks)
    }
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err)
    error.value = t('github.error.fetchFailed')
    generateSampleData()
  }
}

// Animate the calendar filling in day by day
const animateFillCalendar = (newWeeks) => {
  let dayIndex = 0
  const totalDays = newWeeks.flat().length
  const animationDuration = 3000 // milliseconds
  const startTime = performance.now()

  const animateUpdate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    const currentDayIndex = Math.floor(progress * totalDays)

    if (currentDayIndex < totalDays && currentDayIndex > dayIndex) {
      for (let i = dayIndex; i <= currentDayIndex && i < totalDays; i++) {
        const weekIdx = Math.floor(i / 7)
        const dayIdx = i % 7

        // Track which day is currently animating
        currentAnimatingDay.value = { weekIdx, dayIdx }

        if (newWeeks[weekIdx] && newWeeks[weekIdx][dayIdx]) {
          // Create new array instances to trigger reactivity
          const newWeeksArray = weeks.value.map((week, wIdx) => {
            if (wIdx === weekIdx) {
              return week.map((day, dIdx) => {
                if (dIdx === dayIdx) {
                  // Replace with new data
                  return newWeeks[weekIdx][dayIdx]
                }
                return day
              })
            }
            return week
          })
          weeks.value = newWeeksArray
        }
      }
      dayIndex = currentDayIndex
    }

    if (progress < 1) {
      requestAnimationFrame(animateUpdate)
    } else {
      // Animation complete
      currentAnimatingDay.value = null
      weeks.value = newWeeks.map((week) =>
        week.map((day) => ({
          date: day.date,
          count: day.count
        }))
      )
    }
  }

  requestAnimationFrame(animateUpdate)
}

// Fetch available years
const fetchAvailableYears = async () => {
  try {
    await aboutStore.fetchGithubAvailableYears()
    availableYears.value = aboutStore.github.availableYears
  } catch (err) {
    console.error('Error fetching available years:', err)
    // Fallback to current year and 4 years back
    const currentYr = new Date().getFullYear()
    availableYears.value = [
      currentYr - 4,
      currentYr - 3,
      currentYr - 2,
      currentYr - 1,
      currentYr
    ]
  }
}

// ...existing code...

// Fallback: Generate sample data if API fails
const generateSampleData = () => {
  const startDate = new Date(`${selectedYear.value}-01-01`)
  const endDate = new Date(`${selectedYear.value}-12-31`)

  const weekData = []
  let currentWeek = []

  // Adjust start date to be the Sunday of the week containing Jan 1
  const adjustedStartDate = new Date(startDate)
  adjustedStartDate.setDate(adjustedStartDate.getDate() - adjustedStartDate.getDay())

  // Calculate the number of days to iterate (52 weeks + some padding)
  const daysToGenerate =
    Math.ceil((endDate - adjustedStartDate) / (1000 * 60 * 60 * 24)) + 7

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(adjustedStartDate)
    date.setDate(date.getDate() + i)

    const dayData = {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 15),
      day: date.getDay()
    }

    currentWeek.push(dayData)

    if (currentWeek.length === 7) {
      weekData.push([...currentWeek])
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weekData.push(currentWeek)
  }

  weeks.value = weekData
  totalContributions.value = weekData.flat().reduce((sum, day) => sum + day.count, 0)
}

const getContributionLevel = (count) => {
  if (count === 0) return 'bg-secondary-100/30'
  if (count <= 3) return 'bg-secondary-500'
  if (count <= 6) return 'bg-secondary-700'
  if (count <= 9) return 'bg-secondary-900'
  return 'bg-secondary-100'
}

const isAnimatingDay = (weekIdx, dayIdx) => {
  return (
    currentAnimatingDay.value &&
    currentAnimatingDay.value.weekIdx === weekIdx &&
    currentAnimatingDay.value.dayIdx === dayIdx
  )
}

const showDayDetails = (day) => {
  console.log(`${day.count} contributions on ${day.date}`)
}

// Scroll years container to the right (latest year)
const scrollYearsToEnd = () => {
  if (yearsScrollContainer.value) {
    setTimeout(() => {
      yearsScrollContainer.value.scrollLeft = yearsScrollContainer.value.scrollWidth
    }, 0)
  }
}

const selectYear = (year) => {
  selectedYear.value = year
  animationKey.value++
  fetchGitHubContributions()
  emit('year-changed', year)
}

onMounted(() => {
  fetchAvailableYears()
  fetchGitHubContributions()
  scrollYearsToEnd()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes dayUpdate {
  0% {
    box-shadow: 0 0 0 0 rgba(95, 176, 207, 0.7);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(95, 176, 207, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(95, 176, 207, 0);
  }
}

@keyframes cursorGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(95, 176, 207, 1), inset 0 0 0 0 rgba(95, 176, 207, 0.6);
  }
  25% {
    box-shadow: 0 0 6px 1px rgba(95, 176, 207, 0.8),
      inset 0 0 6px 0px rgba(95, 176, 207, 0.5);
  }
  50% {
    box-shadow: 0 0 10px 3px rgba(95, 176, 207, 0.6),
      inset 0 0 4px 0px rgba(95, 176, 207, 0.3);
  }
  75% {
    box-shadow: 0 0 8px 2px rgba(95, 176, 207, 0.4),
      inset 0 0 2px 0px rgba(95, 176, 207, 0.2);
  }
  100% {
    box-shadow: 0 0 4px 1px rgba(95, 176, 207, 0.2),
      inset 0 0 0px 0px rgba(95, 176, 207, 0);
  }
}

.cursor-glow {
  animation: cursorGlow 0.8s ease-out forwards !important;
}

.animate-fadeIn {
  animation: fadeIn 0.1s ease-in-out forwards;
  opacity: 0;
}

.animate-dayUpdate {
  animation: dayUpdate 0.1s ease-out;
}

/* Smooth transition between placeholder and data calendar */
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: opacity 0.4s ease;
}

.calendar-fade-enter-from,
.calendar-fade-leave-to {
  opacity: 0;
}

.calendar-fade-enter-to,
.calendar-fade-leave-from {
  opacity: 1;
}
</style>
