<template>
  <form
    class="flex flex-col gap-6 w-full"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <label
        for="name"
        class="text-sm text-glow"
      >
        Name *
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="w-full px-2 py-2 rounded-sm border border-[#00ff00] text-glow placeholder:text-glow focus:outline-none bg-transparent"
        placeholder="Your full name"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="email"
        class="text-sm text-glow"
      >
        Email *
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="w-full px-2 py-2 rounded-sm border border-[#00ff00] text-glow placeholder:text-glow focus:outline-none bg-transparent"
        placeholder="your.email@example.com"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="subject"
        class="text-sm text-glow"
      >
        Subject *
      </label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        required
        class="w-full px-2 py-2 rounded-sm border border-[#00ff00] text-glow placeholder:text-glow focus:outline-none bg-transparent"
        placeholder="What's this about?"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="message"
        class="text-sm text-glow"
      >
        Message *
      </label>
      <textarea
        id="message"
        v-model="form.message"
        required
        rows="5"
        class="w-full px-2 py-2 rounded-sm border border-[#00ff00] text-glow placeholder:text-glow focus:outline-none bg-transparent"
        placeholder="Tell us about your project or idea..."
      />
    </div>

    <div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full text-green-400 font-semibold py-3 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="statusMessage"
      class="p-4 rounded-md"
      :class="{
        'bg-green-50 text-green-800': statusType === 'success',
        'bg-red-50 text-red-800': statusType === 'error'
      }"
    >
      {{ statusMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  statusMessage.value = ''
  
  try {
    // Here you would typically send the form data to your API
    // For now, we'll simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    statusType.value = 'success'
    statusMessage.value = 'Thank you for your message! We\'ll get back to you soon.'
    
    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = 'Sorry, there was an error sending your message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
