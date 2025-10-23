import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router.js';
import App from './App.vue';
import './styles/globals.css';
import './assets/style/main.scss';
import { i18n, components, fontawesome } from '@/plugins';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(components);
app.component('FontAwesomeIcon', fontawesome);
app.component('Fa', fontawesome);

// Add global visitor tracking
app.config.globalProperties.$visitor = null;

app.mount('#app');
