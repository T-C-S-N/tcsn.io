<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden">
    <Header />
    <main class="flex-1 w-full z-0">
      <slot />
    </main>
    <Footer />
  </div>
</template>
