import { useI18n } from 'vue-i18n'

/**
 * Composable for easy i18n usage with helper functions
 */
export function useTranslation() {
  const { t, locale, availableLocales } = useI18n()

  /**
   * Translate with parameters
   * @param {string} key - Translation key
   * @param {object} params - Parameters to replace in translation
   * @returns {string} Translated text
   */
  const translate = (key, params = {}) => {
    let translation = t(key)
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`{${param}}`, 'g')
      translation = translation.replace(regex, params[param])
    })
    
    return translation
  }

  /**
   * Get translated text for common UI elements
   */
  const ui = {
    loading: () => t('common.loading'),
    error: () => t('common.error'),
    success: () => t('common.success'),
    cancel: () => t('common.cancel'),
    confirm: () => t('common.confirm'),
    save: () => t('common.save'),
    close: () => t('common.close'),
    send: () => t('chatbot.send'),
    clear: () => t('chatbot.clear'),
    thinking: () => t('chatbot.thinking')
  }

  /**
   * Get current language info
   */
  const currentLanguage = {
    code: locale.value,
    isEnglish: locale.value === 'en',
    isFrench: locale.value === 'fr'
  }

  return {
    t,
    translate,
    ui,
    locale,
    availableLocales,
    currentLanguage
  }
}

/**
 * Composable for date/time formatting based on locale
 */
export function useDateTimeFormat() {
  const { locale } = useI18n()

  const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date))
  }

  const formatTime = (date, options = {}) => {
    return new Intl.DateTimeFormat(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(new Date(date))
  }

  const formatDateTime = (date, options = {}) => {
    return new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(new Date(date))
  }

  const formatRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
    const now = new Date()
    const target = new Date(date)
    const diff = target.getTime() - now.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (Math.abs(days) > 0) return rtf.format(days, 'day')
    if (Math.abs(hours) > 0) return rtf.format(hours, 'hour')
    if (Math.abs(minutes) > 0) return rtf.format(minutes, 'minute')
    return rtf.format(seconds, 'second')
  }

  return {
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime
  }
}
