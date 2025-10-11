<template>
  <div
    class="flex justify-center lg:items-center w-full min-h-screen text-primary p-4"
  >
    <div
      class="flex flex-col justify-start items-start gap-4 w-full lg:w-1/2 text-md font-mono py-10"
    >
      <VisitorTrackingDemo />
      <ChatBot class="max-h-[calc(100vh-350px)]" />
    </div>
  </div>
</template>

<script setup>
import VisitorTrackingDemo from '@/components/VisitorTrackingDemo.vue'
import ChatBot from '@/components/ChatBot.vue'
</script>
