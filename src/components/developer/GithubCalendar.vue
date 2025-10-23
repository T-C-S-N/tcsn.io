<template>
  <div class="flex flex-col gap-4">
    <!-- Error state -->
    <div v-if="error" class="text-sm text-red-400 p-3 rounded bg-red-900/20">
      {{ error }}
    </div>

    <div class="flex flex-col gap-2">
      <!-- Contribution squares -->
      <div :key="animationKey" class="weeks-container flex gap-1 overflow-x-auto p-2">
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
              isAnimatingDay(weekIndex, dayIndex) ? 'animating-day' : ''
            ]"
            class="contribution-day w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-white/50 animate-dayUpdate"
            :title="`${day.count} contributions on ${day.date}`"
            @click="showDayDetails(day)"
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
            :class="`flex items-center justify-center h-full text-xs text-gray-400 cursor-pointer border-b p-2 transition-all ${
              selectedYear === y
                ? 'text-primary border-primary bg-gradient-to-br from-primary/0 to-primary/20'
                : 'border-transparent hover:text-primary hover:bg-gradient-to-br hover:from-primary/0 hover:to-primary/20'
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

const { t } = useI18n()

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
const loading = ref(true)
const error = ref(null)
const selectedYear = ref(props.year)
const currentYear = ref(new Date().getFullYear())
const availableYears = ref([])
const yearsLoading = ref(true)
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

// Fetch available years from GitHub
const fetchAvailableYears = async () => {
  try {
    yearsLoading.value = true

    // Fetch user creation year and current activity
    const query = `
      query($userName:String!) {
        user(login: $userName) {
          createdAt
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables: { userName: props.username }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    const userCreatedAt = new Date(data.data.user.createdAt)
    const userCreatedYear = userCreatedAt.getFullYear()
    const startYear = userCreatedYear

    // Generate years from user creation year to current year
    const years = []
    for (let year = currentYear.value; year >= startYear; year--) {
      years.push(year)
    }

    availableYears.value = years.reverse()
  } catch (err) {
    console.error('Error fetching available years:', err)
    // Fallback: generate years from 2010 to current year
    const years = []
    for (let year = currentYear.value; year >= 2010; year--) {
      years.push(year)
    }
    availableYears.value = years
  } finally {
    yearsLoading.value = false
    // Scroll to the end after years are loaded
    scrollYearsToEnd()
  }
}

// Fetch real GitHub contribution data
const fetchGitHubContributions = async () => {
  try {
    loading.value = true
    error.value = null

    // Calculate the date range for the selected year
    const fromDate = `${selectedYear.value}-01-01T00:00:00Z`
    const toDate = `${selectedYear.value}-12-31T23:59:59Z`

    const query = `
      query($userName:String!, $from:DateTime!, $to:DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables: {
          userName: props.username,
          from: fromDate,
          to: toDate
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar
    totalContributions.value = calendar.totalContributions

    // Transform the API response: weeks have contributionDays arrays
    const newWeeks = calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount
      }))
    )

    // Don't clear upfront - keep old data visible during animation
    // Initialize with empty structure only if weeks is empty
    if (weeks.value.length === 0) {
      weeks.value = newWeeks.map((week) => week.map(() => ({ date: '', count: 0 })))
    }

    // Animate filling in the days one by one
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
        // After animation completes, trim to only the weeks that belong to the new year
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
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err)
    error.value = `${t('github.calendar.error')}: ${
      err.message
    }. Make sure VITE_GITHUB_TOKEN is set correctly.`
    // Fallback: generate sample data
    generateSampleData()
  } finally {
    loading.value = false
  }
}

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
  if (count === 0) return 'bg-gray-800'
  if (count <= 3) return 'bg-orange-900'
  if (count <= 6) return 'bg-orange-700'
  if (count <= 9) return 'bg-orange-500'
  return 'bg-orange-300'
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
    box-shadow: 0 0 0 0 rgba(255, 182, 121, 0.7);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(255, 182, 121, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 182, 121, 0);
  }
}

@keyframes cursorGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 182, 121, 0.7);
  }
  100% {
    box-shadow: 0 0 4px 0px rgba(255, 182, 121, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.1s ease-in-out forwards;
  opacity: 0;
}

.animate-dayUpdate {
  animation: dayUpdate 0.1s ease-out;
}

.animating-day {
  /*animation: cursorGlow 0.1s ease-in-out infinite;*/
}
</style>
