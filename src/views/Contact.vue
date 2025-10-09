<template>
  <div class="flex w-full min-h-screen pt-20 z-50">

    <div class="mx-auto">
      <div class="flex flex-col gap-4 text-left mb-10">
        <h1 class="text-xl font-semibold font-mono text-glow">
          Contact Us
        </h1>
        <p class="text-md font-mono text-glow">
          Ready to start your next project? Get in touch with us today.
        </p>
      </div>

      <div class="w-full backdrop:blur-[100px] rounded-lg p-8 gap-8">
        <!-- Contact Form -->
        <div class="rounded-lg shadow-lg backdrop--[100px]">
          <h2 class="text-lg font-semibold font-mono text-glow mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        <!-- Contact Info -->
        <!--<div class="rounded-lg shadow-lg p-8 bg-black/30 backdrop-blur-md border border-green-400">
          <h2 class="text-2xl font-semibold font-mono text-green-400 mb-6">
            Get in touch
          </h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium font-mono text-green-400">
                Email
              </h3>
              <p class="font-mono text-green-400">
                hello@tcsn.io
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium font-mono text-green-400">
                Location
              </h3>
              <p class="font-mono text-green-400">
                Brussels, Belgium
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium font-mono text-green-400">
                Response Time
              </h3>
              <p class="font-mono text-green-400">
                Usually within 24 hours
              </p>
            </div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import ContactForm from '@/components/contact/ContactForm.vue'
</script>