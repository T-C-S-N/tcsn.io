import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue'),
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    props: true,
  },
  {
    path: '/memos',
    name: 'Memos',
    component: () => import('@/views/Memos.vue'),
  },
  {
    path: '/message-for-you',
    name: 'MessageForYou',
    component: () => import('@/views/MessageForYou.vue'),
  },
  {
    path: '/database-test',
    name: 'DatabaseTest',
    component: () => import('@/views/DatabaseTest.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
