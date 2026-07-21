import { useTranslation } from 'react-i18next'
import {
  Mail,
  MessageCircle,
  User,
  Send,
  Briefcase,
  ArrowLeft,
  Flame,
  MessageSquare,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const feedbackKeys = [
  'contact.feedbackItem_0',
  'contact.feedbackItem_1',
  'contact.feedbackItem_2',
  'contact.feedbackItem_3',
]
const businessKeys = [
  'contact.businessItem_0',
  'contact.businessItem_1',
  'contact.businessItem_2',
  'contact.businessItem_3',
]

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-zinc-950" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs text-green-400 mb-5">
            <Flame className="h-3.5 w-3.5" />
            WristLab
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* ─── Contact Grid ─── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Person in Charge */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-green-500/30 transition-all">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center text-green-400">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('contact.personInCharge')}</h3>
            </div>

            <div className="mb-5 pb-5 border-b border-zinc-800">
              <div className="text-base font-bold text-white mb-0.5">{t('contact.personName')}</div>
              <div className="text-xs text-zinc-500">{t('contact.personRole')}</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-zinc-400">{t('contact.email')}：</span>
                <a
                  href={`mailto:${t('contact.emailAddr')}`}
                  className="text-zinc-300 hover:text-green-400 transition-colors"
                >
                  {t('contact.emailAddr')}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-zinc-400">{t('contact.wechat')}：</span>
                <span className="text-zinc-300">{t('contact.wechatId')}</span>
              </div>
            </div>
          </div>

          {/* Submit Feedback */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-amber-500/30 transition-all flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('contact.submitFeedback')}</h3>
            </div>

            <p className="text-xs text-zinc-500 mb-3">{t('contact.feedbackIntro')}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {feedbackKeys.map((key, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 flex-shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                window.open(`mailto:${t('contact.emailAddr')}`, '_blank')
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all self-start"
            >
              <Send className="h-4 w-4" />
              {t('contact.submitFeedback')}
            </button>
          </div>

          {/* Business Cooperation */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-blue-500/30 transition-all flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t('contact.businessTitle')}</h3>
            </div>

            <p className="text-xs text-zinc-500 mb-3">{t('contact.businessIntro')}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {businessKeys.map((key, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 text-sm pt-4 border-t border-zinc-800">
              <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span className="text-zinc-400">{t('contact.email')}：</span>
              <a
                href={`mailto:${t('contact.businessEmail')}`}
                className="text-zinc-300 hover:text-green-400 transition-colors"
              >
                {t('contact.businessEmail')}
              </a>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('common.back')}
          </Link>
        </div>
      </section>
    </div>
  )
}
