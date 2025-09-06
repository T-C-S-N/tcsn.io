<template>
  <div class="welcome-box">
    <div class="text-center p-8">
      <div 
        ref="textBox"
        class="font-mono text-lg leading-relaxed whitespace-pre-wrap"
        :class="currentTextColor"
      >
        {{ intro }}
      </div>
      
      <div class="mt-8 space-y-4">
        <router-link 
          to="/contact" 
          class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <Mail class="w-5 h-5 mr-2" />
          Get In Touch
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Mail } from 'lucide-vue-next'

const intro = ref('')
const textBox = ref()
const textIndex = ref(0)
const colorIndex = ref(0)

const textColors = [
  'text-green-400', 
  'text-yellow-400', 
  'text-rose-400', 
  'text-blue-400', 
  'text-white', 
  'text-cyan-400', 
  'text-lime-400', 
  'text-pink-400'
]

const texts = [
  '                                       ',
  `
  Loading system...                                        
                                                           
  Initiating...                         
                            
  Increasing text size...        
                          
  Ready.                                

  `,
  ` 
  Hi, 
  Welcome !

  We are TCSN, a creative technology studio.
  
  We build digital experiences that matter.
  `,
  `
  Let's create something amazing together.
  
  Ready to start your project?
  `
]

const currentTextColor = computed(() => textColors[colorIndex.value])

let animationInterval = null

onMounted(() => {
  // Start the typing animation
  startTypingAnimation()
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})

const startTypingAnimation = () => {
  let currentText = ''
  let charIndex = 0
  let currentTextIndex = 0
  
  animationInterval = setInterval(() => {
    if (currentTextIndex < texts.length) {
      const targetText = texts[currentTextIndex]
      
      if (charIndex < targetText.length) {
        currentText += targetText[charIndex]
        intro.value = currentText
        charIndex++
      } else {
        // Move to next text after a pause
        setTimeout(() => {
          currentTextIndex++
          charIndex = 0
          currentText = ''
          colorIndex.value = (colorIndex.value + 1) % textColors.length
        }, 2000)
      }
    } else {
      // Animation complete
      if (animationInterval) {
        clearInterval(animationInterval)
      }
    }
  }, 50)
}
</script>

<style scoped>
.welcome-box {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
