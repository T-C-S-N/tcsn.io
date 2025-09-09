import { createRouter, createWebHistory } from 'vue-router'
import VisitorTrackingService from '@/lib/VisitorTrackingService.js'
import VisitorAnalyticsService from '@/lib/VisitorAnalyticsService.js'
import handleShortUrlRedirect from '@/lib/ShortUrlRedirect.js'

const routes = [
  {
    path: '/',
    name: 'public.home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Home - TCSN.io' }
  },
  {
    path: '/contact',
    name: 'public.contact',
    component: () => import('@/views/Contact.vue'),
    meta: { title: 'Contact - TCSN.io' }
  },
  {
    path: '/projects',
    name: 'public.projects',
    component: () => import('@/views/Projects.vue'),
    meta: { title: 'Projects - TCSN.io' }
  },
  {
    path: '/projects/:id',
    name: 'public.project.details',
    component: () => import('@/views/ProjectDetail.vue'),
    props: true,
    meta: { title: 'Project Details - TCSN.io' }
  },
  {
    path: '/memos',
    name: 'public.memos',
    component: () => import('@/views/Memos.vue'),
    meta: { title: 'Memos - TCSN.io' }
  },
  {
    path: '/message-for-you',
    name: 'public.message.for.you',
    component: () => import('@/views/MessageForYou.vue'),
    meta: { title: 'Message For You - TCSN.io' }
  },
  {
    path: '/visitor-demo',
    name: 'public.visitor.demo',
    component: () => import('@/components/VisitorTrackingDemo.vue'),
    meta: { title: 'Visitor Tracking Demo - TCSN.io' }
  },
  {
    path: '/visitor-dashboard',
    name: 'VisitorDashboard',
    component: () => import('@/views/visitor/Dashboard.vue'),
    meta: { title: 'Visitor Dashboard - TCSN.io' }
  },
  {
    path: '/analytics',
    name: 'public.analytics',
    component: () => import('@/components/VisitorAnalyticsDashboard.vue'),
    meta: { title: 'Analytics Dashboard - TCSN.io' }
  },
  {
    path: '/url-shortener',
    name: 'public.url-shortener',
    component: () => import('@/components/UrlShortenerDashboard.vue'),
    meta: { title: 'URL Shortener - TCSN.io' }
  },

  // Short URL redirect route
  {
    path: '/s/:shortCode',
    name: 'short-url-redirect',
    beforeEnter: async (to, from, next) => {
      const shortCode = to.params.shortCode;
      const referrer = from.fullPath !== '/' ? from.fullPath : document.referrer;
      
      try {
        console.log(`🔗 Processing short URL: ${shortCode}`);
        
        // Handle the redirect through our service
        await handleShortUrlRedirect(shortCode, referrer);
        
        // The redirect happens in the service, so we don't call next()
        // If we reach here, there was an error
        next('/404?error=redirect-failed');
        
      } catch (error) {
        console.error('Short URL redirect error:', error);
        next('/404?error=short-url-error');
      }
    }
  },

  // Admin routes
  {
    path: '/admin/auth',
    name: 'admin.login',
    component: () => import('@/views/admin/Auth.vue'),
    meta: { title: 'Admin Login - TCSN.io' }
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: 'Admin Dashboard - TCSN.io', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404 - Page Not Found' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

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

export default router
