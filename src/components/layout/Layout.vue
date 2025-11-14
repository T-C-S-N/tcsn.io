<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden">
    <Header v-if="$route.name === 'home'" />
    <main class="flex-1 w-full z-0">
      <slot />
    </main>
    <Footer v-if="$route.name === 'home'" />
  </div>
</template>
