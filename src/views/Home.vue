<template>
  <div
    class="min-h-screen w-full overflow-hidden flex flex-col items-start justify-start gap-2 pt-20 pb-[120px]"
  >
    <div class="flex w-full px-4">
      <VisitorTrackingDemo />
    </div>
    <div class="flex w-full px-4">
      <ChatBot class="max-h-[calc(100vh-350px)]"/>
    </div>
  </div>
</template>

<script setup>
import VisitorTrackingDemo from '@/components/VisitorTrackingDemo.vue'
import ChatBot from '@/components/ChatBot.vue'
</script>
