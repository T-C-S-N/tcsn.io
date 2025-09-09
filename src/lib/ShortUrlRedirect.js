// Short URL Redirect Handler - Handles /s/:shortCode redirects
import UrlShortenerService from '../lib/UrlShortenerService.js';

export default async function handleShortUrlRedirect(shortCode, referrer = '') {
  try {
    console.log(`🔗 Handling redirect for short code: ${shortCode}`);
    
    // Handle the click and get redirect URL
    const result = await UrlShortenerService.handleShortUrlClick(shortCode, referrer);
    
    if (result.success) {
      console.log(`↗️ Redirecting to: ${result.originalUrl}`);
      
      // Perform the redirect
      window.location.href = result.originalUrl;
      
      return result;
    } else {
      console.error('❌ Failed to handle short URL:', result.error);
      
      // Redirect to 404 or error page
      window.location.href = '/404?error=short-url-not-found';
      
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error in short URL redirect:', error);
    
    // Redirect to error page
    window.location.href = '/404?error=redirect-error';
    
    return {
      success: false,
      error: error.message
    };
  }
}
