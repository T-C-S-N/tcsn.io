import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

// Get browser language or fallback to English
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  // Extract the language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0]
  
  // Check if we support this language
  const supportedLanguages = ['en', 'fr']
  return supportedLanguages.includes(langCode) ? langCode : 'en'
}

// Get stored language preference or use browser language
const getInitialLanguage = () => {
  const storedLang = localStorage.getItem('language')
  if (storedLang && ['en', 'fr'].includes(storedLang)) {
    return storedLang
  }
  return getBrowserLanguage()
}

const messages = {
  en,
  fr
}

const i18n = createI18n({
  legacy: false, // Use composition API
  locale: getInitialLanguage(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  warnHtmlMessage: false
})

// Function to change language
export const changeLanguage = (locale) => {
  if (messages[locale]) {
    i18n.global.locale.value = locale
    localStorage.setItem('language', locale)
    
    // Update document language attribute
    document.documentElement.lang = locale
    
    return true
  }
  return false
}

// Function to get current language
export const getCurrentLanguage = () => {
  return i18n.global.locale.value
}

// Function to get available languages
export const getAvailableLanguages = () => {
  return Object.keys(messages).map(key => ({
    code: key,
    name: key === 'en' ? 'English' : 'Français',
    flag: key === 'en' ? '🇺🇸' : '🇫🇷'
  }))
}

// Function to format message with parameters
export const formatMessage = (key, params = {}) => {
  let message = i18n.global.t(key)
  
  // Replace parameters in the message
  Object.keys(params).forEach(param => {
    message = message.replace(`{${param}}`, params[param])
  })
  
  return message
}

export default i18n
