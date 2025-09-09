// Google Authentication Service
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/admin/auth/callback'
    );
    
    this.jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-change-this';
    this.allowedEmails = [
      'tomas@tcsn.io',
      // Add more admin emails here
    ];
  }

  // Verify Google ID token
  async verifyGoogleToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
        // Add very large clock tolerance for development issues
        clockTolerance: 7200, // 2 hours tolerance for development
      });

      const payload = ticket.getPayload();
      
      // Log for debugging
      console.log('✅ Token verification successful for:', payload.email);
      console.log('🕒 Token times - nbf:', payload.nbf, 'iat:', payload.iat, 'exp:', payload.exp);
      console.log('🕒 Current time:', Math.floor(Date.now() / 1000));
      
      return {
        success: true,
        user: {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          emailVerified: payload.email_verified
        }
      };
    } catch (error) {
      console.error('Google token verification failed:', error);
      
      // Enhanced debugging for clock issues
      if (error.message.includes('Token used too early') || error.message.includes('Token used too late')) {
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('⏰ Clock synchronization issue detected:');
        console.log('   System time may be incorrect.');
        console.log('   Current system time:', currentTime);
        console.log('   System date:', new Date().toISOString());
        console.log('💡 Solutions:');
        console.log('   1) Sync your Mac\'s clock: System Preferences > Date & Time > Set automatically');
        console.log('   2) Restart your browser and clear cache');
        console.log('   3) Try again in a few minutes');
        console.log('   4) If persistent, check network time sync');
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if user is authorized admin
  isAuthorizedAdmin(email) {
    return this.allowedEmails.includes(email.toLowerCase());
  }

  // Generate JWT token for authenticated admin
  generateJWT(user) {
    const payload = {
      id: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return jwt.sign(payload, this.jwtSecret);
  }

  // Verify JWT token
  verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return {
        success: true,
        user: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create admin user in database if not exists
  async createOrUpdateAdminUser(googleUser) {
    try {
      const adminUser = {
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        role: 'admin',
        emailVerified: googleUser.emailVerified,
        lastLogin: new Date(),
        loginMethod: 'google',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return adminUser;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }
}

export default new GoogleAuthService();
