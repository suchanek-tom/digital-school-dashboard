import { useState } from 'react'
import { LoaderCircle, LogOut } from 'lucide-react'
import { logout } from '../api/auth'
import { useAuthStore } from '../store/authStore'

/**
 * Dočasná hlavní stránka administrace. Slouží jako cíl přesměrování po
 * přihlášení; sidebar a sekce (Obrazovky, Nástěnky, Uživatelé) přijdou později.
 */
export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } catch {
      // I při chybě sítě nebo serveru se uživatel odhlásí lokálně.
    } finally {
      // ProtectedRoute po smazání relace přesměruje na /login.
      clearSession()
    }
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      <header className="flex items-center justify-between bg-[#0D47A1] px-6 py-4 text-white">
        <h1 className="text-2xl font-bold md:text-3xl">Digitální nástěnka</h1>

        <div className="flex items-center gap-4">
          {user && <span className="hidden text-sm sm:inline">{user.email}</span>}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingOut ? (
              <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogOut size={16} aria-hidden="true" />
            )}
            Odhlásit se
          </button>
        </div>
      </header>

      <main className="px-6 py-8">
        <h2 className="mb-2 text-3xl font-bold text-[#0D47A1]">Administrace</h2>
        <p className="text-base text-[#2196F3]">Přihlášení proběhlo úspěšně.</p>
      </main>
    </div>
  )
}
