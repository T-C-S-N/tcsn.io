import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.js'
import App from './App.vue'
import './styles/globals.css'
import './assets/style/main.scss'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, faHome, faEnvelope, faProjectDiagram, faChartLine, 
  faLink, faQrcode, faEye, faDownload, faPlus, faCopy, faTimes,
  faCheck, faExclamationTriangle, faInfo, faArrowRight, faBars,
  faSearch, faCog, faSignOutAlt, faCode, faLaptopCode, faBolt,
  faDatabase, faServer, faCube, faCloud, faLeaf, faToolbox,
  faRobot, faShieldAlt, faFolderOpen, faRocket, faLayerGroup,
  faLock, faIcons, faSun, faMoon, faStickyNote, faChevronRight,
  faMapMarkerAlt, faGlobe
} from '@fortawesome/free-solid-svg-icons'
import { 
  faGithub, faTwitter, faLinkedin, faVuejs, faJs, faCss3Alt,
  faSass, faCloudflare, faNodeJs, faGitAlt, faGoogle
} from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(
  faUser, faHome, faEnvelope, faProjectDiagram, faChartLine,
  faLink, faQrcode, faEye, faDownload, faPlus, faCopy, faTimes,
  faCheck, faExclamationTriangle, faInfo, faArrowRight, faBars,
  faSearch, faCog, faSignOutAlt, faCode, faLaptopCode, faBolt,
  faDatabase, faServer, faCube, faCloud, faLeaf, faToolbox,
  faRobot, faShieldAlt, faFolderOpen, faRocket, faLayerGroup,
  faLock, faIcons, faSun, faMoon, faStickyNote, faChevronRight,
  faMapMarkerAlt, faGlobe,
  faGithub, faTwitter, faLinkedin, faVuejs, faJs, faCss3Alt,
  faSass, faCloudflare, faNodeJs, faGitAlt, faGoogle
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Add global visitor tracking
app.config.globalProperties.$visitor = null

app.mount('#app')
