<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Name *
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your full name"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email *
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="your.email@example.com"
      />
    </div>

    <div>
      <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
        Subject *
      </label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="What's this about?"
      />
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
        Message *
      </label>
      <textarea
        id="message"
        v-model="form.message"
        required
        rows="5"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tell us about your project or idea..."
      ></textarea>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="statusMessage" class="p-4 rounded-md" :class="{
      'bg-green-50 text-green-800': statusType === 'success',
      'bg-red-50 text-red-800': statusType === 'error'
    }">
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
