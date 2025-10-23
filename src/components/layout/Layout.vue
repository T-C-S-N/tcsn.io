<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden">
    <Header />
    <main class="flex-1 w-full min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)] z-0">
      <slot />
    </main>
    <Footer />
  </div>
</template>
