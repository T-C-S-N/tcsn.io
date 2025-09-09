# TCSN.io - Vue 3 + Vite Migration

This project has been migrated from Next.js/React to Vue 3 + Vite with the following modern stack:

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vitest** - Blazing fast unit test framework
- **Pinia** - Intuitive state management for Vue
- **Vue Router** - Official router for Vue.js
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

```
src/
├── main.ts              # Application entry point
├── App.vue              # Root component
├── router/
│   └── index.ts         # Vue Router configuration
├── stores/
│   └── projects.ts      # Pinia store for projects
├── views/               # Page components
│   ├── Home.vue
│   ├── Contact.vue
│   ├── Projects.vue
│   ├── ProjectDetail.vue
│   └── NotFound.vue
├── components/          # Reusable components (to be migrated)
└── __tests__/           # Test files
```

## 🚀 Getting Started

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
npm run test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📦 Dependencies Installed

### Core Dependencies
- `vue` - Vue 3 framework
- `vue-router` - Official routing
- `pinia` - State management
- `@vueuse/core` - Collection of essential Vue composition utilities

### Development Dependencies
- `@vitejs/plugin-vue` - Vite Vue plugin
- `vitest` - Testing framework
- `@vue/test-utils` - Vue testing utilities
- `vue-tsc` - TypeScript support for Vue
- `eslint` + Vue ESLint configs - Code linting
- `prettier` - Code formatting

## 🔄 Migration Status

### ✅ Completed
- [x] Basic project structure setup
- [x] Vue 3 + Vite configuration
- [x] Pinia store setup (replacing Redux)
- [x] Vue Router setup (replacing Next.js routing)
- [x] Basic views created (Home, Contact, Projects, ProjectDetail, 404)
- [x] TypeScript configuration
- [x] Testing setup with Vitest
- [x] ESLint + Prettier configuration
- [x] Tailwind CSS preserved

### 🚧 To Be Migrated
- [ ] Convert React components to Vue components
- [ ] Migrate API routes (consider separate backend or use Vite proxy)
- [ ] Convert React hooks to Vue composables
- [ ] Migrate authentication system
- [ ] Convert Three.js components to work with Vue
- [ ] Update styling and CSS modules if needed
- [ ] Migrate any remaining business logic

## 🛠 Development Tips

1. **State Management**: Use Pinia stores instead of Redux slices
2. **Composition API**: Prefer `<script setup>` syntax for components
3. **Reactivity**: Use `ref()` and `reactive()` for reactive data
4. **Router**: Use `useRouter()` and `useRoute()` composables
5. **Testing**: Write tests using Vitest and Vue Test Utils

## 🔗 Key Differences from Next.js/React

- **Routing**: File-based routing → Vue Router configuration
- **State**: Redux → Pinia stores
- **Components**: JSX → Vue SFCs (Single File Components)
- **Hooks**: React hooks → Vue composables
- **SSR**: Next.js SSR → Consider Nuxt.js if SSR is needed

## 📚 Useful Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
