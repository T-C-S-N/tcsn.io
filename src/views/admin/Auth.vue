<template>
  <div class="admin-login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo">
          <h1>🔐 TCSN Admin</h1>
        </div>
        <p class="subtitle">
          Administrator Portal
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="loading-section"
      >
        <div class="spinner" />
        <p>Initializing...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="error-section"
      >
        <div class="error-icon">
          ❌
        </div>
        <h3>Authentication Error</h3>
        <p>{{ error }}</p>
        <button
          class="retry-btn"
          @click="retryLogin"
        >
          🔄 Try Again
        </button>
      </div>

      <!-- Login Form -->
      <div
        v-else
        class="login-section"
      >
        <div class="welcome-text">
          <h2>Welcome Back</h2>
          <p>Sign in with your Google account to access the admin dashboard</p>
        </div>

        <!-- Google Sign-In Button Container -->
        <div class="google-signin-container">
          <div
            id="google-signin-button"
            class="google-button-wrapper"
          />
          
          <!-- Fallback Button (shows when Google button fails to load) -->
          <div
            v-if="showFallbackButton"
            class="fallback-button-container"
          >
            <div class="fallback-button disabled">
              <span class="google-icon">🔒</span>
              <span>Sign in with Google</span>
              <small>(Button disabled due to OAuth configuration)</small>
            </div>
            <p class="fallback-text">
              The Google Sign-In button cannot load due to origin restrictions.
              Please follow the instructions below to fix this.
            </p>
          </div>
          
          <!-- Loading State -->
          <div
            v-if="isLoading && !showOriginError && !showFallbackButton"
            class="button-loading"
          >
            <div class="spinner-small" />
            <span>Loading Google Sign-In...</span>
          </div>
          
          <!-- Debug Information (Development Only) -->
          <div
            v-if="error || showOriginError"
            class="error-debug"
          >
            <div class="error-title">
              ⚠️ Authentication Issue
            </div>
            <div class="error-details">
              <div
                v-if="showOriginError || (error && error.includes('origin'))"
                class="origin-error"
              >
                <p>
                  <strong>🔒 Google OAuth Origin Not Authorized</strong><br>
                  The origin <code>http://localhost:3000</code> needs to be added to your Google Cloud Console.
                </p>
                <div class="fix-steps">
                  <h5>Quick Fix Steps:</h5>
                  <ol>
                    <li>
                      Go to <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                      >Google Cloud Console</a>
                    </li>
                    <li>Find OAuth client: <code>66286687898-8heqdjcdknvu1talgskboclfipunspm3</code></li>
                    <li>Add to <strong>Authorized JavaScript origins</strong>: <code>http://localhost:3000</code></li>
                    <li>Add to <strong>Authorized redirect URIs</strong>: <code>http://localhost:3000/admin/login</code></li>
                    <li>Save and refresh this page</li>
                  </ol>
                </div>
              </div>
              <p v-if="error && error.includes('too early')">
                <strong>Clock Sync Issue:</strong> Check your system time or try refreshing the page.
              </p>
              <p v-if="error && error.includes('CORS')">
                <strong>CORS Issue:</strong> Make sure the API server is running on port 3002.
              </p>
              <details class="error-full">
                <summary>Full Error Details</summary>
                <pre>{{ error }}</pre>
              </details>
            </div>
            .retry-button:hover {
            background: #1d4ed8;
            }

            .debug-button {
            margin-left: 8px;
            padding: 8px 16px;
            background: #059669;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s;
            }

            .debug-button:hover {
            background: #047857;
            }            <!-- Debug button for testing -->
            <button
              class="debug-button"
              @click="debugGoogleButton"
            >
              🔍 Debug Google Button
            </button>
          </div>
        </div>

        <!-- Alternative Message -->
        <div class="auth-info">
          <div class="info-box">
            <div class="info-icon">
              ℹ️
            </div>
            <div class="info-content">
              <h4>Administrator Access Only</h4>
              <p>Only authorized email addresses can access this admin panel. Contact the system administrator if you need access.</p>
            </div>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="security-notice">
          <div class="security-icon">
            🔒
          </div>
          <div class="security-text">
            <small>
              Your login is secured with Google OAuth 2.0 and JWT tokens. 
              Sessions expire after 24 hours for security.
            </small>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <div class="footer-links">
          <a
            href="/"
            class="back-link"
          >← Back to Website</a>
          <span class="divider">|</span>
          <a
            href="/contact"
            class="contact-link"
          >Need Help?</a>
        </div>
        <div class="footer-text">
          <small>&copy; 2025 TCSN.io - Admin Portal</small>
        </div>
      </div>
    </div>

    <!-- Background Pattern -->
    <div class="background-pattern" />
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue';
import { useGoogleAuth } from '@/composables/useGoogleAuth.js';

// Reactive variables
const showOriginError = ref(false);
const showFallbackButton = ref(false);

// Use Google authentication
const {
  isAuthenticated,
  isLoading,
  error,
  initializeSignInButton,
  verifyToken
} = useGoogleAuth();

// Listen for Google Sign-In errors
const setupGoogleErrorListener = () => {
  // Listen for GSI_LOGGER errors in console
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    if (errorMessage.includes('origin is not allowed') || 
        errorMessage.includes('origin_mismatch')) {
      showOriginError.value = true;
    }
    originalConsoleError.apply(console, args);
  };
  
  // Also check for GSI_LOGGER messages
  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data === 'string') {
      if (event.data.includes('origin is not allowed') ||
          event.data.includes('origin_mismatch')) {
        showOriginError.value = true;
      }
    }
  });
};

