<template>
  <div class="min-h-screen w-full overflow-hidden bg-black">
    <div class="relative min-h-screen w-full">
      <div class="relative bg-black w-full h-screen overflow-hidden crt-monitor">
        <div class="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-900 opacity-5"></div>
        <div class="absolute inset-0 scanlines"></div>
        
        <VisitorInfo />
        
        <div 
          class="relative p-2 md:p-4 bg-black h-full font-mono text-green-400 crt-glow overflow-y-auto cursor-text"
          @click="focusTerminal"
        >
          <div v-if="showBootSequence" class="text-xs leading-relaxed">
            <div v-for="(line, index) in bootLines" :key="index" 
                 class="opacity-0 animate-fade-in-up"
                 :style="{ animationDelay: index * 100 + 'ms' }">
              <span class="text-green-600">[{{ String(index + 1).padStart(4, '0') }}]</span> 
              <span class="text-green-400">{{ line }}</span>
            </div>
          </div>
          
          <div v-if="showMainContent" class="flex flex-col h-full">
            <div class="flex-1 flex items-center justify-center">
              <div class="ascii-logo font-mono text-sm md:text-base leading-tight text-center">
                <div 
                  v-for="(line, lineIndex) in displayedLogo" 
                  :key="lineIndex"
                  class="text-green-400 opacity-0 animate-fade-in-up crt-text whitespace-pre"
                  :style="{ animationDelay: lineIndex * 100 + 'ms' }"
                >{{ line }}</div>
              </div>
            </div>
            
            <div v-if="showTerminal" class="flex-shrink-0 pb-4">
              <div v-for="(cmd, index) in commandHistory" :key="index" class="mb-2">
                <div class="text-green-400">
                  <span class="text-green-600">{{ visitorStore.promptText }}</span> {{ cmd.command }}
                </div>
                <div v-if="cmd.output" class="text-green-300 ml-4 whitespace-pre-line">{{ cmd.output }}</div>
              </div>
              
              <div class="flex items-center">
                <span class="text-green-600">{{ visitorStore.promptText }}</span>
                <input 
                  ref="terminalInput"
                  v-model="currentCommand"
                  @keyup.enter="executeCommand"
                  @keyup.tab.prevent="handleTab"
                  @keydown.up.prevent="navigateHistory(-1)"
                  @keydown.down.prevent="navigateHistory(1)"
                  class="flex-1 ml-2 bg-transparent border-none outline-none text-green-400 font-mono caret-green-400"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                />
                <span class="text-green-400 animate-pulse">█</span>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useVisitorStore } from '@/stores/visitorStore.js'
import VisitorInfo from '@/components/VisitorInfo.vue'

const visitorStore = useVisitorStore()
const displayedLogo = ref([])
const showBootSequence = ref(false)
const showTerminal = ref(false)
const showMainContent = ref(false)
const terminalInput = ref(null)
const currentCommand = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)

const commands = {
  help: 'Available commands:\\n  help - Show this help\\n  about - About TCSN\\n  skills - List technical skills\\n  projects - Show projects\\n  contact - Contact information\\n  clear - Clear terminal\\n  whoami - Display user info\\n  name - Set your name\\n  stats - Show session statistics\\n  browser - Show browser information',
  about: 'TCSN - Full-Stack Developer\\nSpecializing in modern web applications\\nwith cutting-edge technologies.',
  skills: 'Technical Skills:\\n• Frontend: Vue 3, JavaScript ES6+, Tailwind CSS\\n• Backend: Cloudflare Workers, Node.js\\n• Database: Cloudflare D1, MongoDB\\n• Cloud: Cloudflare Edge Computing\\n• Tools: Git, Vite, Docker',
  projects: 'Projects:\\n• Portfolio Site - Vue 3 + Cloudflare\\n• URL Shortener - Edge Computing\\n• Analytics Dashboard - Real-time data\\n• AI Integration Suite - OpenAI API',
  contact: 'Contact Information:\\n• Email: hello@tcsn.io\\n• Location: Brussels, Belgium\\n• Available: Remote Worldwide',
  whoami: () => {
    const visitor = visitorStore.visitor
    return `User: ${visitorStore.displayName}\\nVisitor ID: ${visitor.id}\\nVisit Count: ${visitor.visitCount}\\nSession Time: ${visitorStore.sessionTimeFormatted}\\nTotal Time: ${visitorStore.totalTimeFormatted}\\nReturning Visitor: ${visitorStore.isReturningVisitor ? 'Yes' : 'No'}`
  },
  stats: () => {
    const visitor = visitorStore.visitor
    return `Session Statistics:\\n• Current Session: ${visitorStore.sessionTimeFormatted}\\n• Total Time Spent: ${visitorStore.totalTimeFormatted}\\n• Visit Count: ${visitor.visitCount}\\n• Interactions: ${visitor.interactions.length}\\n• Last Visit: ${visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleString() : 'First visit'}`
  },
  browser: () => {
    const browser = visitorStore.visitor.browserData
    return `Browser Information:\\n• Platform: ${browser.platform}\\n• Language: ${browser.language}\\n• Screen: ${browser.screenWidth}x${browser.screenHeight}\\n• Viewport: ${browser.viewportWidth}x${browser.viewportHeight}\\n• Connection: ${browser.connectionEffectiveType}\\n• Timezone: ${browser.timezone}\\n• Memory: ${browser.deviceMemory}GB\\n• CPU Cores: ${browser.hardwareConcurrency}`
  },
  clear: 'CLEAR_TERMINAL',
  name: 'Please enter your name after the command:\\nExample: name John'
}

