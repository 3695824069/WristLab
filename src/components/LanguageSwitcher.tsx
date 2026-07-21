import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language === 'en-US' ? 'en-US' : 'zh-CN'

  const toggle = () => {
    const next = current === 'zh-CN' ? 'en-US' : 'zh-CN'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      className="text-xs px-2 py-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
      title={current === 'zh-CN' ? 'Switch to English' : '切换到中文'}
    >
      {current === 'zh-CN' ? '🌐 EN' : '🌐 中文'}
    </button>
  )
}
