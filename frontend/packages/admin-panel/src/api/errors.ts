import axios from 'axios'

/** Převede chybu přihlášení na srozumitelnou hlášku pro uživatele. */
export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Žádná odpověď = výpadek sítě, nedostupný server nebo timeout.
    if (!error.response) {
      return 'Server není dostupný. Zkontrolujte připojení k síti a zkuste to znovu.'
    }

    if (error.response.status === 401) {
      return 'Nesprávný e-mail nebo heslo.'
    }

    if (error.response.status === 400) {
      return 'Neplatný požadavek. Zkontrolujte zadané údaje.'
    }
  }

  return 'Přihlášení se nezdařilo. Zkuste to prosím později.'
}
