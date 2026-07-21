import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flame, User, Search, LogOut, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/courses', label: t('nav.courses') },
    { to: '/exercises', label: t('nav.exercises') },
    { to: '/plans', label: t('nav.plans') },
    { to: '/knowledge', label: t('nav.knowledge') },
    { to: '/about', label: t('nav.about') },
  ]

  const isActive = (to: string) =>
    pathname === to || (to !== '/' && pathname.startsWith(to))

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-green-500 shrink-0">
          <Flame className="h-6 w-6" />
          <span className="hidden sm:inline">WristLab</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-zinc-800 text-green-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label={t('common.search')}
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            /* Logged in */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                  {user.phone.slice(-2)}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {user.nickname || user.phone.slice(-4)}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg py-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/records"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      <Activity className="h-4 w-4" />
                      {t('nav.records')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{t('nav.login')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="border-t border-zinc-800 bg-zinc-900/80 px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement
                    if (target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(target.value.trim())}`)
                      setSearchOpen(false)
                    }
                  }
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-800 px-2 py-1">
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isActive(to)
                ? 'text-green-400'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
