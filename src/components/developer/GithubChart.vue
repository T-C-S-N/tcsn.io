<template>
  <div class="flex flex-col justify-center gap-4 w-full">
    <!-- Error state -->
    <div
      v-if="error"
      class="text-sm text-red-400 p-3 rounded bg-red-900/20"
    >
      {{ error }}
    </div>

    <!-- Chart container -->
    <div
      ref="chartContainer"
      class="w-full lg:min-w-[900px] h-80"
    />

    <!-- Year navigation -->
    <div
      v-if="isYearSelector"
      ref="yearsScrollContainer"
      class="flex flex-row overflow-auto w-full justify-end"
    >
      <div
        v-for="(y, i) in availableYears"
        :key="i"
        class="flex-shrink-0 p-2"
      >
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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
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
    default: false
  }
})

// State
const chartContainer = ref(null)
const yearsScrollContainer = ref(null)
const totalContributions = ref(0)
const error = ref(null)
const selectedYear = ref(props.year)
const availableYears = ref([])
const contributionData = ref([])

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
    fetchGitHubContributions()
  }
)

// Fetch available years from store
const fetchAvailableYears = async () => {
  try {
    await aboutStore.fetchGithubAvailableYears()
    availableYears.value = aboutStore.github.availableYears
    scrollYearsToEnd()
  } catch (err) {
    console.error('Error fetching available years:', err)
    // Fallback: generate years from 2010 to current year
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 2010; year--) {
      years.push(year)
    }
    availableYears.value = years
    scrollYearsToEnd()
  }
}

// Fetch GitHub contribution data from store
const fetchGitHubContributions = async () => {
  try {
    error.value = null
    await aboutStore.fetchGitHubContributions(selectedYear.value)

    const contributionDataFromStore = aboutStore.github.contributions[selectedYear.value]
    if (contributionDataFromStore) {
      totalContributions.value = contributionDataFromStore.totalContributions

      // Transform data into daily array
      const dailyData = contributionDataFromStore.weeks
        .flatMap((week) => week)
        .map((day) => ({
          date: new Date(day.date),
          count: day.count
        }))

      contributionData.value = dailyData
      renderChart()
    }
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err)
    error.value = `${t('github.calendar.error')}: ${err.message}`
  }
}

// Render D3 chart
const renderChart = () => {
  if (!chartContainer.value || contributionData.value.length === 0) return

  // Clear previous chart
  d3.select(chartContainer.value).selectAll('*').remove()

  // Set dimensions
  const margin = { top: 20, right: 30, bottom: 30, left: 60 }
  const containerWidth = chartContainer.value.clientWidth
  const containerHeight = chartContainer.value.clientHeight
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom - 20

  // Create SVG
  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(contributionData.value, (d) => d.date))
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(contributionData.value, (d) => d.count)])
    .range([height, 0])

  // Create line generator
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.count))

  // Add gradient
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'line-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#ffb679')
    .attr('stop-opacity', 0.3)

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#ffb679')
    .attr('stop-opacity', 0)

  // Add area under curve with animation
  const area = d3
    .area()
    .x((d) => xScale(d.date))
    .y0(height)
    .y1((d) => yScale(d.count))

  const areaPath = svg
    .append('path')
    .datum(contributionData.value)
    .attr('fill', 'url(#line-gradient)')
    .attr('d', area)
    .attr('opacity', 0)

  areaPath.transition().duration(3000).ease(d3.easeQuadInOut).attr('opacity', 1)

  // Add line path with animation
  const linePath = svg
    .append('path')
    .datum(contributionData.value)
    .attr('fill', 'none')
    .attr('stroke', '#ffb679')
    .attr('stroke-width', 2.5)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('d', line)
    .attr('stroke-dasharray', function () {
      return this.getTotalLength()
    })
    .attr('stroke-dashoffset', function () {
      return this.getTotalLength()
    })

  linePath.transition().duration(3000).ease(d3.easeLinear).attr('stroke-dashoffset', 0)

  // Add circles for data points with staggered animation
  svg
    .selectAll('.dot')
    .data(contributionData.value)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(d.date))
    .attr('cy', (d) => yScale(d.count))
    .attr('r', 0)
    .attr('fill', '#ffb679')
    .attr('opacity', 0)
    .transition()
    .duration(3000)
    .delay((d, i) => i * 1)
    .ease(d3.easeElasticOut)
    .attr('r', 2)
    .attr('opacity', 0.6)
    .on('end', function () {
      d3.select(this)
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 4).attr('opacity', 1)

          svg
            .append('text')
            .attr('class', 'tooltip')
            .attr('x', xScale(d.date))
            .attr('y', yScale(d.count) - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffb679')
            .attr('font-size', '12px')
            .text(`${d.count}`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 2).attr('opacity', 0.6)
          svg.selectAll('.tooltip').remove()
        })
    })

  // Add X axis with animation
  const xAxisGroup = svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .attr('opacity', 0)

  xAxisGroup.call(d3.axisBottom(xScale))

  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-30)')
    .style('text-anchor', 'end')

  xAxisGroup
    .transition()
    .duration(3000)
    .delay(0)
    .ease(d3.easeQuadInOut)
    .attr('opacity', 1)

  xAxisGroup.attr('color', '#9ca3af').attr('font-size', '12px')

  // Add Y axis with animation
  const yAxisGroup = svg.append('g').attr('opacity', 0)

  yAxisGroup.call(d3.axisLeft(yScale))

  yAxisGroup
    .transition()
    .duration(3000)
    .delay(0)
    .ease(d3.easeQuadInOut)
    .attr('opacity', 1)

  yAxisGroup.attr('color', '#9ca3af').attr('font-size', '12px')

  // Add Y axis label with animation
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .attr('fill', '#9ca3af')
    .attr('font-size', '12px')
    .attr('opacity', 0)
    .text('Contributions')
    .transition()
    .duration(3000)
    .delay(0)
    .ease(d3.easeQuadInOut)
    .attr('opacity', 1)

  // Style grid lines
  svg
    .selectAll('g.tick')
    .selectAll('line')
    .attr('stroke', '#374151')
    .attr('stroke-dasharray', '4')
    .attr('opacity', 0.5)
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
  fetchGitHubContributions()
  emit('year-changed', year)
}

// Watch for window resize and redraw chart
const handleResize = () => {
  if (contributionData.value.length > 0) {
    renderChart()
  }
}

onMounted(() => {
  fetchAvailableYears()
  fetchGitHubContributions()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
:deep(text) {
  font-family: inherit;
}

:deep(.tick text) {
  fill: #9ca3af;
  font-size: 12px;
}

:deep(.domain) {
  stroke: #4b5563;
}
</style>