// Initialize Google Sign-In button
const initializeGoogleButton = async () => {
  try {
    await nextTick(); // Wait for DOM to be ready
    
    // Check if the button container exists
    const buttonContainer = document.getElementById('google-signin-button');
    if (!buttonContainer) {
      console.error('Google button container not found');
      showFallbackButton.value = true;
      return;
    }
    
    console.log('Initializing Google Sign-In button...');
    await initializeSignInButton('google-signin-button');
    
    // Check if the button was actually rendered
    setTimeout(() => {
      const buttonContent = buttonContainer.innerHTML;
      if (!buttonContent || buttonContent.trim() === '') {
        console.log('Google button failed to render - showing fallback');
        showFallbackButton.value = true;
        showOriginError.value = true;
      } else {
        console.log('Google button rendered successfully');
      }
    }, 2000); // Give it 2 seconds to render
    
  } catch (err) {
    console.error('Failed to initialize Google button:', err);
    showFallbackButton.value = true;
    
    // Check if it's an origin error
    if (err.message && (err.message.includes('origin') || err.message.includes('mismatch'))) {
      showOriginError.value = true;
    }
  }
};

// Retry login initialization
const retryLogin = () => {
  window.location.reload();
};

// Debug function to check Google button state
const debugGoogleButton = () => {
  const buttonContainer = document.getElementById('google-signin-button');
  console.log('=== Google Button Debug ===');
  console.log('Button container:', buttonContainer);
  console.log('Container innerHTML:', buttonContainer?.innerHTML);
  console.log('Window.google available:', !!window.google);
  console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log('Current errors:', error.value);
  console.log('Show origin error:', showOriginError.value);
  console.log('Show fallback button:', showFallbackButton.value);
  console.log('============================');
};

// Check if user is already authenticated
const checkAuthStatus = () => {
  if (isAuthenticated.value) {
    // Redirect to dashboard if already logged in
    window.location.href = '/admin/dashboard';
  }
};

onMounted(async () => {
  // Setup error listeners first
  setupGoogleErrorListener();
  
  // Check authentication status first
  await verifyToken();
  checkAuthStatus();
  
  // Initialize Google button if not authenticated
  if (!isAuthenticated.value) {
    await initializeGoogleButton();
  }
});
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
  background-size: 100px 100px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.2);
  max-width: 450px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo h1 {
  margin: 0;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  margin: 8px 0 0 0;
  font-size: 16px;
}

.loading-section {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-section {
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-section h3 {
  color: #dc2626;
  margin-bottom: 12px;
}

.error-section p {
  color: #6b7280;
  margin-bottom: 20px;
}

/* Origin Error Specific Styles */
.origin-error {
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.origin-error p {
  margin: 0 0 12px 0;
  color: #92400e;
  font-weight: 500;
}

.fix-steps {
  background: #fffbeb;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #f59e0b;
}

.fix-steps h5 {
  margin: 0 0 8px 0;
  color: #92400e;
  font-size: 14px;
  font-weight: 600;
}

.fix-steps ol {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.4;
}

.fix-steps li {
  margin-bottom: 4px;
  color: #78350f;
}

.fix-steps a {
  color: #1d4ed8;
  text-decoration: underline;
  font-weight: 500;
}

.fix-steps a:hover {
  color: #1e40af;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #b91c1c;
}

.login-section {
  text-align: center;
}

.welcome-text {
  margin-bottom: 30px;
}

.welcome-text h2 {
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 24px;
}

.welcome-text p {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
}

.google-signin-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.google-button-wrapper {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  border-radius: 8px;
  overflow: hidden;
}

.auth-info {
  margin: 30px 0;
}

.info-box {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 12px;
  text-align: left;
}

.info-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 8px 0;
  color: #1e40af;
  font-size: 16px;
}

.info-content p {
  margin: 0;
  color: #1e40af;
  font-size: 14px;
  line-height: 1.4;
}

.security-notice {
  margin-top: 30px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  text-align: left;
}

.security-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.security-text {
  flex: 1;
}

.security-text small {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.login-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.footer-links {
  margin-bottom: 12px;
}

.footer-links a {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #2563eb;
}

.divider {
  margin: 0 12px;
  color: #d1d5db;
}

.footer-text {
  color: #9ca3af;
  font-size: 12px;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .logo h1 {
    font-size: 24px;
  }
  
  .welcome-text h2 {
    font-size: 20px;
  }
  
  .info-box {
    flex-direction: column;
    text-align: center;
  }
  
  .security-notice {
    flex-direction: column;
    text-align: center;
  }
}

/* Google button custom styling */
:deep(.google-button-wrapper iframe) {
  border-radius: 8px !important;
}

/* Fallback Button Styles */
.fallback-button-container {
  margin: 20px 0;
  text-align: center;
}

.fallback-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #f3f4f6;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  cursor: not-allowed;
  opacity: 0.7;
  transition: all 0.2s;
}

.fallback-button.disabled {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.fallback-button .google-icon {
  font-size: 20px;
}

.fallback-button small {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.fallback-text {
  margin-top: 12px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

/* Button Loading State */
.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: #6b7280;
  font-size: 14px;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Google Sign-In Container */
.google-signin-container {
  margin: 20px 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.google-button-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
