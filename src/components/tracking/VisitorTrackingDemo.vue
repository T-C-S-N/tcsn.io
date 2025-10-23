<template>
  <div class="text-primary w-full">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-start items-center gap-4 shadow-sm text-primary p-4 w-full select-none transition-all"
    >
      <div
        class="w-6 h-6 border-2 border-gray-100/10 border-t-primary rounded-full animate-spin"
      />
      <p class="text-primary text-sm">
        Initializing visitor tracking...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col justify-center items-center gap-2 text-center p-4 backdrop-blur-[5px] rounded-sm"
    >
      <div class="text-primary font-semibold">
        Tracking Error
      </div>
      <p class="">
        {{ error }}
      </p>
      <button
        class="text-primary border border-primary px-5 py-2 rounded-md cursor-pointer transition-all backdrop-blur-[1px] hover:bg-primary/10 flex items-center"
        @click="initializeTracking"
      >
        <fa
          :icon="['fas', 'redo']"
          class="mr-2"
        />
        Retry
      </button>
    </div>

    <!-- Success State -->
    <div
      v-else
      class="flex flex-col gap-4 backdrop-blur-[1px] w-full"
    >
      <!-- Greeting -->
      <!--<div class="text-center">
        <p class="text-primary">{{ getGreeting() }}</p>
      </div>-->

      <!-- Visitor Status -->
      <div
        class="flex justify-center gap-2 flex-wrap w-full border-t border-primary/20 p-2 hidden"
      >
        <div
          v-if="isNewVisitor"
          class="flex flex-row items-center gap-2 rounded-full text-sm text-primary"
        >
          <fa :icon="['fas', 'star']" />
          New Visitor
        </div>
        <div
          v-else-if="isNewSession"
          class="flex flex-row items-center gap-2 rounded-full text-sm text-primary"
        >
          <fa :icon="['fas', 'sync']" />
          New Session
        </div>
        <div
          v-else
          class="flex flex-row items-center gap-2 rounded-full text-sm text-primary"
        >
          <fa :icon="['fas', 'check']" />
          Active Session
        </div>
      </div>

      <!-- Visitor Details -->
      <div
        v-if="visitor"
        class="flex flex-col justify-start items-start w-fit"
      >
        <a
          :class="`flex justify-between items-center gap-4 shadow-sm text-primary px-4 py-2 w-fit cursor-pointer select-none border hover:border-primary/20 transition-none hover:backdrop-blur-[2px] group ${
            isInfoOpen
              ? 'border-primary/20 rounded-t-lg'
              : 'border-transparent rounded-lg'
          }`"
          @click="isInfoOpen = !isInfoOpen"
        >
          <div class="">
            <!--<p v-if="isNewVisitor" class="text-md">
              Hello, <span class="font-semibold">{{ visitorName }}</span
              >!
            </p>
            <p v-else class="text-md">
              Welcome back, <span class="font-semibold">{{ visitorName }}</span
              >!
            </p>-->

            <p
              v-if="isNewVisitor"
              class="text-md"
            >Hello!</p>
            <p
              v-else
              class="text-md"
            >Welcome back!</p>
          </div>

          <div class="">
            <fa
              :icon="['fas', 'chevron-up']"
              :class="`text-sm transition-all group-hover:opacity-100 ${
                isInfoOpen ? 'opacity-100' : 'opacity-0  rotate-180'
              }`"
            />
          </div>
        </a>
      </div>
    </div>

    <!-- Infos modal -->
    <div
      v-if="isInfoOpen"
      class="flex flex-col gap-4 w-screen h-screen p-4 rounded-b-lg fixed top-0 left-0 z-[200] overflow-y-auto max-h-[100vh] backdrop-blur-[10px] shadow-lg"
    >
      <header class="flex flex-row justify-between items-center w-full">
        <div class="text-md">
          Here's some information we've gathered about your visit:
        </div>
        <button
          class="text-primary border border-primary px-4 py-1 rounded-md cursor-pointer transition-all backdrop-blur-[1px] hover:bg-primary/10 hover:border-primary/20 flex items-center"
          @click="isInfoOpen = false"
        >
          <fa
            :icon="['fas', 'times']"
            class="mr-2"
          />
          Close
        </button>
      </header>

      <!-- Analytics -->
      <div class="flex flex-col gap-2 w-full">
        <VisitorAnalytics />
      </div>

      <div class="flex flex-col gap-2 w-full">
        <!-- Visitor Information -->
        <div
          v-if="visitor.visitorId"
          class="w-full border-t border-b border-primary/20 p-4"
        >
          <div class="m-0 mb-4 text-lg font-semibold pb-2">
            Visitor Information
          </div>
          <div class="flex flex-col gap-2 w-full text-sm">
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Generated Name:</label>
              <span class="">{{
                visitor.generatedName || visitor.fallbackName || 'Anonymous'
              }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Visitor ID:</label>
              <span class="">{{ visitor.visitorId }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Session ID:</label>
              <span class="">{{ visitor.sessionId }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">First Visit:</label>
              <span class="">{{ formatDate(visitor.firstVisit) }}</span>
            </div>
          </div>
        </div>

        <!-- Browser Information -->
        <div
          v-if="visitor.browserInfo"
          class="w-full border-t border-b border-primary/20 p-4"
        >
          <div class="m-0 mb-4 text-lg font-semibold pb-2">
            Browser & Device
          </div>
          <div class="flex flex-col gap-2 w-full text-sm">
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Browser:</label>
              <span class="">{{ visitor.browserInfo.browser }} {{ visitor.browserInfo.version }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Operating System:</label>
              <span class="">{{ visitor.browserInfo.os?.name }}
                {{ visitor.browserInfo.os?.version }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Device:</label>
              <span class="">{{ visitor.browserInfo.device }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Screen:</label>
              <span class="">{{ visitor.browserInfo.screen?.width }}x{{
                visitor.browserInfo.screen?.height
              }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Language:</label>
              <span class="">{{ visitor.browserInfo.language }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Timezone:</label>
              <span class="">{{ visitor.browserInfo.timezone }}</span>
            </div>
          </div>
        </div>

        <!-- Location Information -->
        <div
          v-if="visitor.location"
          class="w-full border-t border-b border-primary/20 p-4"
        >
          <div class="m-0 mb-4 text-lg font-semibold pb-2">
            Location Information
            <span
              v-if="visitor.location.source === 'browser'"
              class="text-xs text-primary ml-2"
            >
              (Browser timezone only)
            </span>
            <span
              v-else-if="visitor.location.source === 'api'"
              class="text-xs text-primary ml-2"
            >
              (Detected from IP)
            </span>
          </div>
          <div class="flex flex-col gap-2 w-full text-sm">
            <div
              v-if="visitor.location.country"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">Country:</label>
              <span class="text-base">{{ visitor.location.country }}</span>
            </div>
            <div
              v-if="visitor.location.region"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">Region:</label>
              <span class="">{{ visitor.location.region }}</span>
            </div>
            <div
              v-if="visitor.location.city"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">City:</label>
              <span class="">{{ visitor.location.city }}</span>
            </div>
            <div
              v-if="visitor.location.isp"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">ISP:</label>
              <span class="">{{ visitor.location.isp }}</span>
            </div>
            <div
              v-if="visitor.location.timezone"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">Timezone:</label>
              <span class="">{{ visitor.location.timezone }}</span>
            </div>
            <div
              v-if="visitor.location.latitude && visitor.location.longitude"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">Coordinates:</label>
              <span class="">{{ visitor.location.latitude }}, {{ visitor.location.longitude }}</span>
            </div>
            <div
              v-if="visitor.location.source === 'browser'"
              class="text-xs text-primary italic mt-2"
            >
              Note: Unable to detect your location from IP address. Only browser timezone
              is available.
            </div>
          </div>
        </div>

        <!-- Session Information -->
        <div
          v-if="visitor.currentSession"
          class="w-full border-t border-b border-primary/20 p-4"
        >
          <div class="m-0 mb-4 text-lg font-semibold pb-2">
            Current Session
          </div>
          <div class="flex flex-col gap-2 w-full text-sm">
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Session Start:</label>
              <span class="">{{ formatDate(visitor.currentSession.startTime) }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Last Activity:</label>
              <span class="">{{ formatDate(visitor.currentSession.lastActivity) }}</span>
            </div>
            <div class="flex flex-row justify-between gap-1">
              <label class="font-semibold">Pages Viewed:</label>
              <span class="">{{ visitor.currentSession.pageViews?.length || 0 }}</span>
            </div>
            <div
              v-if="visitor.currentSession.referrer"
              class="flex flex-row justify-between gap-1"
            >
              <label class="font-semibold">Referrer:</label>
              <span class="">{{ visitor.currentSession.referrer }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <!-- Map -->
        <div
          v-if="
            visitor.location && visitor.location.latitude && visitor.location.longitude
          "
          class=""
        >
          <div class="flex flex-col gap-2">
            <LocationMap
              :latitude="visitor.location.latitude"
              :longitude="visitor.location.longitude"
              :zoom="12"
              class="opacity-75"
            />
            <div class="text-xs text-primary/70 text-center">
              Approximate location based on IP address
            </div>
          </div>
        </div>

        <!-- No location message -->
        <div
          v-else-if="visitor.location && visitor.location.source === 'browser'"
          class="text-center p-4 text-primary/70"
        >
          <div class="text-sm">
            <fa
              :icon="['fas', 'map-marker-alt']"
              class="mr-2 opacity-50"
            />
            Location map not available - IP geolocation failed
          </div>
          <div class="text-xs mt-1">
            Only browser timezone data is available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'
import LocationMap from '../LocationMap.vue'

// Store
const visitorStore = useVisitorStore()

// Local state
const isInfoOpen = ref(false)

// Computed values
const visitor = computed(() => visitorStore.visitor)
const visitorName = computed(() => visitorStore.displayName)
const isNewVisitor = computed(() => !visitorStore.isReturningVisitor)
const isNewSession = computed(() => true) // Simplified for now
const isLoading = computed(() => false) // Store doesn't have loading state
const error = computed(() => null) // Store doesn't have error state

// Methods
const initializeTracking = () => {
  visitorStore.initializeVisitor()
}

const getGreeting = () => {
  const hour = new Date().getHours()
  const name = visitorStore.visitor.name || 'Visitor'
  if (hour < 12) return `Good morning, ${name}!`
  if (hour < 18) return `Good afternoon, ${name}!`
  return `Good evening, ${name}!`
}

// Initialize on mount
onMounted(async () => {
  if (!visitor.value.id) {
    await initializeTracking()
  }
})

// Format date for display
const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleString()
}

// Refresh tracking data
const refreshTracking = async () => {
  // Store current visitor data before refresh
  const currentName = visitorName.value
  const currentVisitor = visitor.value

  await initializeTracking()

  // If name becomes empty after refresh, restore the previous name
  if (!visitorName.value || visitorName.value === 'Anonymous Visitor') {
    if (currentName && currentName !== 'Anonymous Visitor') {
      visitorName.value = currentName
    } else if (currentVisitor?.generatedName) {
      visitorName.value = currentVisitor.generatedName
    } else if (currentVisitor?.fallbackName) {
      visitorName.value = currentVisitor.fallbackName
    }
  }
}

// Clear visitor data (for testing)
const clearVisitorData = () => {
  localStorage.removeItem('tcsn_visitor')
  location.reload()
}
</script>
