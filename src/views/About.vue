<template>
  <div class="flex justify-center lg:items-center w-full min-h-screen pt-20 text-primary p-4">
    <div class="flex flex-col justify-start items-start gap-4 w-full lg:w-1/2">
    <p class="text-md font-mono">{{aboutText}}</p>
  </div>
  </div>
</template> 

<script setup>
import { ref } from 'vue'

const aboutText = ref(`I'm Tomas, a software engineer based in Brussels specializing in front-end architecture and scalable design systems. With experience spanning fintech, government, logistics, and education sectors, I focus on building accessible, user-centric interfaces that solve real business problems.
My approach combines technical expertise in Vue, React, and modern web technologies with a strong foundation in design principles. I believe great software bridges the gap between business needs and user experience—architecting solutions that are both elegant and practical.
When I'm not coding, you'll find me exploring photography, architectural design, or diving into graphic art. I bring this creative perspective to every project I build.`)
</script>
