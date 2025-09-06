<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <p class="text-xl text-gray-600 mb-12">
          Ready to start your next project? Get in touch with us today.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
          <ContactForm />
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Email</h3>
              <p class="text-gray-600">hello@tcsn.io</p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Location</h3>
              <p class="text-gray-600">Brussels, Belgium</p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Response Time</h3>
              <p class="text-gray-600">Usually within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ContactForm from '@/components/contact/ContactForm.vue'
</script>
