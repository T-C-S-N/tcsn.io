// Vue composable for Google Authentication
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';

export function useGoogleAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const error = ref(null);

  const COOKIE_NAME = 'tcsn_admin_token';
  const TOKEN_EXPIRY_DAYS = 1;

  // Initialize Google Sign-In
  const initializeGoogleSignIn = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          resolve(window.google);
        } else {
          reject(new Error('Google Sign-In failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'));
      };
      
      document.head.appendChild(script);
    });
  };

  // Handle Google Sign-In response
  const handleGoogleResponse = async (response) => {
    try {
      isLoading.value = true;
      error.value = null;

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.tcsn.io';
      const result = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'google-login',
          idToken: response.credential
        })
      });

      const data = await result.json();

      if (data.success) {
        // Store token in cookie
        Cookies.set(COOKIE_NAME, data.token, { 
          expires: TOKEN_EXPIRY_DAYS,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict'
        });

        user.value = data.user;
        isAuthenticated.value = true;
        
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        error.value = data.message;
        console.error('Login failed:', data.message);
      }
    } catch (err) {
      error.value = 'Login failed. Please try again.';
      console.error('Google login error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize Google Sign-In button
  const initializeSignInButton = async (elementId) => {
    try {
      await initializeGoogleSignIn();

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 280
        }
      );

      // Also initialize One Tap
      window.google.accounts.id.prompt();
    } catch (err) {
      error.value = 'Failed to initialize Google Sign-In';
      console.error('Google Sign-In initialization error:', err);
    }
  };

  // Verify existing token
  const verifyToken = async () => {
    try {
      const token = Cookies.get(COOKIE_NAME);
      
      if (!token) {
        isLoading.value = false;
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.tcsn.io';
      const result = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify-token',
          token: token
        })
      });

      const data = await result.json();

      if (data.success) {
        user.value = data.user;
        isAuthenticated.value = true;
      } else {
        // Token is invalid, remove it
        Cookies.remove(COOKIE_NAME);
      }
    } catch (err) {
      console.error('Token verification error:', err);
      Cookies.remove(COOKIE_NAME);
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.tcsn.io';
      await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout'
        })
      });

      // Clear local state
      user.value = null;
      isAuthenticated.value = false;
      Cookies.remove(COOKIE_NAME);

      // Google Sign-Out
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }

      // Redirect to login
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check authentication status on mount
  onMounted(() => {
    verifyToken();
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    initializeSignInButton,
    logout,
    verifyToken
  };
}
