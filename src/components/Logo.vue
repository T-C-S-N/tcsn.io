<!--<?xml version="1.0" encoding="utf-8"?>-->
<!-- Generator: Adobe Illustrator 25.3.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

<template>
  <svg
    id="Layer_1"
    ref="logo"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="-30 -30 300.94 215.91"
    style="enable-background: new 0 0 240.94 155.91"
    xml:space="preserve"
  >
    <g
      id="Layer_1_1_"
      class="st0"
    >
      <g class="st1">
        <polyline
          class="st2"
          points="28.35,73.65 62.61,107.94 114.02,107.94 		"
        />
        <line
          class="st2"
          x1="114.02"
          y1="107.94"
          x2="115.87"
          y2="98.81"
        />
        <polyline
          class="st2"
          points="79.76,73.65 81.57,64.54 115.87,98.81 		"
        />
        <polyline
          class="st2"
          points="79.76,73.65 106.5,100.42 114.02,107.94 		"
        />
        <polyline
          class="st2"
          points="100.38,61.32 84.03,52.23 81.57,64.52 		"
        />
        <line
          class="st2"
          x1="28.35"
          y1="73.65"
          x2="81.57"
          y2="64.52"
        />
        <line
          class="st2"
          x1="79.76"
          y1="73.65"
          x2="81.57"
          y2="64.52"
        />
        <line
          class="st2"
          x1="28.35"
          y1="73.65"
          x2="79.76"
          y2="73.65"
        />
        <line
          class="st2"
          x1="134.65"
          y1="95.58"
          x2="115.87"
          y2="98.81"
        />
        <line
          class="st2"
          x1="115.87"
          y1="98.81"
          x2="81.57"
          y2="64.52"
        />
        <polyline
          class="st2"
          points="100.38,61.32 94.17,62.37 81.57,64.52 		"
        />
        <polyline
          class="st2"
          points="156.89,107.94 212.6,82.23 178.31,47.96 		"
        />
        <line
          class="st2"
          x1="156.89"
          y1="107.94"
          x2="134.65"
          y2="95.58"
        />
        <line
          class="st2"
          x1="134.65"
          y1="95.58"
          x2="100.38"
          y2="61.32"
        />
        <polyline
          class="st2"
          points="156.89,107.94 143.09,94.15 122.6,73.65 		"
        />
        <line
          class="st2"
          x1="178.31"
          y1="47.96"
          x2="100.38"
          y2="61.32"
        />
        <line
          class="st2"
          x1="122.6"
          y1="73.65"
          x2="178.31"
          y2="47.96"
        />
        <line
          class="st2"
          x1="122.6"
          y1="73.65"
          x2="100.38"
          y2="61.32"
        />
      </g>
    </g>
    <g>
      <polygon
        class="st3"
        points="94.2,56.2 72.82,44.32 69.6,60.39 86.07,57.57 	"
      />
      <polygon
        class="st4"
        points="67.23,72.33 102.2,107.34 112.04,117.18 114.45,105.23 69.6,60.42 	"
      />
      <polygon
        class="st5"
        points="67.23,72.33 69.6,60.42 114.45,105.23 69.6,60.39 	"
      />
      <polygon
        class="st6"
        points="67.23,72.33 0,72.33 44.81,117.18 112.04,117.18 102.2,107.34 	"
      />
      <polygon
        ref="st3"
        class="st3"
        points="69.6,60.39 0,72.33 67.23,72.33 	"
      />
      <polygon
        class="st7"
        points="86.07,57.57 69.6,60.39 114.45,105.23 139.01,101.01 94.2,56.2 	"
      />
      <polygon
        class="st8"
        points="196.1,38.73 123.25,72.33 150.05,99.14 168.09,117.18 240.94,83.54 	"
      />
      <polygon
        class="st9"
        points="123.25,72.33 94.2,56.2 139.01,101.01 168.09,117.18 150.05,99.14 	"
      />
      <polygon
        class="st10"
        points="196.1,38.73 94.2,56.2 123.25,72.33 	"
      />
    </g>
  </svg>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  status: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0 && value <= 8
  }
})

const logo = ref(null)

watch(
  () => props.status,
  async (newStatus) => {
    if (!logo.value) return

    // Apply 3D rotation to the logo before color changes
    // transition effect is 1000ms
    logo.value.style.transition = 'transform 100ms'
    logo.value.style.transform = 'rotateY(90deg)'
    setTimeout(() => {
      logo.value.style.transform = 'rotateY(0deg)'
    }, 200)

    await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for the rotation to finish

    if (!logo.value) return

    const st3 = logo.value.querySelectorAll('.st3')
    const st4 = logo.value.querySelectorAll('.st4')
    const st5 = logo.value.querySelectorAll('.st5')
    const st6 = logo.value.querySelectorAll('.st6')
    const st7 = logo.value.querySelectorAll('.st7')
    const st8 = logo.value.querySelectorAll('.st8')
    const st9 = logo.value.querySelectorAll('.st9')
    const st10 = logo.value.querySelectorAll('.st10')

    switch (newStatus) {
      case 0:
        st3.forEach((el) => (el.style.fill = 'none'))
        st4.forEach((el) => (el.style.fill = 'none'))
        st5.forEach((el) => (el.style.fill = 'none'))
        st6.forEach((el) => (el.style.fill = 'none'))
        st7.forEach((el) => (el.style.fill = 'none'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 1:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = 'none'))
        st5.forEach((el) => (el.style.fill = 'none'))
        st6.forEach((el) => (el.style.fill = 'none'))
        st7.forEach((el) => (el.style.fill = 'none'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 2:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = 'none'))
        st6.forEach((el) => (el.style.fill = 'none'))
        st7.forEach((el) => (el.style.fill = 'none'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 3:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = 'none'))
        st7.forEach((el) => (el.style.fill = 'none'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 4:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = '#ffb679'))
        st7.forEach((el) => (el.style.fill = 'none'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 5:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = '#ffb679'))
        st7.forEach((el) => (el.style.fill = '#ffb679'))
        st8.forEach((el) => (el.style.fill = 'none'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 6:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = '#ffb679'))
        st7.forEach((el) => (el.style.fill = '#ffb679'))
        st8.forEach((el) => (el.style.fill = '#ffb679'))
        st9.forEach((el) => (el.style.fill = 'none'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 7:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = '#ffb679'))
        st7.forEach((el) => (el.style.fill = '#ffb679'))
        st8.forEach((el) => (el.style.fill = '#ffb679'))
        st9.forEach((el) => (el.style.fill = '#ffb679'))
        st10.forEach((el) => (el.style.fill = 'none'))
        break
      case 8:
        st3.forEach((el) => (el.style.fill = '#ffb679'))
        st4.forEach((el) => (el.style.fill = '#ffb679'))
        st5.forEach((el) => (el.style.fill = '#ffb679'))
        st6.forEach((el) => (el.style.fill = '#ffb679'))
        st7.forEach((el) => (el.style.fill = '#ffb679'))
        st8.forEach((el) => (el.style.fill = '#ffb679'))
        st9.forEach((el) => (el.style.fill = '#ffb679'))
        st10.forEach((el) => (el.style.fill = '#ffb679'))
        break

      default:
        // Handle unexpected status values if necessary
        break
    }
  },
  { immediate: true }
)
</script>

<style type="text/css" scoped>
#Layer_1 {
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in-out;
}

.st0 {
  display: none;
}

.st1 {
  display: inline;
}

.st2,
.st3,
.st4,
.st5,
.st6,
.st7,
.st8,
.st9,
.st10 {
  fill: none;
  stroke: #ffb679;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-linejoin: round;
}
</style>
