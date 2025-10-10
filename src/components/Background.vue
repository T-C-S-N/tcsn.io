<template>
  <div class="w-full h-full relative">
    <!-- Base circle -->
    <div class="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-b from-green-400 to-transparent" />
    <div class="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-b from-transparent to-green-500 blur-sm" />
    <div class="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-b from-transparent to-green-300 blur-md" />

<div class="backdrop-blur-[5px] w-full h-[100px]" />
<div class="backdrop-blur-[10px] w-full h-[200px]" />
<div class="backdrop-blur-[20px] w-full h-[300px]" />

  </div>
</template>

<script setup>
</script>
