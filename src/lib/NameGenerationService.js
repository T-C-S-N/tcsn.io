// AI Name Generation Service with Fallback Algorithm
import OpenAI from 'openai';

class NameGenerationService {
  constructor() {
    this.openai = null;
    this.initializeOpenAI();
    
    // Fallback name lists
    this.adjectives = [
      'Curious', 'Brave', 'Creative', 'Bright', 'Swift', 'Clever', 'Gentle', 'Noble',
      'Witty', 'Bold', 'Calm', 'Wise', 'Quick', 'Sharp', 'Smart', 'Cool', 'Lucky',
      'Happy', 'Cheerful', 'Friendly', 'Kind', 'Peaceful', 'Strong', 'Graceful',
      'Elegant', 'Radiant', 'Vibrant', 'Dynamic', 'Stellar', 'Cosmic', 'Digital',
      'Modern', 'Future', 'Neo', 'Ultra', 'Super', 'Mega', 'Alpha', 'Beta'
    ];
    
    this.animals = [
      'Fox', 'Wolf', 'Eagle', 'Dolphin', 'Tiger', 'Lion', 'Panda', 'Koala',
      'Owl', 'Hawk', 'Falcon', 'Raven', 'Phoenix', 'Dragon', 'Unicorn', 'Pegasus',
      'Bear', 'Deer', 'Rabbit', 'Cat', 'Dog', 'Horse', 'Turtle', 'Penguin',
      'Whale', 'Shark', 'Octopus', 'Butterfly', 'Bee', 'Hummingbird', 'Swan',
      'Leopard', 'Cheetah', 'Jaguar', 'Lynx', 'Otter', 'Beaver', 'Squirrel'
    ];
    
    this.professions = [
      'Explorer', 'Navigator', 'Inventor', 'Designer', 'Artist', 'Musician',
      'Writer', 'Poet', 'Dreamer', 'Thinker', 'Creator', 'Builder', 'Maker',
      'Seeker', 'Wanderer', 'Traveler', 'Adventurer', 'Pioneer', 'Innovator',
      'Philosopher', 'Scientist', 'Engineer', 'Architect', 'Guardian', 'Protector'
    ];
    
    this.mystical = [
      'Sage', 'Oracle', 'Mystic', 'Wizard', 'Mage', 'Seer', 'Prophet', 'Shaman',
      'Guardian', 'Keeper', 'Watcher', 'Sentinel', 'Herald', 'Messenger',
      'Spirit', 'Soul', 'Echo', 'Whisper', 'Shadow', 'Light', 'Star', 'Moon'
    ];
  }
  