const executeCommand = async () => {
  const fullCommand = currentCommand.value.trim()
  const command = fullCommand.toLowerCase()
  
  if (fullCommand) {
    let output = ''
    
    visitorStore.addInteraction('command_executed', { command: fullCommand })
    
    if (command.startsWith('name ')) {
      const name = fullCommand.slice(5).trim()
      if (name) {
        await visitorStore.setVisitorName(name)
        output = `Welcome ${name}! Your prompt has been updated.\\nYour name has been saved and will be remembered on future visits.`
      } else {
        output = 'Please provide a name. Example: name John'
      }
    } else if (typeof commands[command] === 'function') {
      output = commands[command]()
    } else {
      output = commands[command] || `Command not found: ${command}\\nType 'help' for available commands.`
    }
    
    commandHistory.value.push({
      command: fullCommand,
      output: output.replace(/\\\\n/g, '\n')
    })
    
    if (command === 'clear') {
      commandHistory.value = []
    }
    
    currentCommand.value = ''
    historyIndex.value = -1
    
    nextTick(() => {
      if (terminalInput.value) {
        terminalInput.value.focus()
        terminalInput.value.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
}

const navigateHistory = (direction) => {
  const history = commandHistory.value.map(cmd => cmd.command)
  if (history.length === 0) return
  
  historyIndex.value += direction
  if (historyIndex.value < -1) historyIndex.value = -1
  if (historyIndex.value >= history.length) historyIndex.value = history.length - 1
  
  if (historyIndex.value === -1) {
    currentCommand.value = ''
  } else {
    currentCommand.value = history[history.length - 1 - historyIndex.value]
  }
}

const handleTab = () => {
  const command = currentCommand.value.toLowerCase()
  const availableCommands = Object.keys(commands)
  const matches = availableCommands.filter(cmd => cmd.startsWith(command))
  
  if (matches.length === 1) {
    currentCommand.value = matches[0]
  }
}

const focusTerminal = () => {
  if (showTerminal.value && terminalInput.value) {
    visitorStore.addInteraction('terminal_focused')
    nextTick(() => {
      terminalInput.value.focus()
    })
  }
}

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
  'Initializing logo display...',
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
  visitorStore.initializeVisitor()
  visitorStore.addInteraction('page_loaded', { page: 'home' })
  startCRTSequence()
})

onUnmounted(() => {
  visitorStore.endSession()
})

const startCRTSequence = () => {
  showBootSequence.value = true
  
  setTimeout(() => {
    showBootSequence.value = false
    showMainContent.value = true
    
    setTimeout(() => {
      animateAsciiLogo()
    }, 100)
    
    setTimeout(() => {
      showTerminal.value = true
      
      const welcomeMessage = visitorStore.isReturningVisitor 
        ? `Welcome back, ${visitorStore.displayName}!\\nThis is visit #${visitorStore.visitor.visitCount}.\\nYour total time spent: ${visitorStore.totalTimeFormatted}`
        : 'Welcome to TCSN Terminal!\\nType "name YourName" to personalize your experience.'
      
      commandHistory.value.push({
        command: '',
        output: `${welcomeMessage}\\nType "help" for available commands.`.replace(/\\\\n/g, '\n')
      })
      
      visitorStore.addInteraction('terminal_ready')
      
      nextTick(() => {
        if (terminalInput.value) {
          terminalInput.value.focus()
        }
      })
    }, (asciiLogo.length * 100) + 500)
    
  }, bootLines.length * 100 + 300)
}

const animateAsciiLogo = () => {
  let currentLine = 0
  const interval = setInterval(() => {
    if (currentLine < asciiLogo.length) {
      displayedLogo.value.push(asciiLogo[currentLine])
      currentLine++
    } else {
      clearInterval(interval)
      visitorStore.addInteraction('logo_animation_complete')
    }
  }, 150)
}
</script>

<style scoped>
.ascii-logo {
  font-family: 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 10px #00ff00;
}

.crt-monitor {
  background: radial-gradient(ellipse at center, #001100 0%, #000000 70%);
}

.crt-glow {
  text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00;
}

.crt-text {
  filter: blur(0.5px);
  text-shadow: 0 0 5px #00ff00;
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
