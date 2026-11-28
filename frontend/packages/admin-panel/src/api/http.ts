import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8081'

/** Endpointy bez autentizace (viz docs/api-doc.md). */
const PUBLIC_PATHS = ['/api/v1/auth/authenticate', '/api/v1/auth/register']

function isPublicRequest(url: string | undefined): boolean {
  return !!url && PUBLIC_PATHS.some((path) => url.startsWith(path))
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  // Refresh token je v HttpOnly cookie, kterou musí prohlížeč posílat.
  withCredentials: true,
  timeout: 15_000,
})

// Ke každému dalšímu požadavku automaticky přiložíme access token.
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token && !isPublicRequest(config.url)) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

// 401 z chráněného endpointu = token vypršel nebo je neplatný. Smažeme
// relaci, ProtectedRoute pak uživatele přesměruje na /login.
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isPublicRequest(error.config?.url)
    ) {
      useAuthStore.getState().clearSession()
    }

    return Promise.reject(error)
  },
)