  initializeOpenAI() {
    try {
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
      }
    } catch (error) {
      console.warn('OpenAI initialization failed:', error.message);
      this.openai = null;
    }
  }
  
  // Generate name using OpenAI
  async generateAIName(context = {}) {
    if (!this.openai) {
      console.warn('OpenAI not available, using fallback');
      return null;
    }
    
    try {
      const prompt = this.buildPrompt(context);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative name generator. Generate unique, friendly, and memorable names for website visitors. Return only the name, nothing else.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 50,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
      });
      
      const generatedName = response.choices[0]?.message?.content?.trim();
      
      if (generatedName && generatedName.length > 0 && generatedName.length < 50) {
        return generatedName;
      }
      
      return null;
      
    } catch (error) {
      console.error('OpenAI name generation failed:', error.message);
      return null;
    }
  }
  
  buildPrompt(context) {
    const { location, browser, timeOfDay, isReturn } = context;
    
    let prompt = 'Generate a creative, friendly name for a website visitor';
    
    if (location?.country) {
      prompt += ` from ${location.country}`;
    }
    
    if (timeOfDay) {
      prompt += ` visiting during ${timeOfDay}`;
    }
    
    if (browser?.browser) {
      prompt += ` using ${browser.browser}`;
    }
    
    if (isReturn) {
      prompt += '. This is a returning visitor, so make it welcoming.';
    } else {
      prompt += '. This is a new visitor, so make it inviting.';
    }
    
    prompt += ' The name should be 1-3 words, creative but professional, and memorable.';
    
    return prompt;
  }
  
  // Fallback algorithm for name generation
  generateFallbackName(context = {}) {
    const { location, browser, timeOfDay, isReturn, sessionId } = context;
    
    // Use session ID as seed for consistent names per session
    const seed = sessionId ? this.hashCode(sessionId) : Math.floor(Math.random() * 10000);
    
    // Different naming strategies
    const strategies = [
      () => this.animalStrategy(seed),
      () => this.professionStrategy(seed),
      () => this.locationStrategy(seed, location),
      () => this.timeStrategy(seed, timeOfDay),
      () => this.mysticalStrategy(seed),
      () => this.techStrategy(seed, browser)
    ];
    
    // Choose strategy based on seed
    const strategyIndex = Math.abs(seed) % strategies.length;
    const selectedStrategy = strategies[strategyIndex];
    
    return selectedStrategy();
  }
  
  animalStrategy(seed) {
    const adjIndex = Math.abs(seed) % this.adjectives.length;
    const animalIndex = Math.abs(seed * 3) % this.animals.length;
    return `${this.adjectives[adjIndex]} ${this.animals[animalIndex]}`;
  }
  
  professionStrategy(seed) {
    const adjIndex = Math.abs(seed * 2) % this.adjectives.length;
    const profIndex = Math.abs(seed * 5) % this.professions.length;
    return `${this.adjectives[adjIndex]} ${this.professions[profIndex]}`;
  }
  
  locationStrategy(seed, location) {
    if (location?.country) {
      const adjIndex = Math.abs(seed) % this.adjectives.length;
      const countryCode = location.country.slice(0, 3);
      return `${this.adjectives[adjIndex]} ${countryCode}Visitor`;
    }
    return this.animalStrategy(seed);
  }
  
  timeStrategy(seed, timeOfDay) {
    const timeAdjectives = {
      morning: ['Early', 'Dawn', 'Sunrise', 'Fresh'],
      afternoon: ['Noon', 'Bright', 'Sunny', 'Active'],
      evening: ['Dusk', 'Twilight', 'Evening', 'Calm'],
      night: ['Night', 'Moon', 'Star', 'Nocturnal']
    };
    
    const timeAdj = timeAdjectives[timeOfDay] || this.adjectives;
    const adjIndex = Math.abs(seed) % timeAdj.length;
    const animalIndex = Math.abs(seed * 7) % this.animals.length;
    
    return `${timeAdj[adjIndex]} ${this.animals[animalIndex]}`;
  }
  
  mysticalStrategy(seed) {
    const adjIndex = Math.abs(seed * 3) % this.adjectives.length;
    const mystIndex = Math.abs(seed * 11) % this.mystical.length;
    return `${this.adjectives[adjIndex]} ${this.mystical[mystIndex]}`;
  }
  
  techStrategy(seed, browser) {
    const techPrefixes = ['Digital', 'Cyber', 'Virtual', 'Online', 'Web', 'Net'];
    const prefixIndex = Math.abs(seed) % techPrefixes.length;
    const animalIndex = Math.abs(seed * 13) % this.animals.length;
    
    return `${techPrefixes[prefixIndex]} ${this.animals[animalIndex]}`;
  }
  
  // Hash function for consistent seeding
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
  
  // Main method to generate a name
  async generateName(context = {}) {
    // Try AI generation first
    const aiName = await this.generateAIName(context);
    if (aiName) {
      return {
        name: aiName,
        source: 'ai',
        generatedAt: new Date()
      };
    }
    
    // Fall back to algorithmic generation
    const fallbackName = this.generateFallbackName(context);
    return {
      name: fallbackName,
      source: 'fallback',
      generatedAt: new Date()
    };
  }
  
  // Generate multiple name options
  async generateNameOptions(context = {}, count = 3) {
    const options = [];
    
    // Try AI generation
    for (let i = 0; i < Math.min(count, 2); i++) {
      const aiName = await this.generateAIName(context);
      if (aiName) {
        options.push({
          name: aiName,
          source: 'ai',
          generatedAt: new Date()
        });
      }
    }
    
    // Fill remaining with fallback
    while (options.length < count) {
      const fallbackName = this.generateFallbackName({
        ...context,
        sessionId: context.sessionId + '_' + options.length // Vary the seed
      });
      
      options.push({
        name: fallbackName,
        source: 'fallback',
        generatedAt: new Date()
      });
    }
    
    return options;
  }
}

export default new NameGenerationService();
