import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flame } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-500 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold mb-2">
            <Flame className="h-5 w-5 text-green-500" />
            WristLab
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">{t('footer.brandDesc')}</p>
          <p className="text-xs text-zinc-600 mt-4">{t('footer.copyright', { year })}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-1.5">
            <li><Link to="/courses" className="hover:text-green-400 transition-colors text-xs">{t('footer.courseCenter')}</Link></li>
            <li><Link to="/exercises" className="hover:text-green-400 transition-colors text-xs">{t('footer.exerciseLib')}</Link></li>
            <li><Link to="/plans" className="hover:text-green-400 transition-colors text-xs">{t('footer.planCenter')}</Link></li>
            <li><Link to="/knowledge" className="hover:text-green-400 transition-colors text-xs">{t('footer.knowledgeBase')}</Link></li>
            <li><Link to="/records" className="hover:text-green-400 transition-colors text-xs">{t('footer.trainingRecords')}</Link></li>
            <li><Link to="/about" className="hover:text-green-400 transition-colors text-xs">{t('footer.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-green-400 transition-colors text-xs">{t('footer.contactUs')}</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-medium mb-3">{t('footer.about')}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">{t('footer.disclaimer')}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <Link to="/" className="hover:text-green-400 transition-colors">{t('footer.terms')}</Link>
            <span className="text-zinc-700">·</span>
            <Link to="/" className="hover:text-green-400 transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
