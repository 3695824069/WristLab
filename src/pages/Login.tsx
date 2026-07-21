import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Phone, MessageSquare, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { sendCode, login } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login: authLogin } = useAuth()

  const [loginMethod, setLoginMethod] = useState<'wechat' | 'sms'>('sms')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSendCode = async () => {
    if (!phone || phone.length < 11) return
    if (countdown > 0) return

    setLoading(true)
    try {
      await sendCode(phone)
      toast.success(t('login.toastCodeSent'))

      // Countdown
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || t('login.toastSendFail'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!phone || phone.length < 11) {
      toast.error(t('login.toastPhoneInvalid'))
      return
    }
    if (!code || code.length < 4) {
      toast.error(t('login.toastCodeInvalid'))
      return
    }

    setLoading(true)
    try {
      const res = await login(phone, code)
      authLogin(res.data.token, res.data.user)
      toast.success(t('login.toastLoginSuccess'))
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || t('login.toastLoginFail'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl text-green-500 mb-2">
            <Flame className="h-7 w-7" />
            WristLab
          </div>
          <p className="text-zinc-500 text-sm">{t('login.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold text-center">{t('login.title')}</h2>

          {/* Login Method Tabs */}
          <div className="flex rounded-lg bg-zinc-800/50 p-1">
            <button
              onClick={() => setLoginMethod('sms')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'sms'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Phone className="h-4 w-4" />
              {t('login.phoneLogin')}
            </button>
            <button
              onClick={() => setLoginMethod('wechat')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'wechat'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <QrCode className="h-4 w-4" />
              {t('login.wechatLogin')}
            </button>
          </div>

          {loginMethod === 'sms' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">{t('login.phoneLabel')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder={t('login.phonePlaceholder')}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">{t('login.codeLabel')}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={t('login.codePlaceholder')}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0 || phone.length < 11 || loading}
                    className="shrink-0 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-medium text-green-400 hover:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                  >
                    {countdown > 0 ? t('login.resend', { count: countdown }) : t('login.getCode')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* WeChat Login */
            <div className="py-4 text-center">
              <div className="inline-block rounded-2xl bg-white p-4 mb-4">
                <div className="w-44 h-44 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-3">
                    <div className="grid grid-cols-7 grid-rows-7 gap-px">
                      {Array.from({ length: 49 }).map((_, i) => {
                        const row = Math.floor(i / 7)
                        const col = i % 7
                        const isCorner =
                          (row < 2 && col < 2) ||
                          (row < 2 && col > 4) ||
                          (row > 4 && col < 2)
                        const isDot = (row + col) % 3 === 0 || (row * col) % 5 === 0
                        return (
                          <div
                            key={i}
                            className={`rounded-sm ${isCorner || isDot ? 'bg-gray-800' : 'bg-transparent'}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#07C160] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">W</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] mt-2">{t('login.wechatHint')}</p>
              </div>
              <p className="text-zinc-400 text-sm mb-1">{t('login.wechatDesc')}</p>
              <p className="text-zinc-600 text-xs flex items-center justify-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-[#07C160]"></span>
                {t('login.wechatConfirm')}
              </p>
            </div>
          )}

          {/* Submit */}
          {loginMethod === 'sms' && (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-lg bg-green-500 py-2.5 font-semibold text-black hover:bg-green-400 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {loading ? t('login.loggingIn') : t('login.loginButton')}
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-zinc-500 hover:text-green-400 transition-colors">
            {t('login.backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
