<template>
  <div class="min-h-screen w-full overflow-hidden bg-background">
    <div class="relative min-h-screen w-full">
      <div class="relative bg-background w-full h-screen overflow-hidden crt-monitor">
        <div
          class="relative p-2 md:p-4 bg-background h-full font-mono text-green-400 crt-glow overflow-y-auto"
        >
          <!-- Boot Sequence -->
          <div v-if="showBootSequence" class="text-xs leading-relaxed">
            <div
              v-for="(line, index) in bootLines"
              :key="index"
              class="opacity-0 animate-fade-in-up boot-line"
              :style="{
                animationDelay: index * 50 + 'ms',
                '--wave-delay': index * 0.15 + 's',
                '--wave-duration': '3s'
              }"
            >
              <span class="text-green-600"
                >[{{ String(index + 1).padStart(4, '0') }}]</span
              >
              <span class="text-green-400">{{ line }}</span>
            </div>
          </div>

          <!-- ASCII Logo -->
          <div v-if="showMainContent" class="flex items-center justify-center h-full">
            <div
              class="ascii-logo font-mono text-sm md:text-base leading-tight text-center"
            >
              <div
                v-for="(line, lineIndex) in displayedLogo"
                :key="lineIndex"
                class="text-green-400 opacity-0 animate-fade-in-up logo-line whitespace-pre"
                :style="{ animationDelay: lineIndex * 100 + 'ms' }"
              >
                {{ line }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const displayedLogo = ref([])
const showBootSequence = ref(false)
const showMainContent = ref(false)

const bootLines = [
  'Initializing TCSN Development Environment...',
  'Loading kernel modules... [ OK ]',
  'Starting network services... [ OK ]',
  'Mounting file systems... [ OK ]',
  'Starting Docker daemon... [ OK ]',
  'Loading Node.js runtime... [ OK ]',
  'Connecting to database... [ OK ]',
  'Loading visitor data... [ OK ]',
  'Starting development server... [ OK ]',
  'All systems operational.',
  '',
  'Initializing logo display...'
]

const asciiLogo = [
  '╔═══════════════════════════════════════════════════════════╗',
  '║  ████████╗ ██████╗███████╗███╗   ██╗    ██╗ ██████╗       ║',
  '║  ╚══██╔══╝██╔════╝██╔════╝████╗  ██║   ██╔╝██╔═══██╗      ║',
  '║     ██║   ██║     ███████╗██╔██╗ ██║  ██╔╝ ██║   ██║      ║',
  '║     ██║   ██║     ╚════██║██║╚██╗██║ ██╔╝  ██║   ██║      ║',
  '║     ██║   ╚██████╗███████║██║ ╚████║██╔╝   ╚██████╔╝      ║',
  '║     ╚═╝    ╚═════╝╚══════╝╚═╝  ╚═══╝╚═╝     ╚═════╝       ║',
  '╚═══════════════════════════════════════════════════════════╝'
]

onMounted(() => {
  startSplashSequence()
})

const startSplashSequence = () => {
  showBootSequence.value = true

  setTimeout(() => {
    showBootSequence.value = false
    showMainContent.value = true

    setTimeout(() => {
      animateAsciiLogo()
    }, 0)
  }, bootLines.length * 0 + 0)
}

const animateAsciiLogo = () => {
  let currentLine = 0
  const interval = setInterval(() => {
    if (currentLine < asciiLogo.length) {
      displayedLogo.value.push(asciiLogo[currentLine])
      currentLine++
    } else {
      clearInterval(interval)
    }
  }, 0)
}
</script>

<style scoped>
.ascii-logo {
  font-family: 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: bold;
  letter-spacing: 1px;
  filter: drop-shadow(0 0 3px #00ff00);
}

.logo-line {
  text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
  animation: fade-in-up 0.6s ease-out forwards, logo-glow 3s ease-in-out infinite;
  animation-delay: 0s, 0.8s;
}

.crt-monitor {
  background: radial-gradient(ellipse at center, #001100 0%, #000000 70%);
}

.crt-glow {
  text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00;
  animation: glow-pulse 3s ease-in-out infinite;
}

.boot-line {
  animation: fade-in-up 0.6s ease-out forwards,
    boot-wave var(--wave-duration, 3s) ease-in-out infinite;
  animation-delay: var(--wave-delay), calc(var(--wave-delay) + 1.5s);
}

.crt-text {
  filter: blur(0.5px);
  text-shadow: 0 0 5px #00ff00;
  animation: text-glow 2s ease-in-out infinite;
}

.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 5px #00ff00;
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 2px #00ff00, 0 0 1px #00ff00;
  }
}

@keyframes logo-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
    filter: brightness(1);
  }
  50% {
    text-shadow: 0 0 8px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00;
    filter: brightness(1.15);
  }
}

@keyframes text-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #00ff00;
    filter: blur(0.5px);
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00;
    filter: blur(0.3px);
  }
}

@keyframes boot-wave {
  0%,
  100% {
    text-shadow: 0 0 3px #00ff00;
    color: #00ff00;
  }
  50% {
    text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
    color: #33ff33;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

input:focus {
  outline: none;
  border: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .ascii-logo {
    font-size: 0.7rem;
    line-height: 0.9;
  }

  .crt-glow {
    padding: 0.5rem;
  }
}

@media (max-width: 640px) {
  .ascii-logo {
    font-size: 0.6rem;
    line-height: 0.8;
  }
}
</style>
