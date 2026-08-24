import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('i18n initialization', () => {
  beforeEach(() => {
    // Clean up: remove any stored language and reset modules
    localStorage.clear()
    // Reset i18n module registry so each test gets a fresh init
    vi.resetModules()
  })

  it('defaults to zh-CN with no browser language or stored preference', async () => {
    const i18n = (await import('../i18n')).default
    expect(i18n.language).toBe('zh-CN')
  })

  it('reads stored language from localStorage', async () => {
    localStorage.setItem('wristlab_language', 'en-US')
    const i18n = (await import('../i18n')).default
    expect(i18n.language).toBe('en-US')
  })

  it('has zh-CN and en-US resources loaded', async () => {
    const i18n = (await import('../i18n')).default
    expect(i18n.hasResourceBundle('zh-CN', 'translation')).toBe(true)
    expect(i18n.hasResourceBundle('en-US', 'translation')).toBe(true)
  })

  it('falls back to zh-CN for unknown languages', async () => {
    const i18n = (await import('../i18n')).default
    // i18next uses the fallback
    expect(i18n.options.fallbackLng).toContain('zh-CN')
  })

  it('persists language changes to localStorage', async () => {
    const i18n = (await import('../i18n')).default
    await i18n.changeLanguage('en-US')
    expect(localStorage.getItem('wristlab_language')).toBe('en-US')
    expect(i18n.language).toBe('en-US')
  })

  it('contains expected translation keys in zh-CN', async () => {
    const i18n = (await import('../i18n')).default
    expect(i18n.t('nav.home')).toBeTruthy()
    expect(i18n.t('search.title')).toBeTruthy()
    expect(i18n.t('footer.copyright', { year: 2026 })).toBeTruthy()
  })
})
