import { create } from 'zustand'
import { decodeJwt, isTokenExpired } from '../utils/jwt'

export const TOKEN_STORAGE_KEY = 'dd.accessToken'

export type AuthUser = {
  uid: string | null
  email: string
  username: string | null
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  setSession: (token: string) => void
  clearSession: () => void
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    // localStorage nemusí být dostupné (privátní režim); přihlášení pak
    // platí jen do znovunačtení stránky.
  }
}

function buildUser(token: string): AuthUser | null {
  const payload = decodeJwt(token)
  if (!payload?.sub) return null

  return {
    uid: payload.uid ?? null,
    email: payload.sub,
    username: payload.username ?? null,
  }
}

/** Obnoví přihlášení po F5. Prošlý nebo poškozený token se zahodí. */
function loadInitialSession(): Pick<AuthState, 'token' | 'user'> {
  const token = readStoredToken()
  if (!token) return { token: null, user: null }

  const payload = decodeJwt(token)
  if (!payload || isTokenExpired(payload)) {
    writeStoredToken(null)
    return { token: null, user: null }
  }

  return { token, user: buildUser(token) }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitialSession(),

  setSession: (token) => {
    writeStoredToken(token)
    set({ token, user: buildUser(token) })
  },

  clearSession: () => {
    writeStoredToken(null)
    set({ token: null, user: null })
  },
}))

// Odhlášení nebo přihlášení v jiné záložce se projeví i v této.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === TOKEN_STORAGE_KEY || event.key === null) {
      useAuthStore.setState(loadInitialSession())
    }
  })
}
