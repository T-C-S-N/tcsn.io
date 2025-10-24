<template>
  <div
    id="app"
    class="font-sans antialiased"
  >
    <Layout v-if="!isLoading">
      <router-view
        :key="route.path"
        v-slot="{ Component }"
      >
        <component :is="Component" />
      </router-view>
    </Layout>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLoading = ref(true)

watch(
  () => route.path,
  () => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

onMounted(() => {
  if (isLoading.value) {
    setTimeout(() => {
      isLoading.value = false
    }, 0)
  }
})
</script>