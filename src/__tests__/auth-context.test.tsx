import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'fithub_auth'

// ─── Helper ───

function TestDisplay() {
  const { user, token, loading, login, logout, updateUser } = useAuth()
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="token">{token ?? '(null)'}</div>
      <div data-testid="user-nick">{user?.nickname ?? '(null)'}</div>
      <div data-testid="user-phone">{user?.phone ?? '(null)'}</div>
      <div data-testid="user-email">{user?.email ?? '(null)'}</div>
      <div data-testid="user-avatar">{user?.avatar ?? '(null)'}</div>
      <button
        data-testid="btn-login"
        onClick={() =>
          login('token-abc', {
            id: 1,
            phone: '13800138000',
            nickname: 'TestUser',
            avatar: '/avatar.png',
            email: 'test@test.com',
          })
        }
      >
        Login
      </button>
      <button data-testid="btn-logout" onClick={logout}>
        Logout
      </button>
      <button
        data-testid="btn-update"
        onClick={() =>
          updateUser({
            id: 1,
            phone: '13800138000',
            nickname: 'UpdatedName',
            avatar: '/new-avatar.png',
            email: 'test@test.com',
          })
        }
      >
        Update
      </button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestDisplay />
    </AuthProvider>,
  )
}

function expectUserDisplayed(nickname: string, phone: string) {
  expect(screen.getByTestId('user-nick').textContent).toBe(nickname)
  expect(screen.getByTestId('user-phone').textContent).toBe(phone)
}

// ─── Tests ───

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders children without crashing', () => {
    render(
      <AuthProvider>
        <div data-testid="child">ok</div>
      </AuthProvider>,
    )
    expect(screen.getByTestId('child')).toBeTruthy()
  })

  it('starts with null user, null token, and loading resolved', async () => {
    renderWithProvider()
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('token').textContent).toBe('(null)')
    expect(screen.getByTestId('user-nick').textContent).toBe('(null)')
  })

  it('restores session from localStorage on mount', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: 'restored-token',
        user: { id: 2, phone: '13900001111', nickname: 'RestoredUser', avatar: '' },
      }),
    )

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('token').textContent).toBe('restored-token')
    expect(screen.getByTestId('user-nick').textContent).toBe('RestoredUser')
  })

  it('handles corrupted localStorage gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, ':::invalid-json:::')

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    // Must have cleared the corrupted data
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    // State remains empty
    expect(screen.getByTestId('token').textContent).toBe('(null)')
  })

  it('login updates state and persists to localStorage', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    screen.getByTestId('btn-login').click()

    await waitFor(() => {
      expect(screen.getByTestId('token').textContent).toBe('token-abc')
    })
    expectUserDisplayed('TestUser', '13800138000')

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.token).toBe('token-abc')
    expect(stored.user.nickname).toBe('TestUser')
  })

  it('logout clears state and removes localStorage', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    // Login first
    screen.getByTestId('btn-login').click()
    await waitFor(() => {
      expect(screen.getByTestId('token').textContent).toBe('token-abc')
    })

    // Then logout
    screen.getByTestId('btn-logout').click()

    await waitFor(() => {
      expect(screen.getByTestId('token').textContent).toBe('(null)')
    })
    expect(screen.getByTestId('user-nick').textContent).toBe('(null)')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('updateUser updates user state and persists to localStorage', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    // Login
    screen.getByTestId('btn-login').click()
    await waitFor(() => {
      expect(screen.getByTestId('user-nick').textContent).toBe('TestUser')
    })

    // Update
    screen.getByTestId('btn-update').click()

    await waitFor(() => {
      expect(screen.getByTestId('user-nick').textContent).toBe('UpdatedName')
    })
    expect(screen.getByTestId('user-avatar').textContent).toBe('/new-avatar.png')

    // Verify persistence
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.user.nickname).toBe('UpdatedName')
  })

  it('supports email field in user object', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: 't',
        user: { id: 3, phone: '13700000000', nickname: 'EmailUser', avatar: '', email: 'user@example.com' },
      }),
    )

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('user-email').textContent).toBe('user@example.com')
  })
})

describe('useAuth()', () => {
  it('throws when used outside AuthProvider', () => {
    // Suppress console.error from React error boundary
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestDisplay />)).toThrow('useAuth must be used within AuthProvider')
    spy.mockRestore()
  })
})
