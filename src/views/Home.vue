<template>
  <div
    class="min-h-screen w-full overflow-hidden bg-background flex flex-col items-start justify-start pt-20"
  >
    <Background />
    <ChatBot />
    <div class="flex w-full">
      <VisitorTrackingDemo />
    </div>
  </div>
</template>

<script setup>
import VisitorTrackingDemo from '@/components/VisitorTrackingDemo.vue'
import Background from '@/components/Background.vue'
import ChatBot from '@/components/ChatBot.vue'
</script>
