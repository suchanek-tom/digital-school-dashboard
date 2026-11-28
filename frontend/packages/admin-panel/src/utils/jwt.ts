export type JwtPayload = {
  sub?: string
  uid?: string
  username?: string
  exp?: number
  iat?: number
}

/**
 * Dekóduje payload JWT jen pro potřeby UI (e-mail uživatele, expirace).
 * Podpis se na klientovi neověřuje, to dělá backend u každého požadavku.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null

    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))

    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload
  } catch {
    return null
  }
}

/** Token bez claimu `exp` považujeme za neplatný. */
export function isTokenExpired(
  payload: JwtPayload | null,
  skewSeconds = 5,
): boolean {
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000
}
