// Pinia stores are now modular - this file exports the main store setup
export * from './stores/project'

// You can also create a main store index if needed
import { createPinia } from 'pinia'

export const pinia = createPinia()