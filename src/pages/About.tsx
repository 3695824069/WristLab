import { useTranslation } from 'react-i18next'
import {
  Flame,
  BookOpen,
  Activity,
  HelpCircle,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  User,
  Mail,
  MessageCircle,
  Briefcase,
  Send,
  Star,
} from 'lucide-react'

const problemKeys = ['about.problem_0', 'about.problem_1', 'about.problem_2', 'about.problem_3']

const features = [
  {
    icon: BookOpen,
    titleKey: 'about.featureCourse',
    descKey: 'about.featureCourseDesc',
  },
  {
    icon: Activity,
    titleKey: 'about.featureExercise',
    descKey: 'about.featureExerciseDesc',
  },
  {
    icon: HelpCircle,
    titleKey: 'about.featureKnowledge',
    descKey: 'about.featureKnowledgeDesc',
  },
  {
    icon: Calendar,
    titleKey: 'about.featurePlan',
    descKey: 'about.featurePlanDesc',
  },
  {
    icon: TrendingUp,
    titleKey: 'about.featureRecord',
    descKey: 'about.featureRecordDesc',
  },
]

const dutyKeys = ['about.duty_0', 'about.duty_1', 'about.duty_2']
const contactItemKeys = [
  'about.contactItem_0',
  'about.contactItem_1',
  'about.contactItem_2',
  'about.contactItem_3',
  'about.contactItem_4',
]
const coopItemKeys = [
  'about.coopItem_0',
  'about.coopItem_1',
  'about.coopItem_2',
  'about.coopItem_3',
  'about.coopItem_4',
]

export default function About() {
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
            {t('about.title')}
          </h1>
          <p className="text-green-400/80 text-sm sm:text-base mb-6 font-medium">
            {t('about.heroSubtitle')}
          </p>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {t('about.heroDesc')}
          </p>
        </div>
      </section>

      {/* ─── Why WristLab ─── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          {t('about.whyTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problems */}
          <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-sm font-semibold text-red-300">{t('about.problemLabel')}</h3>
            </div>
            <ul className="space-y-2.5">
              {problemKeys.map((key, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/50" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Goal */}
          <div className="rounded-xl border border-green-500/15 bg-green-500/5 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-green-400" />
              <h3 className="text-sm font-semibold text-green-300">{t('about.goalTitle')}</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{t('about.goalDesc')}</p>
          </div>
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('about.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-center hover:border-green-500/30 hover:bg-zinc-900/80 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{t(feat.titleKey)}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{t(feat.descKey)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:py-20 text-center">
          <Star className="h-8 w-8 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('about.missionTitle')}</h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t('about.missionDesc')}
          </p>
        </div>
      </section>

      {/* ─── Person in Charge ─── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          {t('about.personTitle')}
        </h2>
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400">
                <User className="h-7 w-7" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{t('about.personName')}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{t('contact.personRole')}</div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <div className="text-xs text-zinc-500 mb-2">{t('about.personResponsibility')}</div>
              <div className="flex flex-wrap gap-2">
                {dutyKeys.map((key, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
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

            {/* Contact hints */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">{t('about.personContactHint')}</p>
              <div className="flex flex-wrap gap-1.5">
                {contactItemKeys.map((key, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">{t('about.personWelcome')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cooperation ─── */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-400 mb-5">
            <Briefcase className="h-3.5 w-3.5" />
            {t('about.coopTitle')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('about.coopTitle')}</h2>
          <p className="text-zinc-500 text-sm mb-6">{t('about.coopDesc')}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {coopItemKeys.map((key, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-400"
              >
                {t(key)}
              </span>
            ))}
          </div>
          <a
            href={`mailto:${t('contact.businessEmail')}`}
            className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-2.5 text-sm font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
          >
            <Send className="h-4 w-4" />
            {t('about.coopButton')}
          </a>
        </div>
      </section>
    </div>
  )
}
