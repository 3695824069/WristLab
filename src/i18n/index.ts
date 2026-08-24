import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

// Detect browser language
const getInitialLanguage = (): string => {
  // 1. Check localStorage
  const stored = localStorage.getItem('wristlab_language')
  if (stored === 'zh-CN' || stored === 'en-US') return stored

  // 2. Check browser language
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || ''
  if (browserLang.startsWith('zh')) return 'zh-CN'

  // 3. Default to Chinese
  return 'zh-CN'
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false, // React already escapes output
  },
  returnObjects: false,
})

// Persist language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('wristlab_language', lng)
  // Set HTML lang attribute
  document.documentElement.lang = lng === 'en-US' ? 'en' : 'zh-CN'
})

export default i18n
