import { createRouter, createWebHistory } from 'vue-router';
import VisitorTrackingService from '@/lib/VisitorTrackingService.js';
import VisitorAnalyticsService from '@/lib/VisitorAnalyticsService.js';

const routes = [
  {
    path: '/stars',
    name: 'stars',
    component: () => import('@/views/Stars.vue'),
    meta: { title: 'Stars' }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'tcsn' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: 'About tcsn' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/Contact.vue'),
    meta: { title: 'Contact tcsn' }
  },
  {
    path: '/ai-chat',
    name: 'ai-chat',
    component: () => import('@/views/AIChat.vue'),
    meta: { title: 'AI Chat - tcsn.io' }
  },
  //{
  //  path: '/projects',
  //  name: 'public.projects',
  //  component: () => import('@/views/Projects.vue'),
  //  meta: { title: 'Projects - tcsn.io' }
  //},
  //{
  //  path: '/projects/:id',
  //  name: 'public.project.details',
  //  component: () => import('@/views/ProjectDetail.vue'),
  //  props: true,
  //  meta: { title: 'Project Details - tcsn.io' }
  //},
  //{
  //  path: '/memos',
  //  name: 'public.memos',
  //  component: () => import('@/views/Memos.vue'),
  //  meta: { title: 'Memos - tcsn.io' }
  //},
  {
    path: '/message-for-you',
    name: 'public.message.for.you',
    component: () => import('@/views/MessageForYou.vue'),
    meta: { title: 'Message For You - tcsn.io' }
  },
  {
    path: '/visitor-demo',
    name: 'public.visitor.demo',
    component: () => import('@/components/VisitorTrackingDemo.vue'),
    meta: { title: 'Visitor Tracking Demo - tcsn.io' }
  },
  {
    path: '/visitor-dashboard',
    name: 'VisitorDashboard',
    component: () => import('@/views/visitor/Dashboard.vue'),
    meta: { title: 'Visitor Dashboard - tcsn.io' }
  },
  {
    path: '/analytics',
    name: 'public.analytics',
    component: () => import('@/components/VisitorAnalyticsDashboard.vue'),
    meta: { title: 'Analytics Dashboard - tcsn.io' }
  },

  // Admin routes
  {
    path: '/admin/auth',
    name: 'admin.login',
    component: () => import('@/views/admin/Auth.vue'),
    meta: { title: 'Admin Login - tcsn.io' }
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: 'Admin Dashboard - tcsn.io', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404 - Page Not Found' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation tracking
router.beforeEach(async (to, from, next) => {
  // Update page title if specified
  if (to.meta?.title) {
    document.title = to.meta.title;
  }
  next();
});

router.afterEach(async (to, from) => {
  // Track page visit after navigation
  try {
    // Basic page visit tracking
    await VisitorTrackingService.trackPageVisit(to.path, to.meta?.title || document.title);
    console.log('📄 Page tracked:', to.path);

    // Enhanced analytics tracking
    const storedVisitor = VisitorTrackingService.getStoredVisitor();
    if (storedVisitor) {
      VisitorAnalyticsService.onPageChange(
        to,
        from,
        storedVisitor.visitorId,
        storedVisitor.sessionId
      );
    }
  } catch (error) {
    console.warn('Page tracking failed:', error.message);
  }
});

export default router;
