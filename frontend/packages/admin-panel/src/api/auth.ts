import { http } from './http'

type AuthResponse = {
  access_token: string
}

/** POST /api/v1/auth/authenticate, vrací access token. */
export async function login(email: string, password: string): Promise<string> {
  const { data } = await http.post<AuthResponse>('/api/v1/auth/authenticate', {
    email,
    password,
  })

  if (!data?.access_token) {
    throw new Error('Odpověď serveru neobsahuje access_token.')
  }

  return data.access_token
}

/** POST /api/v1/auth/logout, zneplatní refresh tokeny uživatele. */
export async function logout(): Promise<void> {
  await http.post('/api/v1/auth/logout')
}
