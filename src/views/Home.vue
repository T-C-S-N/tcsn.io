<template>
  <!-- Business card -->
  <section
    id="business-card"
    class="w-full h-[calc(100vh-75px)] flex justify-center items-center"
    :style="{
      backgroundImage: `url(${backgroundImageLoaded ? Magnoliaverse : ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <BusinessCard />
  </section>

  <!-- Intro -->
  <section
    id="intro"
    class="w-full h-[calc(100vh-200px)] clip-container flex flex-col justify-center items-center"
  >
    <div class="flex flex-row justify-center items-center gap-8">
      <!-- Profile -->
      <div
        class="hidden lg:flex w-[250px] h-[245px] bg-white"
        :style="{
          backgroundImage: `url(${profilePic})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
      ></div>

      <!-- Text -->
      <div class="flex flex-col justify-start">
        <!-- Name -->
        <div class="flex flex-row items-center gap-4 h-[200px]">
          <div class="font-dm text-[150px]">
            <span>T</span>
            <span class="ml-[-25px]">oca</span>
          </div>
          <div class="font-noto text-[33px] pt-5">登 <br />花</div>
        </div>

        <!-- Profile -->
        <div
          class="flex lg:hidden w-full h-[245px] bg-white"
          :style="{
            backgroundImage: `url(${profilePic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }"
        ></div>

        <!-- Title -->
        <div class="font-dm text-[30px] font-light mt-6 lg:mt-2">
          Between tech & design
        </div>
        <!-- Description -->
        <div class="font-dm max-w-md text-justify text-[19px]">
          Design addict grew software engineer. <br />
          Specialized in front-end architecture and scalable design systems.
        </div>
      </div>
    </div>
  </section>

  <section
    id="stats"
    class="w-full h-fit py-[200px] clip-container flex flex-col justify-center items-center border"
  >
    <div class="flex justify-center w-full">
      <DeveloperStats />
    </div>
  </section>

  <section
    id="contact"
    class="w-full h-screen py-[200px] clip-container flex flex-col justify-center items-center"
  >
    <div class="flex flex-col justify-center items-center gap-8 w-full h-full">
      <!-- Chatbot -->
      <div class="w-full px-4 lg:w-1/2 text-md font-mono">
        <ChatBot class="max-h-[calc(100vh-400px)]" />
      </div>

      <!-- Or -->
      <div class="font-mono text-sm font-semibold text-text">- OR -</div>

      <!-- Email -->
      <div class="flex justify-center items-center w-full px-4">
        <a
          href="https://mlnk.is/mailme"
          class="flex flex-row justify-center items-center gap-4 lg:w-fit text-text-900 hover:scale-120 group px-8 py-4 rounded-md border border-secondary/20 bg-secondary/10 hover:bg-secondary/30 shadow-lg hover:shadow-sm transition-all"
        >
          <fa
            :icon="['fas', 'envelope']"
            class="group-hover:hidden transition-all"
            size="xl"
          />
          <fa
            :icon="['fas', 'envelope-open-text']"
            class="hidden group-hover:block transition-all"
            size="xl"
          />

          <div class="flex justify-center items-center w-full">
            <p>{{ $t('contact.title') }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!--<section
    class="w-full h-screen clip-container flex flex-col justify-start items-start border-t border-primary/20"
  >
    <div class="clip-wrapper">
      <div class="fixed-content flex items-center justify-center">
        <div class="relative w-full lg:w-1/2 text-md font-mono text-white">
          <div
            class="flex flex-col flex-wrap justify-center items-center gap-8 text-primary backdrop-blur-[5px] rounded-md px-4"
          >
            <a
              v-for="(media, index) in medias"
              :key="index"
              :href="media.url"
              target="_blank"
              class="flex flex-col lg:flex-row justify-between items-center gap-2 transition px-4 opacity-75 hover:opacity-100 hover:bg-primary/10 border border-primary/30 hover:border-primary/20 rounded-md w-60 py-4"
            >
              <fa :icon="media.icon" class="w-1/2 text-left" />
              <div class="text-xs w-1/2 text-left">{{ media.name }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>-->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Magnoliaverse from '@/assets/img/Magnoliaverse-sm-horizontal.webp'
import profilePic from '@/assets/img/profile_voronoi_bw-sm.webp'

const backgroundImageLoaded = ref(false)

onMounted(() => {
  const img = new Image()
  img.onload = () => {
    backgroundImageLoaded.value = true
  }
  img.src = Magnoliaverse
})
</script>
