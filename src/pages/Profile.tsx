import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Play, Dumbbell, ArrowRight, Pencil, X, Check, Phone, Mail, UserIcon, Flame, Trophy, Calendar, Camera, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getWorkoutStats, sendEmailCode as apiSendEmailCode, bindEmail as apiBindEmail, unbindEmail as apiUnbindEmail } from '../lib/api'
import { useFavorites } from '../hooks/useFavorites'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'

export default function Profile() {
  const { t } = useTranslation()
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [saving, setSaving] = useState(false)
  const [workoutStats, setWorkoutStats] = useState<{ total: number; weekCount: number; streak: number; checkedToday: boolean } | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Email binding state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [bindEmailInput, setBindEmailInput] = useState('')
  const [bindCodeInput, setBindCodeInput] = useState('')
  const [emailCountdown, setEmailCountdown] = useState(0)
  const [emailLoading, setEmailLoading] = useState(false)
  const [unbinding, setUnbinding] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.toastSelectImage'))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('profile.toastImageTooLarge'))
      return
    }

    setUploadingAvatar(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await updateProfile({ avatar: base64 })
      updateUser(res.data.user)
      toast.success(t('profile.toastAvatarSuccess'))
    } catch (err: unknown) {
      toast.error((err as Error).message || t('profile.toastAvatarFail'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const courses = favorites.filter(f => f.type === 'course')
  const exercises = favorites.filter(f => f.type === 'exercise')

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatsLoading(true)
      getWorkoutStats()
        .then(res => setWorkoutStats(res.data.stats))
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await updateProfile({ nickname })
      updateUser(res.data.user)
      setEditing(false)
      toast.success(t('profile.toastNicknameSuccess'))
    } catch (err: unknown) {
      toast.error((err as Error).message || t('profile.toastUpdateFail'))
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNickname(user?.nickname || '')
    setEditing(false)
  }

  // Email binding handlers
  const handleSendEmailCode = async () => {
    if (!bindEmailInput.includes('@')) {
      toast.error(t('profile.toastEmailInvalid'))
      return
    }
    if (emailCountdown > 0) return

    setEmailLoading(true)
    try {
      const res = await apiSendEmailCode(bindEmailInput.trim())
      if (res._dev_code) {
        toast.info(`验证码（开发模式）: ${res._dev_code}`, { duration: 10000 })
      } else {
        toast.success(t('profile.toastEmailCodeSent'))
      }
      setEmailCountdown(60)
      const timer = setInterval(() => {
        setEmailCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
    } catch (err: unknown) {
      toast.error((err as Error).message || t('profile.toastEmailCodeFail'))
    } finally {
      setEmailLoading(false)
    }
  }

  const handleBindEmail = async () => {
    if (!bindEmailInput.includes('@')) {
      toast.error(t('profile.toastEmailInvalid'))
      return
    }
    if (!bindCodeInput || bindCodeInput.length < 6) {
      toast.error(t('profile.toastCodeInvalid'))
      return
    }

    setEmailLoading(true)
    try {
      const res = await apiBindEmail(bindEmailInput.trim(), bindCodeInput)
      if (res.data?.user) {
        updateUser(res.data.user)
      }
      toast.success(t('profile.toastBindSuccess'))
      setEmailDialogOpen(false)
      setBindEmailInput('')
      setBindCodeInput('')
    } catch (err: unknown) {
      toast.error((err as Error).message || t('profile.toastBindFail'))
    } finally {
      setEmailLoading(false)
    }
  }

  const handleUnbindEmail = async () => {
    if (!confirm(t('profile.confirmUnbind'))) return
    setUnbinding(true)
    try {
      const res = await apiUnbindEmail()
      if (res.data?.user) {
        updateUser(res.data.user)
      }
      toast.success(t('profile.toastUnbindSuccess'))
    } catch (err: unknown) {
      toast.error((err as Error).message || t('profile.toastUnbindFail'))
    } finally {
      setUnbinding(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 mb-4">{t('profile.loginRequired')}</p>
          <Link to="/login" className="text-green-400 hover:text-green-300">
            {t('profile.goLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* User Profile Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-10 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                className="hidden"
              />
              {user.avatar ? (
                <img loading="lazy" src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                  {user.nickname ? user.nickname[0] : user.phone.slice(-2)}
                </div>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                title={t('profile.changeAvatar')}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    maxLength={20}
                    placeholder={t('profile.nicknamePlaceholder')}
                    autoFocus
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-white text-lg font-bold w-48 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-1.5 rounded-lg text-green-400 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold truncate">
                    {user.nickname || t('profile.noNickname')}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 rounded-lg text-zinc-500 hover:text-green-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
              </div>
              {/* Email section */}
              <div className="flex items-center gap-2 mt-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                {user.email ? (
                  <>
                    <span className="text-sm text-zinc-400">{user.email}</span>
                    <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{t('profile.emailBound')}</span>
                    <button
                      onClick={handleUnbindEmail}
                      disabled={unbinding}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {unbinding ? t('profile.unbinding') : t('profile.unbind')}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-zinc-600">{t('profile.emailUnbound')}</span>
                    <button
                      onClick={() => setEmailDialogOpen(true)}
                      className="text-xs text-green-400 hover:text-green-300 transition-colors"
                    >
                      {t('profile.bindEmail')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
            <Play className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-xs text-zinc-500">{t('profile.favoriteCourses')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
            <Dumbbell className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{exercises.length}</p>
            <p className="text-xs text-zinc-500">{t('profile.favoriteExercises')}</p>
          </div>
        </div>

        {/* Today Status */}
        {workoutStats && !statsLoading && (
          <div className={`mb-4 rounded-xl border p-4 ${workoutStats.checkedToday ? 'border-green-500/20 bg-green-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`h-5 w-5 ${workoutStats.checkedToday ? 'text-green-400' : 'text-orange-400'}`} />
                <span className={`font-medium text-sm ${workoutStats.checkedToday ? 'text-green-400' : 'text-orange-400'}`}>
                  {workoutStats.checkedToday ? t('profile.todayChecked') : t('profile.todayNotChecked')}
                </span>
              </div>
              {!workoutStats.checkedToday && (
                <button
                  onClick={() => navigate('/plans/plan-7day?day=1')}
                  className="rounded-lg bg-green-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-green-400 transition-colors"
                >
                  {t('profile.goTrain')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Workout Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            {t('profile.statsTitle')}
            <Link
              to="/records"
              className="text-xs font-normal text-green-400 hover:text-green-300 ml-auto"
            >
              {t('profile.viewDetails')}
            </Link>
          </h2>
          {statsLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center animate-pulse">
                  <div className="h-6 w-12 bg-zinc-800 rounded mx-auto mb-2" />
                  <div className="h-3 w-16 bg-zinc-800 rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : workoutStats && workoutStats.total > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{workoutStats.total}</p>
                <p className="text-xs text-zinc-500">{t('profile.totalTraining')}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <Flame className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{workoutStats.streak}</p>
                <p className="text-xs text-zinc-500">{t('profile.streak')}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
                <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{workoutStats.weekCount}</p>
                <p className="text-xs text-zinc-500">{t('profile.weeklyTraining')}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
              <Flame className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">{t('profile.noRecords')}</p>
              <p className="text-xs text-zinc-600 mt-1">{t('profile.noRecordsHint')}</p>
            </div>
          )}
        </div>

        {/* Favorites */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          {t('profile.myFavorites')}
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 mb-2">{t('profile.noFavorites')}</p>
            <p className="text-sm text-zinc-600">{t('profile.noFavoritesHint')}</p>
            <Link to="/courses" className="inline-block mt-4 text-green-400 hover:text-green-300">
              {t('profile.goExplore')}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {courses.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  {t('profile.coursesTab', { count: courses.length })}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {courses.map(item => (
                    <Link
                      key={item.id}
                      to={`/courses/${item.id}`}
                      className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 hover:border-green-500/40 transition-colors"
                    >
                      <img loading="lazy" src={item.thumbnail} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-zinc-500">{t('profile.courseLabel')}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {exercises.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  {t('profile.exercisesTab', { count: exercises.length })}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {exercises.map(item => (
                    <Link
                      key={item.id}
                      to={`/exercises/${item.id}`}
                      className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 hover:border-green-500/40 transition-colors"
                    >
                      <img loading="lazy" src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-zinc-500">{t('profile.exerciseLabel')}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Logout */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('profile.logout')}
        </button>
      </section>

      {/* Email binding dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('profile.bindDialogTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('profile.emailLabel')}</label>
              <input
                type="email"
                placeholder={t('profile.emailPlaceholder')}
                value={bindEmailInput}
                onChange={e => setBindEmailInput(e.target.value.trim())}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('login.codeLabel')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('profile.codePlaceholder')}
                  value={bindCodeInput}
                  onChange={e => setBindCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={handleSendEmailCode}
                  disabled={emailCountdown > 0 || !bindEmailInput.includes('@') || emailLoading}
                  className="shrink-0 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-medium text-green-400 hover:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                >
                  {emailCountdown > 0 ? t('login.resend', { count: emailCountdown }) : t('login.getCode')}
                </button>
              </div>
            </div>
            <button
              onClick={handleBindEmail}
              disabled={emailLoading || !bindCodeInput || bindCodeInput.length < 6}
              className="w-full rounded-lg bg-green-500 py-2.5 font-semibold text-black hover:bg-green-400 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {emailLoading ? t('profile.binding') : t('profile.confirmBind')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
