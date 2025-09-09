import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.js'
import App from './App.vue'
import mongodbPlugin from './plugins/mongodb.js'
import './styles/globals.css'
import {testConnection} from './api/database.js'

testConnection().then(result => {
  console.log('Database connection test result:', result)
}).catch(error => {
  console.error('Error during database connection test:', error)
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(mongodbPlugin)

// Add global visitor tracking
app.config.globalProperties.$visitor = null;

app.mount('#app')
