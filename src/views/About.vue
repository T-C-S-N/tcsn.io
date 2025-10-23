<template>
  <section
    class="flex flex-col justify-center lg:items-center gap-20 w-full min-h-screen pt-20 text-primary p-4"
  >
    <div class="flex flex-col justify-start items-start gap-4 w-fit lg:w-2/3">
      <p class="text-md font-mono">
        {{ $t('about.text') }}
      </p>
    </div>

    <div class="flex justify-center w-full">
      <DeveloperStats />
    </div>
  </section>
</template>
