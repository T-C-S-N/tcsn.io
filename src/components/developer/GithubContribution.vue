<template>
  <div class="github-contributions">
    <h3 class="text-xl font-semibold mb-4">GitHub Contributions</h3>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 p-4 rounded-lg bg-red-50">
      {{ error }}
    </div>
    
    <!-- Contributions grid -->
    <div v-else class="contributions-container">
      <!-- Option 1: Custom grid -->
      <div class="contributions-grid mb-4">
        <div 
          v-for="(week, weekIndex) in contributionData" 
          :key="weekIndex"
          class="week-column"
        >
          <div
            v-for="(day, dayIndex) in week.contributionDays"
            :key="dayIndex"
            :class="getContributionClass(day.contributionCount)"
            :title="`${day.contributionCount} contributions on ${day.date}`"
            class="contribution-day"
          ></div>
        </div>
      </div>
      
      <!-- Option 2: Embed GitHub's own contribution graph -->
      <div class="github-embed">
        <img 
          :src="`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical`"
          alt="GitHub Stats"
          class="w-full max-w-md"
        />
        <img 
          :src="`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=radical`"
          alt="GitHub Streak"
          class="w-full max-w-md mt-4"
        />
      </div>
      
      <!-- Stats summary -->
      <div class="stats-summary grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="stat-card bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalContributions }}</div>
          <div class="text-sm text-gray-600">Total Contributions</div>
        </div>
        <div class="stat-card bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ currentStreak }}</div>
          <div class="text-sm text-gray-600">Current Streak</div>
        </div>
        <div class="stat-card bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ longestStreak }}</div>
          <div class="text-sm text-gray-600">Longest Streak</div>
        </div>
        <div class="stat-card bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-600">{{ averagePerDay }}</div>
          <div class="text-sm text-gray-600">Avg/Day</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Props
const props = defineProps({
  username: {
    type: String,
    default: import.meta.env.VITE_GITHUB_USERNAME
  },
  theme: {
    type: String,
    default: 'github' // github, dark, minimal
  }
})

// Reactive state
const loading = ref(true)
const error = ref(null)
const contributionData = ref([])
const totalContributions = ref(0)
const currentStreak = ref(0)
const longestStreak = ref(0)

// Computed
const averagePerDay = computed(() => {
  if (contributionData.value.length === 0) return 0
  const totalDays = contributionData.value.length * 7
  return Math.round((totalContributions.value / totalDays) * 100) / 100
})

// Methods
const fetchGitHubContributions = async () => {
  try {
    loading.value = true
    error.value = null
    
    // GitHub GraphQL API query
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
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
        'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` // You'll need to add this to your .env
      },
      body: JSON.stringify({
        query,
        variables: { username: props.username }
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
    contributionData.value = calendar.weeks
    totalContributions.value = calendar.totalContributions
    
    calculateStreaks()
    
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err)
    error.value = 'Failed to load GitHub contributions. Using fallback method.'
    
    // Fallback: Use third-party service or mock data
    loadFallbackData()
  } finally {
    loading.value = false
  }
}

const loadFallbackData = () => {
  // Generate mock data or use a third-party service
  const weeks = []
  const today = new Date()
  
  for (let i = 52; i >= 0; i--) {
    const week = { contributionDays: [] }
    for (let j = 0; j < 7; j++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (i * 7 + j))
      week.contributionDays.push({
        date: date.toISOString().split('T')[0],
        contributionCount: Math.floor(Math.random() * 10)
      })
    }
    weeks.push(week)
  }
  
  contributionData.value = weeks
  totalContributions.value = weeks.reduce((total, week) => 
    total + week.contributionDays.reduce((weekTotal, day) => weekTotal + day.contributionCount, 0), 0
  )
}

const calculateStreaks = () => {
  let current = 0
  let longest = 0
  let temp = 0
  
  // Flatten all days and reverse for chronological order
  const allDays = contributionData.value
    .flatMap(week => week.contributionDays)
    .reverse()
  
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      temp++
      longest = Math.max(longest, temp)
    } else {
      temp = 0
    }
  }
  
  // Calculate current streak from today backwards
  const today = new Date().toISOString().split('T')[0]
  const todayIndex = allDays.findIndex(day => day.date === today)
  
  if (todayIndex !== -1) {
    for (let i = todayIndex; i >= 0; i--) {
      if (allDays[i].contributionCount > 0) {
        current++
      } else {
        break
      }
    }
  }
  
  currentStreak.value = current
  longestStreak.value = longest
}

const getContributionClass = (count) => {
  if (count === 0) return 'contribution-level-0'
  if (count <= 3) return 'contribution-level-1'
  if (count <= 6) return 'contribution-level-2'
  if (count <= 9) return 'contribution-level-3'
  return 'contribution-level-4'
}

// Lifecycle
onMounted(() => {
  fetchGitHubContributions()
})
</script>

<style scoped>
.github-contributions {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.contributions-grid {
  display: flex;
  gap: 3px;
  overflow-x: auto;
  padding: 10px;
  background: #f6f8fa;
  border-radius: 8px;
}

.week-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.contribution-day {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contribution-day:hover {
  transform: scale(1.1);
  border: 1px solid rgba(0, 0, 0, 0.3);
}

/* GitHub-like color scheme */
.contribution-level-0 {
  background-color: #ebedf0;
}

.contribution-level-1 {
  background-color: #9be9a8;
}

.contribution-level-2 {
  background-color: #40c463;
}

.contribution-level-3 {
  background-color: #30a14e;
}

.contribution-level-4 {
  background-color: #216e39;
}

/* Dark theme */
.theme-dark .contribution-level-0 {
  background-color: #161b22;
}

.theme-dark .contribution-level-1 {
  background-color: #0e4429;
}

.theme-dark .contribution-level-2 {
  background-color: #006d32;
}

.theme-dark .contribution-level-3 {
  background-color: #26a641;
}

.theme-dark .contribution-level-4 {
  background-color: #39d353;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.github-embed img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .contributions-grid {
    overflow-x: scroll;
  }
  
  .contribution-day {
    width: 8px;
    height: 8px;
  }
}
</style>

